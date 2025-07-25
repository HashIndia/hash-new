import mongoose from 'mongoose';
import crypto from 'crypto';

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  type: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String,
  isRevoked: {
    type: Boolean,
    default: false
  }
});

// Index for automatic cleanup of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate refresh token
refreshTokenSchema.statics.generateToken = function() {
  return crypto.randomBytes(64).toString('hex');
};

// Instance method to check if token is expired
refreshTokenSchema.methods.isExpired = function() {
  return Date.now() >= this.expiresAt.getTime();
};

// Instance method to check if token is active
refreshTokenSchema.methods.isActive = function() {
  return !this.isRevoked && !this.isExpired();
};

// Instance method to revoke token
refreshTokenSchema.methods.revoke = function(ipAddress, userAgent) {
  this.isRevoked = true;
  this.revokedAt = new Date();
  this.revokedByIp = ipAddress;
  this.revokedByUserAgent = userAgent;
};

// Static method to revoke all tokens for a user
refreshTokenSchema.statics.revokeAllUserTokens = async function(userId, type = 'user') {
  const filter = type === 'user' ? { user: userId, type: 'user' } : { admin: userId, type: 'admin' };
  await this.updateMany(filter, { 
    isRevoked: true, 
    revokedAt: new Date() 
  });
};

// Static method to cleanup expired and revoked tokens
refreshTokenSchema.statics.cleanup = async function() {
  const expiredDate = new Date();
  await this.deleteMany({
    $or: [
      { expiresAt: { $lt: expiredDate } },
      { isRevoked: true, revokedAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } // Delete revoked tokens after 24 hours
    ]
  });
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken; 