const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const MONGO_URI = "mongodb://localhost:27017/ethara_task_management";

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // 1. Create Users
        const usersData = [
            { name: 'User One', email: 'user1@test.com', password: 'password123', role: 'user' },
            { name: 'User Two', email: 'user2@test.com', password: 'password123', role: 'user' }
        ];

        const users = [];
        for (const u of usersData) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                const salt = await bcrypt.genSalt(10);
                u.password = await bcrypt.hash(u.password, salt);
                user = await User.create(u);
                console.log(`Created user: ${u.email}`);
            } else {
                console.log(`User already exists: ${u.email}`);
            }
            users.push(user);
        }

        // 2. Create Projects & Tasks
        for (const user of users) {
            console.log(`Generating data for ${user.name}...`);
            for (let p = 1; p <= 10; p++) {
                const project = await Project.create({
                    name: `${user.name} - Project ${p}`,
                    description: `Automated test project ${p} for ${user.name}`,
                    status: p % 3 === 0 ? 'completed' : 'in-progress',
                    owner: user._id
                });

                const tasksData = [];
                for (let t = 1; t <= 10; t++) {
                    tasksData.push({
                        title: `Task ${t} for ${project.name}`,
                        description: `Detailed task ${t} description`,
                        status: t % 3 === 0 ? 'done' : (t % 2 === 0 ? 'in-progress' : 'todo'),
                        priority: t % 3 === 0 ? 'high' : 'medium',
                        project: project._id,
                        dueDate: new Date(Date.now() + t * 24 * 60 * 60 * 1000)
                    });
                }
                await Task.insertMany(tasksData);
                console.log(`  - Created Project ${p} with 10 tasks`);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
