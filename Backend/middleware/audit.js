const AuditLog = require('../models/AuditLog');

/**
 * Log an action to the audit log
 * @param {Object} req - Express request object
 * @param {String} action - Action performed (e.g., 'CREATE_PROJECT')
 * @param {String} resource - Resource affected (e.g., 'Project')
 * @param {String} resourceId - ID of the resource
 * @param {Object} details - Additional details/changes
 */
const logAudit = async (req, action, resource, resourceId = null, details = null) => {
  try {
    await AuditLog.create({
      user: req.user ? req.user.id : null,
      action,
      resource,
      resourceId,
      details,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
  } catch (err) {
    console.error('Audit Log Error:', err.message);
  }
};

module.exports = logAudit;
