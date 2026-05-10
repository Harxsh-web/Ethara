const express = require('express');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

// Include other resource routers
const taskRouter = require('./tasks');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:projectId/tasks', taskRouter);

router.use(protect);

router
    .route('/')
    .get(getProjects)
    .post(createProject);

router
    .route('/:id')
    .get(getProject)
    .put(updateProject)
    .delete(deleteProject);

module.exports = router;
