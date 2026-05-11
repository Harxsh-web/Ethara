const Task = require('../models/Task');
const Project = require('../models/Project');
const logAudit = require('../middleware/audit');

// @desc    Get all tasks (with pagination)
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        let query = {};

        // If not admin, filter by user's projects
        if (req.user.role !== 'admin') {
            const projects = await Project.find({ owner: req.user.id });
            const projectIds = projects.map(p => p._id);
            query.project = { $in: projectIds };
        }

        const total = await Task.countDocuments(query);
        const tasks = await Task.find(query)
            .populate({
                path: 'project',
                populate: { path: 'owner', select: 'name email' }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: tasks.length,
            total,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data: tasks
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id).populate('project');
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Add task
// @route   POST /api/v1/tasks
// @access  Private
exports.addTask = async (req, res, next) => {
    try {
        const task = await Task.create(req.body);

        // Log activity
        await logAudit(req, 'CREATE_TASK', 'Task', task._id, { title: task.title, projectId: task.project });

        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }
        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Log activity
        await logAudit(req, 'UPDATE_TASK', 'Task', task._id, { title: task.title, updates: req.body });

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }
        await task.deleteOne();

        // Log activity
        await logAudit(req, 'DELETE_TASK', 'Task', req.params.id, { title: task.title });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
