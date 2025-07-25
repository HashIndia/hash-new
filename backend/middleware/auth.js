import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { 
  verifyAccessToken,
  extractTokensFromCookies,
  clearAuthCookies 
} from '../utils/tokenUtils.js';

// Protect routes - require authentication
export const protectUser = catchAsync(async (req, res, next) => {
  // 1) Getting token from cookies
  const { accessToken } = extractTokensFromCookies(req);

  if (!accessToken) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  try {
    // 2) Verify access token
    const decoded = verifyAccessToken(accessToken, 'user');

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id).select('+active');
    if (!currentUser) {
      clearAuthCookies(res, 'user');
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );
    }

    // 4) Check if user is active
    if (!currentUser.active) {
      clearAuthCookies(res, 'user');
      return next(
        new AppError('Your account has been deactivated. Please contact support.', 401)
      );
    }

    // 5) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      clearAuthCookies(res, 'user');
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    clearAuthCookies(res, 'user');
    return next(new AppError('Invalid or expired access token', 401));
  }
});

// Protect admin routes
export const protectAdmin = catchAsync(async (req, res, next) => {
  // 1) Getting token from cookies
  const { adminAccessToken } = extractTokensFromCookies(req);

  if (!adminAccessToken) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  try {
    // 2) Verify access token
    const decoded = verifyAccessToken(adminAccessToken, 'admin');

    // 3) Check if admin still exists
    const currentAdmin = await Admin.findById(decoded.id).select('+active');
    if (!currentAdmin) {
      clearAuthCookies(res, 'admin');
      return next(
        new AppError(
          'The admin belonging to this token does no longer exist.',
          401
        )
      );
    }

    // 4) Check if admin is active
    if (!currentAdmin.active) {
      clearAuthCookies(res, 'admin');
      return next(
        new AppError('Your admin account has been deactivated. Please contact support.', 401)
      );
    }

    // 5) Check if admin changed password after the token was issued
    if (currentAdmin.changedPasswordAfter && currentAdmin.changedPasswordAfter(decoded.iat)) {
      clearAuthCookies(res, 'admin');
      return next(
        new AppError('Admin recently changed password! Please log in again.', 401)
      );
    }

    // Grant access to protected route
    req.admin = currentAdmin;
    next();
  } catch (error) {
    clearAuthCookies(res, 'admin');
    return next(new AppError('Invalid or expired admin access token', 401));
  }
});

// Optional authentication - doesn't fail if no token
export const optionalAuth = catchAsync(async (req, res, next) => {
  const { accessToken } = extractTokensFromCookies(req);

  if (accessToken) {
    try {
      const decoded = verifyAccessToken(accessToken, 'user');
      const currentUser = await User.findById(decoded.id).select('+active');
      
      if (currentUser && currentUser.active) {
        req.user = currentUser;
      }
    } catch (error) {
      // Silently ignore invalid tokens for optional auth
    }
  }

  next();
});

// Restrict to certain roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

// Rate limiting for sensitive operations
export const sensitiveOpLimit = (req, res, next) => {
  // This would typically use a rate limiting library like express-rate-limit
  // For now, we'll just pass through
  next();
}; 