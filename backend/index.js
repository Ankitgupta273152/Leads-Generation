require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const leadRoutes = require('./routes/leads');
const cronService = require('./services/cronService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ DB Connected'))
  .catch(err => console.log('❌ DB Error:', err.message));

// Health check (for K8s probes)
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'ok', db: dbState });
});

// Routes
app.use('/api/leads', leadRoutes);

// Start cron
if (process.env.NODE_ENV === 'production') {
  cronService.start();
} else {
  console.log('Dev mode - start cron with POST /api/cron/start');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
