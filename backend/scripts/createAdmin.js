import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check for existing admins
    const existingAdmins = await Admin.find({});
    console.log(`Found ${existingAdmins.length} existing admin(s)`);
    
    // Log all existing admins
    existingAdmins.forEach((admin, index) => {
      console.log(`Admin ${index + 1}:`, {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        hasPassword: !!admin.password,
        createdAt: admin.createdAt
      });
    });

    // Remove all existing admins to start fresh
    if (existingAdmins.length > 0) {
      console.log('🧹 Removing existing admin(s) to start fresh...');
      await Admin.deleteMany({});
      console.log('✅ Existing admins removed');
    }

    console.log('📝 Creating new admin...');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    console.log('🔐 Password hashed successfully');
    console.log('🔐 Hash length:', hashedPassword.length);

    // Create admin
    const adminData = {
      name: 'Hash Admin',
      email: 'admin@hash.com',
      password: hashedPassword,
      role: 'super_admin',
      permissions: ['products', 'orders', 'customers', 'analytics', 'settings'],
      status: 'active'
    };

    console.log('Creating admin with data:', {
      name: adminData.name,
      email: adminData.email,
      hasPassword: !!adminData.password,
      role: adminData.role,
      status: adminData.status
    });

    const admin = new Admin(adminData);
    const savedAdmin = await admin.save();
    
    console.log('✅ Admin created successfully');
    console.log('📧 Email: admin@hash.com');
    console.log('🔑 Password: admin123');
    console.log('🆔 Admin ID:', savedAdmin._id);
    console.log('🔒 Password hash length:', savedAdmin.password?.length || 0);
    
    // Verify the admin was saved correctly by refetching
    const verifyAdmin = await Admin.findById(savedAdmin._id);
    console.log('✅ Verification - Admin found:', !!verifyAdmin);
    console.log('✅ Verification - Has password:', !!verifyAdmin?.password);
    console.log('✅ Verification - Password length:', verifyAdmin?.password?.length || 0);
    console.log('✅ Verification - Email:', verifyAdmin?.email);
    console.log('✅ Verification - Role:', verifyAdmin?.role);
    
    // Only test password if we have both password and hash
    if (verifyAdmin?.password) {
      try {
        const testMatch = await bcrypt.compare('admin123', verifyAdmin.password);
        console.log('✅ Verification - Password test:', testMatch);
      } catch (compareError) {
        console.error('❌ Password comparison test failed:', compareError.message);
      }
    } else {
      console.error('❌ Cannot test password - admin or password is missing');
    }
    
    console.log('🎉 Admin setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

createAdmin();
