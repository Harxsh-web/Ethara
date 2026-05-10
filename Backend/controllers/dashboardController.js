const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/v1/dashboard/stats
// @access  Private
exports.getStats = async (req, res, next) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const now = new Date();
        
        // Calculate 7 days ago
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        let totalProjects, pendingTasks, inProgressTasks, completedTasks, totalUsers, trendData;

        if (isAdmin) {
            totalProjects = await Project.countDocuments();
            pendingTasks = await Task.countDocuments({ status: 'todo' });
            inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
            completedTasks = await Task.countDocuments({ status: 'done' });
            totalUsers = await User.countDocuments();

            // Aggregate global trend data for Admin
            const tasksByDay = await Task.aggregate([
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            trendData = fillMissingDays(tasksByDay, sevenDaysAgo);
        } else {
            totalProjects = await Project.countDocuments({ owner: req.user.id });
            const projects = await Project.find({ owner: req.user.id });
            const projectIds = projects.map(p => p._id);

            pendingTasks = await Task.countDocuments({ 
                project: { $in: projectIds }, 
                status: 'todo' 
            });
            inProgressTasks = await Task.countDocuments({ 
                project: { $in: projectIds }, 
                status: 'in-progress' 
            });
            completedTasks = await Task.countDocuments({ 
                project: { $in: projectIds }, 
                status: 'done' 
            });

            // Aggregate personal trend data for User
            const tasksByDay = await Task.aggregate([
                { $match: { project: { $in: projectIds }, createdAt: { $gte: sevenDaysAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            trendData = fillMissingDays(tasksByDay, sevenDaysAgo);
        }

        res.status(200).json({
            success: true,
            data: {
                totalProjects,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                totalUsers: isAdmin ? totalUsers : undefined,
                trendData
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Helper function to ensure all 7 days are present in trend data
function fillMissingDays(data, startDate) {
    const result = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = days[date.getDay()];
        
        const existingDay = data.find(d => d._id === dateStr);
        result.push({
            name: dayName,
            val: existingDay ? existingDay.count : 0
        });
    }
    
    return result;
}
