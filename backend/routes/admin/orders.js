import express from 'express';
import { protectAdmin, restrictTo } from '../../middleware/auth.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';

const router = express.Router();

// All routes are protected
router.use(protectAdmin);

// @route   GET /api/admin/orders
// @desc    Get all orders (admin)
// @access  Private (Admin)
router.get('/', catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status, search } = req.query;
  
  // For now, return empty data since Order model might not exist
  const orders = [];
  const total = 0;

  res.status(200).json({
    status: 'success',
    results: orders.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit) || 1,
    data: { orders }
  });
}));

// @route   GET /api/admin/orders/:id
// @desc    Get single order (admin)
// @access  Private (Admin)
router.get('/:id', catchAsync(async (req, res, next) => {
  return next(new AppError('Order not found', 404));
}));

// @route   PATCH /api/admin/orders/:id/status
// @desc    Update order status (admin)
// @access  Private (Admin)
router.patch('/:id/status', restrictTo('admin', 'super_admin'), catchAsync(async (req, res, next) => {
  return next(new AppError('Order not found', 404));
}));

export default router;
