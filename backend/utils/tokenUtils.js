import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';

// Generate access token (short-lived)
export const generateAccessToken = (payload, type = 'user') => {
  const secret = type === 'admin' ? process.env.JWT_ADMIN_SECRET : process.env.JWT_SECRET;
  const expiresIn = type === 'admin' ? '2h' : '15m'; // Admin tokens last longer
  
  return jwt.sign(payload, secret, { 
    expiresIn,
    issuer: 'hash-store',
    audience: type
  });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = async (userId, type = 'user', ipAddress, userAgent) => {
  const token = RefreshToken.generateToken();
  
  const refreshTokenDoc = new RefreshToken({
    token,
    [type]: userId, // user or admin field
    type,
    ipAddress,
    userAgent,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
  
  await refreshTokenDoc.save();
  return token;
};

// Verify access token
export const verifyAccessToken = (token, type = 'user') => {
  try {
    const secret = type === 'admin' ? process.env.JWT_ADMIN_SECRET : process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = async (token, type = 'user') => {
  const refreshToken = await RefreshToken.findOne({ 
    token, 
    type,
    isRevoked: false 
  }).populate(type === 'user' ? 'user' : 'admin');
  
  if (!refreshToken) {
    throw new Error('Invalid refresh token');
  }
  
  if (refreshToken.isExpired()) {
    await refreshToken.deleteOne();
    throw new Error('Refresh token expired');
  }
  
  // Update last used
  refreshToken.lastUsed = new Date();
  await refreshToken.save();
  
  return refreshToken;
};

// Revoke refresh token
export const revokeRefreshToken = async (token, ipAddress, userAgent) => {
  const refreshToken = await RefreshToken.findOne({ token });
  
  if (refreshToken && refreshToken.isActive()) {
    refreshToken.revoke(ipAddress, userAgent);
    await refreshToken.save();
  }
};

// Revoke all refresh tokens for a user
export const revokeAllRefreshTokens = async (userId, type = 'user') => {
  await RefreshToken.revokeAllUserTokens(userId, type);
};

// Set secure cookie options
export const getCookieOptions = (maxAge = 7 * 24 * 60 * 60 * 1000) => ({ // 7 days default
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge,
  path: '/'
});

// Extract tokens from cookies
export const extractTokensFromCookies = (req) => {
  return {
    accessToken: req.cookies.accessToken,
    refreshToken: req.cookies.refreshToken,
    adminAccessToken: req.cookies.adminAccessToken,
    adminRefreshToken: req.cookies.adminRefreshToken
  };
};

// Clear authentication cookies
export const clearAuthCookies = (res, type = 'user') => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/'
  };
  
  if (type === 'user') {
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  } else {
    res.clearCookie('adminAccessToken', cookieOptions);
    res.clearCookie('adminRefreshToken', cookieOptions);
  }
};

// Set authentication cookies
export const setAuthCookies = (res, accessToken, refreshToken, type = 'user') => {
  const accessTokenOptions = getCookieOptions(15 * 60 * 1000); // 15 minutes
  const refreshTokenOptions = getCookieOptions(7 * 24 * 60 * 60 * 1000); // 7 days
  
  if (type === 'user') {
    res.cookie('accessToken', accessToken, accessTokenOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenOptions);
  } else {
    res.cookie('adminAccessToken', accessToken, accessTokenOptions);
    res.cookie('adminRefreshToken', refreshToken, refreshTokenOptions);
  }
}; 