import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import * as paymentService from '../services/paymentService.js';
import * as smsService from '../services/smsService.js';
import * as emailService from '../services/emailService.js';

// Create new order
export const createOrder = catchAsync(async (req, res, next) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    couponCode
  } = req.body;

  const userId = req.user._id;

  // Validate and calculate order totals
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return next(new AppError(`Product with ID ${item.productId} not found`, 404));
    }
    
    if (product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for ${product.name}`, 400));
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images[0] || '',
      size: item.size,
      color: item.color
    });
  }

  // Calculate shipping and tax
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  // Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    subtotal,
    shipping,
    tax,
    total,
    paymentMethod,
    couponCode,
    status: 'pending'
  });

  // Create payment intent if not COD
  if (paymentMethod !== 'cod') {
    const paymentIntent = await paymentService.createPaymentIntent({
      amount: total,
      orderId: order._id,
      customerEmail: req.user.email
    });
    
    order.paymentIntent = paymentIntent.id;
    await order.save();
  }

  // Update product stock
  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: -item.quantity } }
    );
  }

  await order.populate('user', 'name email phone');

  // Send order confirmation email
  try {
    await emailService.sendOrderConfirmation(req.user.email, order);
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Get user orders
export const getUserOrders = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('items.product', 'name images');

  const total = await Order.countDocuments({ user: req.user._id });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    data: {
      orders
    }
  });
});

// Get single order
export const getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('items.product', 'name images');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check if user owns this order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to view this order', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Update order status (Admin only)
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status, trackingNumber, deliveryOtp } = req.body;
  
  const order = await Order.findById(req.params.id).populate('user');
  
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid order status', 400));
  }

  const previousStatus = order.status;
  order.status = status;

  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  if (status === 'shipped') {
    order.shippedAt = new Date();
    if (deliveryOtp) {
      order.deliveryOtp = deliveryOtp;
    }
  }

  if (status === 'delivered') {
    order.deliveredAt = new Date();
  }

  await order.save();

  // Send notifications based on status change
  try {
    if (status === 'confirmed' && previousStatus === 'pending') {
      await smsService.sendOrderConfirmation(order.user.phone, order._id);
    } else if (status === 'shipped') {
      await smsService.sendShippingNotification(order.user.phone, order._id, trackingNumber);
      await emailService.sendShippingNotification(order.user.email, order);
    } else if (status === 'delivered') {
      await smsService.sendDeliveryConfirmation(order.user.phone, order._id);
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Verify delivery OTP
export const verifyDeliveryOtp = catchAsync(async (req, res, next) => {
  const { otp } = req.body;
  const orderId = req.params.id;

  const order = await Order.findById(orderId);
  
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.status !== 'shipped') {
    return next(new AppError('Order is not shipped yet', 400));
  }

  if (order.deliveryOtp !== otp) {
    return next(new AppError('Invalid delivery OTP', 400));
  }

  order.status = 'delivered';
  order.deliveredAt = new Date();
  order.otpVerified = true;
  
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order delivered successfully',
    data: {
      order
    }
  });
});

// Cancel order
export const cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check if user owns this order
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new AppError('You are not authorized to cancel this order', 403));
  }

  if (['shipped', 'delivered'].includes(order.status)) {
    return next(new AppError('Cannot cancel order that has been shipped or delivered', 400));
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  
  // Restore product stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: item.quantity } }
    );
  }

  await order.save();

  // Process refund if payment was made
  if (order.paymentStatus === 'paid' && order.paymentMethod !== 'cod') {
    try {
      await paymentService.processRefund(order.paymentIntent, order.total);
      order.refundStatus = 'processed';
      await order.save();
    } catch (error) {
      console.error('Failed to process refund:', error);
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// Get all orders (Admin only)
export const getAllOrders = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    status,
    paymentStatus,
    startDate,
    endDate,
    search
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (status && status !== 'all') {
    filter.status = status;
  }
  
  if (paymentStatus && paymentStatus !== 'all') {
    filter.paymentStatus = paymentStatus;
  }
  
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('user', 'name email phone')
    .populate('items.product', 'name images');

  if (search) {
    orders = orders.populate({
      path: 'user',
      match: {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      }
    });
  }

  const results = await orders;
  const total = await Order.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: results.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    data: {
      orders: results
    }
  });
});

// Get order analytics (Admin only)
export const getOrderAnalytics = catchAsync(async (req, res, next) => {
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
    default:
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  const analytics = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        avgOrderValue: { $avg: '$total' },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        shippedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        }
      }
    }
  ]);

  const dailyStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        orders: { $sum: 1 },
        revenue: { $sum: '$total' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      summary: analytics[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
        pendingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0
      },
      dailyStats,
      period
    }
  });
}); 