const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');
    seedData();
  } catch (err) {
    console.error(err);
  }
};

const seedData = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });

    if (adminExists) {
      console.log('Admin user already exists. Updating password...');
      adminExists.password = 'Admin@123';
      adminExists.role = 'admin';
      adminExists.name = 'System Admin';
      await adminExists.save();
      console.log('Admin user updated!');
    } else {
      await User.create({
        name: 'System Admin',
        email: 'admin@gmail.com',
        password: 'Admin@123',
        role: 'admin'
      });
      console.log('Admin user created!');
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB();
