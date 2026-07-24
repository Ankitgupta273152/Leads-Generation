const cron = require('node-cron');
const Lead = require('../models/Lead');
const hnService = require('./hnService');
const ghService = require('./ghService');
const { scorePost, getType } = require('./scoreService');

class CronService {
  constructor() {
    this.job = null;
  }

  async runOnce() {
    console.log('⏱️  Starting fetch...');
    
    try {
      // Fetch from both sources
      const [hnJobs, ghIssues] = await Promise.all([
        hnService.fetchJobs(),
        ghService.fetchIssues()
      ]);

      const allPosts = [...hnJobs, ...ghIssues];
      console.log(`📥 Fetched ${allPosts.length} posts`);

      // Process each
      let saved = 0;
      for (const post of allPosts) {
        try {
          // Check if exists
          const exists = await Lead.findOne({ source_id: post.source_id });
          if (exists) continue;

          // Score it
          const text = (post.title + ' ' + post.body).toLowerCase();
          const score = scorePost(text);

          if (score < 30) continue; // Filter low quality

          // Create lead
          const lead = new Lead({
            ...post,
            score,
            type: getType(text),
            summary: post.title
          });

          await lead.save();
          saved++;
        } catch (e) {
          continue;
        }
      }

      console.log(`✅ Saved ${saved} new leads`);
      return { fetched: allPosts.length, saved };
    } catch (err) {
      console.error('❌ Cron Error:', err.message);
      return { error: err.message };
    }
  }

  start() {
    if (this.job) return;

    // Every hour
    this.job = cron.schedule('0 * * * *', () => this.runOnce());
    console.log('✅ Cron started (every hour)');
  }

  stop() {
    if (this.job) {
      this.job.stop();
      this.job = null;
      console.log('⏹️  Cron stopped');
    }
  }
}

module.exports = new CronService();
