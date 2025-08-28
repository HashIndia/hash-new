import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import RefreshToken from '../models/RefreshToken.js';
import { 
  createSendTokens, 
  clearAuthCookies 
} from '../utils/tokenUtils.js';
import jwt from 'jsonwebtoken';

// Admin Login
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  console.log('[admin login] Attempting login for:', email);
  
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const admin = await Admin.findOne({ email }).select('+password +loginAttempts +lockUntil');
  
  if (!admin) {
    console.log('[admin login] Admin not found for email:', email);
    return next(new AppError('Invalid credentials', 401));
  }

  console.log('[admin login] Admin found, checking password...');
  console.log('[admin login] Admin status:', admin.status);
  console.log('[admin login] Admin role:', admin.role);

  if (!(await admin.correctPassword(password, admin.password))) {
    console.log('[admin login] Invalid password for admin:', email);
    if (admin.incLoginAttempts) await admin.incLoginAttempts();
    return next(new AppError('Invalid credentials', 401));
  }

  if (admin.isLocked) {
    return next(new AppError('Account locked due to too many failed login attempts.', 403));
  }

  // Reset login attempts on successful login
  admin.loginAttempts = 0;
  admin.lastLogin = Date.now();
  await admin.save({ validateBeforeSave: false });

  console.log('[admin login] Login successful for:', email);

  await createSendTokens(admin, 200, res, req, 'admin');
});

// Admin Logout
export const logout = catchAsync(async (req, res, next) => {
  const token = req.cookies.adminRefreshToken;
  if (token) {
    await RefreshToken.findOneAndDelete({ token });
  }
  clearAuthCookies(res, 'admin');
  res.status(200).json({ status: 'success' });
});

// Admin Logout from all devices
export const logoutAll = catchAsync(async (req, res, next) => {
  // req.user is populated by the protectAdmin middleware
  await RefreshToken.deleteMany({ admin: req.user._id });
  clearAuthCookies(res, 'admin');
  res.status(200).json({ status: 'success', message: 'Logged out from all devices.' });
});

// Refresh Admin Token
export const refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.adminRefreshToken;
  
  console.log('[admin refreshToken] Refresh token request, token present:', !!token);
  
  if (!token) {
    return next(new AppError('You are not logged in.', 401));
  }

  const refreshTokenDoc = await RefreshToken.findOne({ token }).populate('admin');

  if (!refreshTokenDoc || !refreshTokenDoc.admin) {
    console.log('[admin refreshToken] Invalid refresh token');
    clearAuthCookies(res, 'admin');
    return next(new AppError('Invalid session. Please log in again.', 401));
  }

  if (refreshTokenDoc.expires < new Date()) {
    console.log('[admin refreshToken] Refresh token expired');
    await refreshTokenDoc.deleteOne();
    clearAuthCookies(res, 'admin');
    return next(new AppError('Session expired. Please log in again.', 401));
  }

  console.log('[admin refreshToken] Refresh successful for:', refreshTokenDoc.admin.email);
  await createSendTokens(refreshTokenDoc.admin, 200, res, req, 'admin');
});

// Get current admin profile
export const getMe = (req, res, next) => {
  console.log('[admin getMe] Getting current admin:', req.user?.email);
  
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
};

// --- Dashboard ---
export const getDashboardStats = catchAsync(async (req, res, next) => {
  // This is a placeholder. You would build complex aggregation pipelines here.
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  
  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalOrders,
      totalProducts,
    },
  });
});

// --- User Management ---
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// --- Order Management ---
export const getAllOrders = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status, search } = req.query;
  
  // Build query
  let query = {};
  
  // Filter by status if provided
  if (status && status !== 'all') {
    query.status = status;
  }
  
  // Search functionality
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shippingAddress.name': { $regex: search, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('items.product', 'name images price')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    
  const total = await Order.countDocuments(query);
  
  res.status(200).json({
    status: 'success',
    results: orders.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    data: { orders },
  });
});

export const getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name images price');

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  // Optionally, send an email notification to the user about the status update
  // await emailService.sendStatusUpdateEmail(order.user, order);

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});