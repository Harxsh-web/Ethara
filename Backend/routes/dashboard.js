const express = require('express');
const { getStats } = require('../controllers/dashboardController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.get('/stats', protect, getStats);

module.exports = router;
