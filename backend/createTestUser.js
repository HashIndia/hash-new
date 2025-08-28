import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'testuser@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      phone: '+1234567890',
      status: 'active',
      isPhoneVerified: true
    });

    console.log('Test user created:', testUser.email);

    // Create another test user
    const testUser2 = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
      phone: '+1234567891',
      status: 'active',
      isPhoneVerified: false
    });

    console.log('Second test user created:', testUser2.email);

    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
