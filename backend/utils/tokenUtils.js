import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken.js';

// Simplified cookie options for development
const cookieOptions = {
  httpOnly: true,
  secure: false, // Always false for development
  sameSite: 'lax',
  path: '/',
};

// --- Access Token ---
const generateAccessToken = (id, userType = 'user') => {
  const secret = userType === 'admin' ? process.env.ADMIN_JWT_SECRET : process.env.JWT_SECRET;
  const expiresIn = userType === 'admin' ? process.env.ADMIN_JWT_EXPIRES_IN || '1h' : process.env.JWT_EXPIRES_IN || '15m';
  
  if (!secret) {
    throw new Error(`${userType.toUpperCase()}_JWT_SECRET environment variable is not set`);
  }
  
  return jwt.sign({ id }, secret, { expiresIn });
};

// --- Refresh Token ---
export const generateRefreshToken = async (user, userType, ip, userAgent) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresIn = userType === 'admin' ? 
    parseInt(process.env.ADMIN_REFRESH_EXPIRES_DAYS, 10) || 30 : 
    parseInt(process.env.REFRESH_EXPIRES_DAYS, 10) || 7;
  
  const expires = new Date();
  expires.setDate(expires.getDate() + expiresIn);

  const refreshTokenData = {
    token,
    expires,
    createdByIp: ip,
    userAgent
  };

  if (userType === 'admin') {
    refreshTokenData.admin = user._id;
  } else {
    refreshTokenData.user = user._id;
  }

  const refreshToken = await RefreshToken.create(refreshTokenData);
  return refreshToken.token;
};

// --- Set Cookies ---
export const setAuthCookies = (res, accessToken, refreshToken, userType) => {
  const prefix = userType === 'admin' ? 'admin' : 'user';
  
  // Very explicit cookie options for debugging
  const cookieOptions = {
    httpOnly: true,
    secure: false, // Always false for localhost
    sameSite: 'lax',
    path: '/',
    domain: undefined // No domain restriction for localhost
  };
  
  // Set access token cookie
  res.cookie(`${prefix}AccessToken`, accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  
  // Set refresh token cookie
  res.cookie(`${prefix}RefreshToken`, refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// --- Clear Cookies ---
export const clearAuthCookies = (res, userType) => {
  const prefix = userType === 'admin' ? 'admin' : 'user';
  
  res.clearCookie(`${prefix}AccessToken`);
  res.clearCookie(`${prefix}RefreshToken`);
};

// --- Main Token Creation and Sending Function ---
export const createSendTokens = async (user, statusCode, res, req, userType = 'user') => {
  try {
    const prefix = userType === 'admin' ? 'admin' : 'user';
    
    // Generate tokens
    const accessToken = generateAccessToken(user._id, userType);
    const refreshToken = await generateRefreshToken(
      user, 
      userType, 
      req.ip, 
      req.get('User-Agent') || 'Unknown'
    );
    
    setAuthCookies(res, accessToken, refreshToken, userType);

    // Remove sensitive data
    const userResponse = user.toObject ? user.toObject() : { ...user };
    delete userResponse.password;
    delete userResponse.loginAttempts;
    delete userResponse.lockUntil;

    // Send response with user data
    const responseData = {
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          department: user.department,
          permissions: user.permissions
        }
      }
    };

    res.status(statusCode).json(responseData);
  } catch (error) {
    throw error;
  }
};