const Project = require('../models/Project');

// @desc    Get all projects (with pagination)
// @route   GET /api/v1/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        
        // If not admin, only show own projects
        if (req.user.role !== 'admin') {
            query.owner = req.user.id;
        }

        const total = await Project.countDocuments(query);
        const projects = await Project.find(query)
            .populate('owner', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: projects.length,
            total,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data: projects
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id).populate('owner');
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create project
// @route   POST /api/v1/projects
// @access  Private
exports.createProject = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.owner = req.user.id;
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/v1/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, error: 'Project not found' });
        }
        await project.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
