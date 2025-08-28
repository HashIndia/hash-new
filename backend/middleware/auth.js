import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { clearAuthCookies } from '../utils/tokenUtils.js';

const protect = (userType = 'user') => 
  catchAsync(async (req, res, next) => {
    let token;
    const prefix = userType === 'admin' ? 'admin' : 'user';
    const cookieName = `${prefix}AccessToken`;

    // Don't log on every request to avoid spam
    if (req.url.includes('/me') || req.url.includes('/addresses')) {
      console.log('[auth] Checking authentication for:', userType, 'URL:', req.url);
    }

    if (req.cookies && req.cookies[cookieName]) {
      token = req.cookies[cookieName];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // Verification token
    const secret = userType === 'admin' ? process.env.ADMIN_JWT_SECRET : process.env.JWT_SECRET;
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      // Clear cookies on token verification failure to prevent loops
      clearAuthCookies(res, userType);
      return next(new AppError('Invalid token. Please log in again.', 401));
    }

    // Check if user still exists
    const Model = userType === 'admin' ? Admin : User;
    const currentUser = await Model.findById(decoded.id);
    if (!currentUser) {
      clearAuthCookies(res, userType);
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Check if user is active - fix the status check
    if (!currentUser.status || currentUser.status !== 'active') {
      // Set status to active if it doesn't exist (for existing users)
      if (!currentUser.status) {
        currentUser.status = 'active';
        await currentUser.save({ validateBeforeSave: false });
        console.log('[auth] Updated user status to active for:', currentUser.email);
      } else {
        clearAuthCookies(res, userType);
        return next(new AppError('Your account is inactive or suspended. Please contact support.', 403));
      }
    }

    req.user = currentUser;
    next();
  });

export const protectUser = protect('user');
export const protectAdmin = protect('admin');

// Middleware to restrict access to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(`[restrictTo] Checking if user role '${req.user.role}' is in allowed roles:`, roles);
    
    // Map 'admin' and 'superadmin' to actual model values
    const allowedRoles = roles.map(role => {
      if (role === 'admin') return ['admin', 'super_admin'];
      if (role === 'superadmin') return 'super_admin';
      return role;
    }).flat();
    
    if (!allowedRoles.includes(req.user.role)) {
      console.log(`[restrictTo] Access denied. User role '${req.user.role}' not in allowed roles:`, allowedRoles);
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    
    console.log(`[restrictTo] Access granted for role:`, req.user.role);
    next();
  };
};

// Rate limiter for sensitive operations like password reset
export const sensitiveOpLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});