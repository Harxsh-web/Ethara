const express = require('express');
const {
    getTasks,
    getTask,
    addTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(getTasks)
    .post(addTask);

router
    .route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;
