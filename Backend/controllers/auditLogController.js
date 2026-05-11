const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs
// @route   GET /api/v1/audit-logs
// @access  Private/Admin
exports.getAuditLogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const total = await AuditLog.countDocuments();
        const logs = await AuditLog.find()
            .populate('user', 'name email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: logs.length,
            total,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data: logs
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
