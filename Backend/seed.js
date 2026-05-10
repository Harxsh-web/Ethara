const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@gmail.com' });

        if (adminExists) {
            console.log('Admin user already exists. Updating password and role...');
            adminExists.password = 'Admin@123';
            adminExists.role = 'admin';
            adminExists.name = 'Ethara Admin';
            await adminExists.save();
        } else {
            console.log('Creating new Admin user...');
            await User.create({
                name: 'Ethara Admin',
                email: 'admin@gmail.com',
                password: 'Admin@123',
                role: 'admin'
            });
        }

        console.log('Admin seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
