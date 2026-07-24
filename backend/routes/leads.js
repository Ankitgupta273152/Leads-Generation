const express = require('express');
const leadController = require('../controllers/leadController');

const router = express.Router();

router.get('/', leadController.getAll);
router.get('/stats', leadController.getStats);
router.get('/search', leadController.search);
router.get('/export', leadController.export);
router.get('/:id', leadController.getOne);
router.patch('/:id', leadController.update);

router.post('/run', leadController.runNow);
router.post('/cron/start', leadController.startCron);
router.post('/cron/stop', leadController.stopCron);

module.exports = router;
