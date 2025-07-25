import Razorpay from 'razorpay';
import crypto from 'crypto';
import AppError from '../utils/appError.js';

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  // Create Razorpay order
  async createOrder(orderData) {
    try {
      const options = {
        amount: Math.round(orderData.amount * 100), // Amount in paise
        currency: orderData.currency || 'INR',
        receipt: orderData.receipt || `order_${Date.now()}`,
        notes: orderData.notes || {}
      };

      const order = await this.razorpay.orders.create(options);
      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      };
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      throw new AppError('Failed to create payment order', 500);
    }
  }

  // Verify payment signature
  verifyPaymentSignature(paymentData) {
    try {
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature 
      } = paymentData;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === razorpay_signature;
    } catch (error) {
      console.error('Payment signature verification failed:', error);
      return false;
    }
  }

  // Capture payment
  async capturePayment(paymentId, amount) {
    try {
      const capture = await this.razorpay.payments.capture(
        paymentId, 
        Math.round(amount * 100) // Amount in paise
      );
      
      return {
        success: true,
        paymentId: capture.id,
        amount: capture.amount / 100,
        status: capture.status
      };
    } catch (error) {
      console.error('Payment capture failed:', error);
      throw new AppError('Failed to capture payment', 500);
    }
  }

  // Fetch payment details
  async getPaymentDetails(paymentId) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return {
        success: true,
        payment: {
          id: payment.id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          captured: payment.captured,
          createdAt: new Date(payment.created_at * 1000),
          email: payment.email,
          contact: payment.contact,
          fee: payment.fee / 100,
          tax: payment.tax / 100
        }
      };
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
      throw new AppError('Failed to fetch payment details', 500);
    }
  }

  // Create refund
  async createRefund(paymentId, amount, reason = 'requested_by_customer') {
    try {
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: Math.round(amount * 100), // Amount in paise
        notes: {
          reason: reason,
          refund_date: new Date().toISOString()
        }
      });

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        paymentId: refund.payment_id
      };
    } catch (error) {
      console.error('Refund creation failed:', error);
      throw new AppError('Failed to create refund', 500);
    }
  }

  // Get refund details
  async getRefundDetails(refundId) {
    try {
      const refund = await this.razorpay.refunds.fetch(refundId);
      return {
        success: true,
        refund: {
          id: refund.id,
          amount: refund.amount / 100,
          currency: refund.currency,
          status: refund.status,
          paymentId: refund.payment_id,
          createdAt: new Date(refund.created_at * 1000),
          processedAt: refund.processed_at ? new Date(refund.processed_at * 1000) : null
        }
      };
    } catch (error) {
      console.error('Failed to fetch refund details:', error);
      throw new AppError('Failed to fetch refund details', 500);
    }
  }

  // Create customer
  async createCustomer(customerData) {
    try {
      const customer = await this.razorpay.customers.create({
        name: customerData.name,
        email: customerData.email,
        contact: customerData.phone,
        notes: customerData.notes || {}
      });

      return {
        success: true,
        customerId: customer.id,
        name: customer.name,
        email: customer.email,
        contact: customer.contact
      };
    } catch (error) {
      console.error('Customer creation failed:', error);
      throw new AppError('Failed to create customer', 500);
    }
  }

  // Generate payment link
  async createPaymentLink(linkData) {
    try {
      const paymentLink = await this.razorpay.paymentLink.create({
        amount: Math.round(linkData.amount * 100),
        currency: linkData.currency || 'INR',
        description: linkData.description,
        customer: {
          name: linkData.customer.name,
          email: linkData.customer.email,
          contact: linkData.customer.phone
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        notes: linkData.notes || {},
        callback_url: linkData.callbackUrl,
        callback_method: 'get'
      });

      return {
        success: true,
        linkId: paymentLink.id,
        shortUrl: paymentLink.short_url,
        amount: paymentLink.amount / 100,
        status: paymentLink.status
      };
    } catch (error) {
      console.error('Payment link creation failed:', error);
      throw new AppError('Failed to create payment link', 500);
    }
  }

  // Validate webhook signature
  validateWebhookSignature(body, signature, secret) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Webhook signature validation failed:', error);
      return false;
    }
  }

  // Process webhook events
  async processWebhookEvent(event) {
    try {
      const { entity, event: eventType } = event;
      
      switch (eventType) {
        case 'payment.captured':
          return this.handlePaymentCaptured(entity);
        case 'payment.failed':
          return this.handlePaymentFailed(entity);
        case 'order.paid':
          return this.handleOrderPaid(entity);
        case 'refund.processed':
          return this.handleRefundProcessed(entity);
        default:
          console.log(`Unhandled webhook event: ${eventType}`);
          return { processed: false };
      }
    } catch (error) {
      console.error('Webhook processing failed:', error);
      throw new AppError('Failed to process webhook', 500);
    }
  }

  // Handle payment captured webhook
  async handlePaymentCaptured(payment) {
    console.log('Payment captured:', payment.id);
    // Update order status in database
    return { processed: true, event: 'payment_captured' };
  }

  // Handle payment failed webhook
  async handlePaymentFailed(payment) {
    console.log('Payment failed:', payment.id);
    // Update order status in database
    return { processed: true, event: 'payment_failed' };
  }

  // Handle order paid webhook
  async handleOrderPaid(order) {
    console.log('Order paid:', order.id);
    // Update order status in database
    return { processed: true, event: 'order_paid' };
  }

  // Handle refund processed webhook
  async handleRefundProcessed(refund) {
    console.log('Refund processed:', refund.id);
    // Update order and refund status in database
    return { processed: true, event: 'refund_processed' };
  }

  // Calculate platform fee (if applicable)
  calculatePlatformFee(amount, feePercentage = 2) {
    return Math.round(amount * (feePercentage / 100) * 100) / 100;
  }

  // Generate QR code for UPI payments
  async generateQRCode(orderData) {
    try {
      const qrCode = await this.razorpay.qrCode.create({
        type: 'upi_qr',
        name: 'Hash Store',
        usage: 'single_use',
        fixed_amount: true,
        payment_amount: Math.round(orderData.amount * 100),
        description: orderData.description,
        customer_id: orderData.customerId,
        close_by: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes from now
      });

      return {
        success: true,
        qrCodeId: qrCode.id,
        qrCodeUrl: qrCode.image_url,
        status: qrCode.status
      };
    } catch (error) {
      console.error('QR code generation failed:', error);
      throw new AppError('Failed to generate QR code', 500);
    }
  }
}

export default new PaymentService(); 