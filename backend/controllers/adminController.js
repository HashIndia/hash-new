import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Campaign from '../models/Campaign.js';
import RefreshToken from '../models/RefreshToken.js';
import * as emailService from '../services/emailService.js';
import * as smsService from '../services/smsService.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken, 
  revokeRefreshToken,
  revokeAllRefreshTokens,
  setAuthCookies,
  clearAuthCookies,
  extractTokensFromCookies
} from '../utils/tokenUtils.js';

// Admin Authentication
export const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const admin = await Admin.findOne({ email }).select('+password +loginAttempts +lockUntil');

  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    // Handle failed login attempts
    if (admin) {
      await admin.incLoginAttempts();
    }
    return next(new AppError('Incorrect email or password', 401));
  }

  // Check if account is locked
  if (admin.isLocked) {
    return next(new AppError('Admin account is temporarily locked due to too many failed login attempts. Please try again later.', 423));
  }

  // Reset login attempts on successful login
  if (admin.loginAttempts && admin.loginAttempts > 0) {
    await admin.updateOne({
      $unset: { loginAttempts: 1, lockUntil: 1 }
    });
  }

  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  // Generate tokens
  const accessToken = generateAccessToken({ id: admin._id, role: admin.role || 'admin' }, 'admin');
  const refreshToken = await generateRefreshToken(
    admin._id, 
    'admin', 
    req.ip, 
    req.get('User-Agent')
  );

  // Set secure HTTP-only cookies
  setAuthCookies(res, accessToken, refreshToken, 'admin');

  // Remove sensitive data from output
  admin.password = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      admin
    }
  });
});

// Admin logout
export const adminLogout = catchAsync(async (req, res, next) => {
  const { adminRefreshToken } = extractTokensFromCookies(req);

  // Revoke refresh token if it exists
  if (adminRefreshToken) {
    try {
      await revokeRefreshToken(adminRefreshToken, req.ip, req.get('User-Agent'));
    } catch (error) {
      console.error('Failed to revoke admin refresh token:', error);
    }
  }

  // Clear auth cookies
  clearAuthCookies(res, 'admin');

  res.status(200).json({
    status: 'success',
    message: 'Admin logged out successfully'
  });
});

// Admin logout from all devices
export const adminLogoutAll = catchAsync(async (req, res, next) => {
  const adminId = req.admin._id;

  // Revoke all refresh tokens for this admin
  await revokeAllRefreshTokens(adminId, 'admin');

  // Clear auth cookies
  clearAuthCookies(res, 'admin');

  res.status(200).json({
    status: 'success',
    message: 'Admin logged out from all devices successfully'
  });
});

// Refresh admin access token
export const adminRefreshToken = catchAsync(async (req, res, next) => {
  const { adminRefreshToken } = extractTokensFromCookies(req);

  if (!adminRefreshToken) {
    return next(new AppError('Admin refresh token not provided', 401));
  }

  try {
    // Verify refresh token
    const tokenDoc = await verifyRefreshToken(adminRefreshToken, 'admin');
    const admin = tokenDoc.admin;

    // Generate new access token
    const newAccessToken = generateAccessToken({ id: admin._id, role: admin.role || 'admin' }, 'admin');

    // Update access token cookie (keep refresh token as is)
    setAuthCookies(res, newAccessToken, adminRefreshToken, 'admin');

    res.status(200).json({
      status: 'success',
      message: 'Admin token refreshed successfully'
    });
  } catch (error) {
    // Clear cookies if refresh token is invalid
    clearAuthCookies(res, 'admin');
    return next(new AppError('Invalid admin refresh token', 401));
  }
});

// Get current admin
export const getCurrentAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);

  res.status(200).json({
    status: 'success',
    data: {
      admin
    }
  });
});

// Get dashboard analytics
export const getDashboardAnalytics = catchAsync(async (req, res, next) => {
  const { period = '30d' } = req.query;
  
  let startDate;
  const endDate = new Date();
  
  switch (period) {
    case '7d':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  // Revenue and orders analytics
  const orderAnalytics = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: '$total' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        }
      }
    }
  ]);

  // Customer analytics
  const customerAnalytics = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        newCustomers: { $sum: 1 },
        verifiedCustomers: {
          $sum: { $cond: ['$phoneVerified', 1, 0] }
        }
      }
    }
  ]);

  // Product analytics
  const productAnalytics = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        lowStockProducts: {
          $sum: { $cond: [{ $lte: ['$stock', 10] }, 1, 0] }
        },
        outOfStockProducts: {
          $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] }
        }
      }
    }
  ]);

  // Top selling products
  const topProducts = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $ne: 'cancelled' }
      }
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  // Recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .select('_id total status createdAt user');

  // Daily revenue for charts
  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        revenue: { $sum: '$total' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      overview: {
        ...orderAnalytics[0],
        ...customerAnalytics[0],
        ...productAnalytics[0]
      },
      topProducts,
      recentOrders,
      dailyRevenue,
      period
    }
  });
});

