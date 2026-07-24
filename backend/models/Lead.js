const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  source_id: { type: String, unique: true, index: true },
  title: String,
  body: String,
  source: String,
  url: String,
  author: String,
  posted_at: Date,

  emails: [String],
  phones: [String],
  discord: String,
  telegram: String,
  website: String,

  score: { type: Number, default: 0 },
  type: String,
  budget: String,
  timeline: String,
  summary: String,

  status: { type: String, default: 'new', enum: ['new', 'contacted', 'interested', 'rejected'] },
  notes: String,
  created_at: { type: Date, default: Date.now }
});

leadSchema.index({ score: -1 });
leadSchema.index({ created_at: -1 });
leadSchema.index({ status: 1 });

module.exports = mongoose.model('Lead', leadSchema);
