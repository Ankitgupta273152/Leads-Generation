const Lead = require('../models/Lead');
const cronService = require('../services/cronService');

class LeadController {
  async getAll(req, res) {
    try {
      const { status, page = 1, limit = 20, sort = '-score' } = req.query;
      const query = status ? { status } : {};
      
      const leads = await Lead.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Lead.countDocuments(query);

      res.json({ success: true, data: leads, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const lead = await Lead.findById(req.params.id);
      if (!lead) return res.status(404).json({ success: false, error: 'Not found' });
      res.json({ success: true, data: lead });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const { status, notes } = req.body;
      const lead = await Lead.findByIdAndUpdate(
        req.params.id,
        { status, notes },
        { new: true }
      );
      res.json({ success: true, data: lead });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { q } = req.query;
      const leads = await Lead.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { body: { $regex: q, $options: 'i' } },
          { emails: { $regex: q, $options: 'i' } }
        ]
      }).limit(50);
      
      res.json({ success: true, data: leads });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getStats(req, res) {
    try {
      const total = await Lead.countDocuments();
      const newLeads = await Lead.countDocuments({ status: 'new' });
      const contacted = await Lead.countDocuments({ status: 'contacted' });
      const interested = await Lead.countDocuments({ status: 'interested' });
      
      const avg = await Lead.aggregate([
        { $group: { _id: null, avgScore: { $avg: '$score' } } }
      ]);

      res.json({
        success: true,
        data: { total, newLeads, contacted, interested, avgScore: avg[0]?.avgScore || 0 }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async runNow(req, res) {
    try {
      const result = await cronService.runOnce();
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async export(req, res) {
    try {
      const { status } = req.query;
      const query = status ? { status } : {};
      const leads = await Lead.find(query);
      
      res.json({
        success: true,
        data: leads.map(l => ({
          title: l.title,
          emails: l.emails.join(', '),
          phones: l.phones.join(', '),
          website: l.website,
          score: l.score,
          type: l.type,
          url: l.url
        }))
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async startCron(req, res) {
    cronService.start();
    res.json({ success: true, message: 'Cron started' });
  }

  async stopCron(req, res) {
    cronService.stop();
    res.json({ success: true, message: 'Cron stopped' });
  }
}

module.exports = new LeadController();
