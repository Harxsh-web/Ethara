const express = require('express');
const { getAuditLogs } = require('../controllers/auditLogController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getAuditLogs);

module.exports = router;
