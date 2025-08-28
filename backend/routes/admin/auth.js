import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Admin from '../../models/Admin.js';
import { protectAdmin } from '../../middleware/auth.js';
import { setAuthCookies, clearAuthCookies, generateTokens } from '../../utils/tokenUtils.js';

const router = express.Router();

// @route   POST /api/admin/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    console.log('[Admin Login] Attempting login for:', email);
    
    // Check if admin exists
    let admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    console.log('[Admin Login] Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      console.log('[Admin Login] Admin not found for email:', email);
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    // Check if password exists
    if (!admin.password) {
      console.error('[Admin Login] Admin has no password set');
      return res.status(500).json({ 
        status: 'error',
        message: 'Admin account configuration error. Please contact system administrator.' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('[Admin Login] Password match:', isMatch);
    
    if (!isMatch) {
      console.log('[Admin Login] Password mismatch for:', email);
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    // Generate tokens using centralized function
    const { accessToken, refreshToken } = generateTokens({
      id: admin._id,
      email: admin.email,
      role: admin.role
    }, 'admin');

    // Set cookies using centralized function
    setAuthCookies(res, accessToken, refreshToken, 'admin');
    
    console.log('[Admin Login] Login successful for:', email);

    res.json({
      status: 'success',
      token: accessToken,
      data: {
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (err) {
    console.error('Admin login error:', err.message);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/admin/auth/me
// @desc    Get current admin
// @access  Private (Admin)
router.get('/me', protectAdmin, async (req, res) => {
  try {
    res.json({ 
      data: {
        user: req.user 
      }
    });
  } catch (err) {
    console.error('Get admin error:', err.message);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/admin/auth/logout
// @desc    Admin logout
// @access  Private (Admin)
router.post('/logout', protectAdmin, async (req, res) => {
  try {
    // Clear admin cookies using centralized function
    clearAuthCookies(res, 'admin');
    res.json({ 
      status: 'success',
      message: 'Logged out successfully' 
    });
  } catch (err) {
    console.error('Admin logout error:', err.message);
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/admin/auth/refresh
// @desc    Refresh admin access token
// @access  Public (requires refresh token cookie)
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.adminRefreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token not found'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find admin
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      clearAuthCookies(res, 'admin');
      return res.status(401).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: admin._id,
      email: admin.email,
      role: admin.role
    }, 'admin');

    // Set new cookies
    setAuthCookies(res, accessToken, newRefreshToken, 'admin');

    res.json({
      status: 'success',
      token: accessToken,
      data: {
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (err) {
    console.error('Admin refresh token error:', err.message);
    clearAuthCookies(res, 'admin');
    res.status(401).json({
      status: 'error',
      message: 'Invalid refresh token'
    });
  }
});

export default router;
