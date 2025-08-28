import express from 'express';
import { protectAdmin, restrictTo } from '../../middleware/auth.js';
import { 
  getAllOrders, 
  getOrder, 
  updateOrderStatus 
} from '../../controllers/adminController.js';

const router = express.Router();

// All routes are protected
router.use(protectAdmin);

// @route   GET /api/admin/orders
// @desc    Get all orders (admin)
// @access  Private (Admin)
router.get('/', getAllOrders);

// @route   GET /api/admin/orders/:id
// @desc    Get single order (admin)
// @access  Private (Admin)
router.get('/:id', getOrder);

// @route   PATCH /api/admin/orders/:id/status
// @desc    Update order status (admin)
// @access  Private (Admin)
router.patch('/:id/status', restrictTo('admin', 'super_admin'), updateOrderStatus);

export default router;
