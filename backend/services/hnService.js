const axios = require('axios');

class HackerNewsService {
  async fetchJobs() {
    try {
      // Get latest job IDs
      const res = await axios.get('https://hacker-news.firebaseio.com/v0/jobstories.json');
      const jobIds = res.data.slice(0, 50);

      const jobs = [];

      for (const id of jobIds) {
        try {
          const job = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          const text = (job.data.text || job.data.title || '').substring(0, 2000);

          if (!text || text.length < 20) continue;

          jobs.push({
            source_id: `hn_${id}`,
            title: job.data.title,
            body: text,
            source: 'hackernews',
            url: `https://news.ycombinator.com/item?id=${id}`,
            author: job.data.by || 'Anonymous',
            posted_at: new Date(job.data.time * 1000),
            emails: this.extractEmails(text),
            phones: this.extractPhones(text),
            discord: this.extractDiscord(text),
            telegram: this.extractTelegram(text),
            website: this.extractWebsite(text)
          });
        } catch (e) {
          continue;
        }
      }

      return jobs;
    } catch (err) {
      console.error('HN Error:', err.message);
      return [];
    }
  }

  extractEmails(text) {
    const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return (text.match(regex) || []).slice(0, 3);
  }

  extractPhones(text) {
    const regex = /(?:\+?\d{1,3}[-.\s]?)?\(?(?:\d{3}|\d{2})\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    return (text.match(regex) || []).slice(0, 2);
  }

  extractDiscord(text) {
    const match = text.match(/discord\.gg\/[a-zA-Z0-9]+|discord\.com[^\s]*/i);
    return match ? match[0] : null;
  }

  extractTelegram(text) {
    const match = text.match(/t\.me\/[\w]+|telegram\.me\/[\w]+/i);
    return match ? match[0] : null;
  }

  extractWebsite(text) {
    const match = text.match(/https?:\/\/[^\s]+/);
    return match ? match[0] : null;
  }
}

module.exports = new HackerNewsService();
