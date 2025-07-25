import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Generate JWT token
const signToken = (id, role = 'user') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and send JWT token
const createSendToken = (user, statusCode, res, message = 'Success') => {
  const token = signToken(user._id, user.role || 'user');
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user
    }
  });
};

// Protect routes - verify JWT token
const protect = (userType = 'user') => {
  return catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists and get the right model
    let currentUser;
    const Model = userType === 'admin' ? Admin : User;
    
    currentUser = await Model.findById(decoded.id).select('+password');
    
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }

    // 4) Check if user is active
    if (currentUser.isActive === false) {
      return next(new AppError('Your account has been deactivated.', 401));
    }

    // 5) Check if admin account is locked (for admin users)
    if (userType === 'admin' && currentUser.isLocked) {
      return next(
        new AppError('Account is temporarily locked due to multiple failed login attempts.', 423)
      );
    }

    // 6) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // 7) Update last login for admin users
    if (userType === 'admin') {
      currentUser.lastLogin = new Date();
      await currentUser.save({ validateBeforeSave: false });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    req.userType = userType;
    res.locals.user = currentUser;
    next();
  });
};

// Protect user routes
const protectUser = protect('user');

// Protect admin routes
const protectAdmin = protect('admin');

// Restrict to certain roles (for admin users)
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// Check specific permissions (for admin users)
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.hasPermission || !req.user.hasPermission(permission)) {
      return next(
        new AppError(`You do not have ${permission} permission`, 403)
      );
    }
    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = (userType = 'user') => {
  return catchAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const Model = userType === 'admin' ? Admin : User;
      const currentUser = await Model.findById(decoded.id);
      
      if (currentUser && currentUser.isActive !== false) {
        req.user = currentUser;
        req.userType = userType;
        res.locals.user = currentUser;
      }
    } catch (error) {
      // Invalid token - continue without user
    }

    next();
  });
};

// Check if user is verified (has verified email/phone)
const requireVerification = (type = 'email') => {
  return (req, res, next) => {
    if (type === 'email' && !req.user.isEmailVerified) {
      return next(
        new AppError('Please verify your email address to continue', 403)
      );
    }
    
    if (type === 'phone' && !req.user.isPhoneVerified) {
      return next(
        new AppError('Please verify your phone number to continue', 403)
      );
    }
    
    next();
  };
};

// Rate limiting for sensitive operations
const sensitiveOpLimit = (windowMs = 15 * 60 * 1000, max = 5) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = req.ip + (req.user ? req.user._id : '');
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, []);
    }
    
    const userAttempts = attempts.get(key);
    
    // Remove old attempts outside the window
    while (userAttempts.length > 0 && userAttempts[0] < now - windowMs) {
      userAttempts.shift();
    }
    
    if (userAttempts.length >= max) {
      return next(
        new AppError('Too many attempts, please try again later', 429)
      );
    }
    
    userAttempts.push(now);
    next();
  };
};

// Logout
const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({ 
    status: 'success',
    message: 'Logged out successfully'
  });
};

export {
  signToken,
  createSendToken,
  protect,
  protectUser,
  protectAdmin,
  restrictTo,
  requirePermission,
  optionalAuth,
  requireVerification,
  sensitiveOpLimit,
  logout
}; 