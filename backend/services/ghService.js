const axios = require('axios');

class GitHubService {
  async fetchIssues() {
    try {
      const res = await axios.get(
        'https://api.github.com/search/issues?q=label:help-wanted+label:hiring&sort=created&per_page=30'
      );

      const issues = [];

      for (const issue of res.data.items) {
        const body = (issue.body || '').substring(0, 2000);
        if (!body || body.length < 20) continue;

        issues.push({
          source_id: `gh_${issue.id}`,
          title: issue.title,
          body: body,
          source: 'github',
          url: issue.html_url,
          author: issue.user.login,
          posted_at: new Date(issue.created_at),
          emails: this.extractEmails(body),
          phones: this.extractPhones(body),
          discord: this.extractDiscord(body),
          telegram: this.extractTelegram(body),
          website: this.extractWebsite(body)
        });
      }

      return issues;
    } catch (err) {
      console.error('GitHub Error:', err.message);
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
    const match = text.match(/discord\.gg\/[a-zA-Z0-9]+/i);
    return match ? match[0] : null;
  }

  extractTelegram(text) {
    const match = text.match(/t\.me\/[\w]+/i);
    return match ? match[0] : null;
  }

  extractWebsite(text) {
    const match = text.match(/https?:\/\/[^\s]+/);
    return match ? match[0] : null;
  }
}

module.exports = new GitHubService();
