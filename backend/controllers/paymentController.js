import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Order from '../models/Order.js';
import * as paymentService from '../services/paymentService.js';

export const createPaymentOrder = catchAsync(async (req, res, next) => {
  const { orderId, amount } = req.body;
  
  if (!orderId || !amount) {
    return next(new AppError('Order ID and amount are required', 400));
  }

  // Get order details to extract customer info
  const order = await Order.findById(orderId).populate('user');
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.user._id.toString() !== req.user.id) {
    return next(new AppError('You can only create payment for your own orders', 403));
  }

  const customerDetails = {
    customerId: order.user._id.toString(),
    name: order.user.name,
    email: order.user.email,
    phone: order.user.phone
  };

  const paymentOrderData = {
    orderId: order._id.toString(),
    amount: amount,
    customerDetails
  };

  const paymentOrder = await paymentService.createPaymentOrder(paymentOrderData);

  // Update order with payment session ID
  order.paymentSessionId = paymentOrder.paymentSessionId;
  order.paymentStatus = 'initiated';
  await order.save();

  res.status(200).json({
    status: 'success',
    data: {
      paymentSessionId: paymentOrder.paymentSessionId,
      orderId: paymentOrder.orderId
    }
  });
});

export const verifyPaymentStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.user.toString() !== req.user.id) {
    return next(new AppError('You can only check your own order status', 403));
  }

  const paymentStatus = await paymentService.verifyPayment(orderId);

  // Update order based on payment status
  if (paymentStatus.success && paymentStatus.paymentStatus === 'SUCCESS') {
    order.paymentStatus = 'paid';
    order.paymentId = paymentStatus.paymentId;
    order.paymentMethod = paymentStatus.paymentMethod;
    order.status = 'confirmed';
    await order.save();
  } else if (paymentStatus.paymentStatus === 'FAILED') {
    order.paymentStatus = 'failed';
    await order.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      paymentStatus: paymentStatus.paymentStatus,
      order: order
    }
  });
});

export const handlePaymentWebhook = catchAsync(async (req, res, next) => {
  const signature = req.headers['x-webhook-signature'];
  const webhookData = req.body;

  const verification = await paymentService.handleWebhook(webhookData, signature);

  if (verification.success) {
    // Update order based on webhook data
    const { order_id, payment_status, cf_payment_id, payment_method } = webhookData.data;
    
    const order = await Order.findById(order_id);
    if (order) {
      order.paymentStatus = payment_status === 'SUCCESS' ? 'paid' : 'failed';
      if (payment_status === 'SUCCESS') {
        order.paymentId = cf_payment_id;
        order.paymentMethod = payment_method;
        order.status = 'confirmed';
      }
      await order.save();
    }

    res.status(200).json({ status: 'success' });
  } else {
    res.status(400).json({ status: 'error', message: 'Invalid webhook' });
  }
});
