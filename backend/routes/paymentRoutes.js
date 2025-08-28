import express from 'express';
import { 
  createPaymentOrder, 
  verifyPaymentStatus, 
  handlePaymentWebhook 
} from '../controllers/paymentController.js';
import { protectUser } from '../middleware/auth.js';

const router = express.Router();

// Create payment order
router.post('/create-order', protectUser, createPaymentOrder);

// Verify payment status
router.get('/verify/:orderId', protectUser, verifyPaymentStatus);

// Webhook for payment status updates
router.post('/webhook', handlePaymentWebhook);

export default router;
