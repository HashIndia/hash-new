import express from 'express';
import { body } from 'express-validator';
import * as orderController from '../controllers/orderController.js';
import { protectUser, protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('shippingAddress.street')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('shippingAddress.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('shippingAddress.zipCode')
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('ZIP code must be between 5 and 10 characters'),
  body('paymentMethod')
    .isIn(['cod', 'razorpay', 'card'])
    .withMessage('Invalid payment method')
];

const statusUpdateValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status')
];

// Protected routes (require user authentication)
router.use(protectUser);

// User order routes
router.post('/', orderValidation, orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.get('/:id', orderController.getOrder);
router.patch('/:id/cancel', orderController.cancelOrder);

// Admin routes (require admin authentication)
router.use(protectAdmin);
router.get('/', orderController.getAllOrders);
router.patch('/:id/status', statusUpdateValidation, orderController.updateOrderStatus);
router.get('/analytics/overview', orderController.getOrderAnalytics);

export default router;