// Get all customers
export const getAllCustomers = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (status && status !== 'all') {
    if (status === 'verified') {
      filter.phoneVerified = true;
    } else if (status === 'unverified') {
      filter.phoneVerified = false;
    }
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sortObj = {};
  sortObj[sortBy] = order === 'desc' ? -1 : 1;

  const skip = (page - 1) * limit;
  
  const customers = await User.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(Number(limit))
    .select('-password -passwordResetToken -passwordResetExpires')
    .lean();

  // Add order statistics for each customer
  for (let customer of customers) {
    const orderStats = await Order.aggregate([
      { $match: { user: customer._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' }
        }
      }
    ]);
    
    customer.orderStats = orderStats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      avgOrderValue: 0
    };
  }

  const total = await User.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: customers.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    data: {
      customers
    }
  });
});

// Get customer details
export const getCustomer = catchAsync(async (req, res, next) => {
  const customer = await User.findById(req.params.id)
    .select('-password -passwordResetToken -passwordResetExpires');

  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }

  // Get customer orders
  const orders = await Order.find({ user: customer._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('_id total status createdAt items');

  // Get customer statistics
  const stats = await Order.aggregate([
    { $match: { user: customer._id } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$total' },
        avgOrderValue: { $avg: '$total' },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      customer,
      orders,
      stats: stats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        avgOrderValue: 0,
        completedOrders: 0,
        cancelledOrders: 0
      }
    }
  });
});

// Create marketing campaign
export const createCampaign = catchAsync(async (req, res, next) => {
  const {
    name,
    type,
    subject,
    content,
    targetAudience,
    customRecipients,
    scheduledDate
  } = req.body;

  const campaign = await Campaign.create({
    name,
    type,
    subject,
    content,
    targetAudience,
    customRecipients,
    scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
    createdBy: req.admin._id,
    status: 'draft'
  });

  res.status(201).json({
    status: 'success',
    data: {
      campaign
    }
  });
});

// Send marketing campaign
export const sendCampaign = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);
  
  if (!campaign) {
    return next(new AppError('Campaign not found', 404));
  }

  if (campaign.status === 'sent') {
    return next(new AppError('Campaign has already been sent', 400));
  }

  // Get target audience
  let recipients = [];
  
  if (campaign.targetAudience === 'all') {
    recipients = await User.find({ phoneVerified: true }, 'email phone name');
  } else if (campaign.targetAudience === 'verified') {
    recipients = await User.find({ phoneVerified: true }, 'email phone name');
  } else if (campaign.targetAudience === 'custom' && campaign.customRecipients.length > 0) {
    recipients = await User.find(
      { _id: { $in: campaign.customRecipients } },
      'email phone name'
    );
  }

  if (recipients.length === 0) {
    return next(new AppError('No recipients found for this campaign', 400));
  }

  // Send campaign
  let successCount = 0;
  let failureCount = 0;

  for (const recipient of recipients) {
    try {
      if (campaign.type === 'email' && recipient.email) {
        await emailService.sendMarketing(
          recipient.email,
          campaign.subject,
          campaign.content,
          recipient.name
        );
        successCount++;
      } else if (campaign.type === 'sms' && recipient.phone) {
        await smsService.sendMarketing(recipient.phone, campaign.content);
        successCount++;
      }
    } catch (error) {
      console.error(`Failed to send ${campaign.type} to ${recipient.email || recipient.phone}:`, error);
      failureCount++;
    }
  }

  // Update campaign status
  campaign.status = 'sent';
  campaign.sentAt = new Date();
  campaign.sentCount = successCount;
  campaign.failureCount = failureCount;
  campaign.totalRecipients = recipients.length;

  await campaign.save();

  res.status(200).json({
    status: 'success',
    message: `Campaign sent successfully to ${successCount} recipients`,
    data: {
      campaign,
      successCount,
      failureCount,
      totalRecipients: recipients.length
    }
  });
});

// Get all campaigns
export const getAllCampaigns = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, type, status } = req.query;

  const filter = {};
  if (type && type !== 'all') filter.type = type;
  if (status && status !== 'all') filter.status = status;

  const skip = (page - 1) * limit;

  const campaigns = await Campaign.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('createdBy', 'name email');

  const total = await Campaign.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: campaigns.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    data: {
      campaigns
    }
  });
});

// Update customer status
export const updateCustomerStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  
  const customer = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).select('-password');

  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      customer
    }
  });
});

// Get system statistics
export const getSystemStats = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const verifiedUsers = await User.countDocuments({ phoneVerified: true });
  const totalProducts = await Product.countDocuments();
  const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } });
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        unverified: totalUsers - verifiedUsers
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
        inStock: totalProducts - lowStockProducts
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: totalOrders - pendingOrders
      },
      revenue: {
        total: totalRevenue[0]?.total || 0
      }
    }
  });
}); 