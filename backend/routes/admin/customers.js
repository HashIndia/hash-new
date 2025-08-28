import express from 'express';
import User from '../../models/User.js';
import { protectAdmin, restrictTo } from '../../middleware/auth.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';

const router = express.Router();

// All routes are protected
router.use(protectAdmin);

// @route   GET /api/admin/customers
// @desc    Get all customers (admin)
// @access  Private (Admin)
router.get('/', catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status, search } = req.query;
  
  const query = {};
  
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  const customers = await User.find(query)
    .select('-password -passwordResetToken -passwordResetExpires')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.status(200).json({
    status: 'success',
    results: customers.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit) || 1,
    data: { customers }
  });
}));

// @route   GET /api/admin/customers/:id
// @desc    Get single customer (admin)
// @access  Private (Admin)
router.get('/:id', catchAsync(async (req, res, next) => {
  const customer = await User.findById(req.params.id)
    .select('-password -passwordResetToken -passwordResetExpires');
  
  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { customer }
  });
}));

// @route   PUT /api/admin/customers/:id
// @desc    Update customer (admin)
// @access  Private (Admin)
router.put('/:id', restrictTo('admin', 'super_admin'), catchAsync(async (req, res, next) => {
  const customer = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password -passwordResetToken -passwordResetExpires');

  if (!customer) {
    return next(new AppError('Customer not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { customer }
  });
}));

export default router;
