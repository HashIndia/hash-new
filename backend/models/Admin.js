import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'manager', 'support'],
    default: 'admin'
  },
  permissions: [{
    type: String,
    enum: [
      'users.read', 'users.write', 'users.delete',
      'products.read', 'products.write', 'products.delete',
      'orders.read', 'orders.write', 'orders.delete',
      'analytics.read', 
      'settings.read', 'settings.write',
      'campaigns.read', 'campaigns.write', 'campaigns.delete',
      'inventory.read', 'inventory.write',
      'reports.read', 'reports.generate'
    ]
  }],
  avatar: String,
  phone: String,
  department: {
    type: String,
    enum: ['management', 'sales', 'support', 'marketing', 'operations'],
    default: 'management'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Indexes
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ isActive: 1 });

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = new Date();
  next();
});

// Compare password method
adminSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if account is locked
adminSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Increment login attempts
adminSchema.methods.incLoginAttempts = function() {
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we hit max attempts and it's not locked yet, lock it
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
adminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Check permissions
adminSchema.methods.hasPermission = function(permission) {
  if (this.role === 'super_admin') return true;
  return this.permissions.includes(permission);
};

// Check if password was changed after JWT was issued
adminSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Set default permissions based on role
adminSchema.pre('save', function(next) {
  if (!this.isNew && !this.isModified('role')) return next();
  
  switch (this.role) {
    case 'super_admin':
      // Super admin gets all permissions
      this.permissions = [
        'users.read', 'users.write', 'users.delete',
        'products.read', 'products.write', 'products.delete',
        'orders.read', 'orders.write', 'orders.delete',
        'analytics.read', 
        'settings.read', 'settings.write',
        'campaigns.read', 'campaigns.write', 'campaigns.delete',
        'inventory.read', 'inventory.write',
        'reports.read', 'reports.generate'
      ];
      break;
    case 'admin':
      this.permissions = [
        'users.read', 'users.write',
        'products.read', 'products.write',
        'orders.read', 'orders.write',
        'analytics.read',
        'campaigns.read', 'campaigns.write',
        'inventory.read', 'inventory.write',
        'reports.read'
      ];
      break;
    case 'manager':
      this.permissions = [
        'users.read',
        'products.read', 'products.write',
        'orders.read', 'orders.write',
        'analytics.read',
        'inventory.read', 'inventory.write'
      ];
      break;
    case 'support':
      this.permissions = [
        'users.read',
        'orders.read', 'orders.write',
        'products.read'
      ];
      break;
  }
  
  next();
});

export default mongoose.model('Admin', adminSchema); 