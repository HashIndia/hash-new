import dotenv from 'dotenv';
import AppError from '../utils/appError.js';

dotenv.config();

// For development/testing without actual Cashfree credentials
const isTestMode = !process.env.CASHFREE_APP_ID || process.env.CASHFREE_APP_ID === 'your_cashfree_app_id_here';

export const createPaymentOrder = async (orderData) => {
  try {
    const { orderId, amount, customerDetails } = orderData;
    
    if (isTestMode) {
      // Mock response for testing
      return {
        success: true,
        paymentSessionId: `test_session_${orderId}_${Date.now()}`,
        orderId: orderId
      };
    }
    
    // TODO: Real Cashfree implementation when credentials are configured
    const { Cashfree } = await import('cashfree-pg');
    
    const cashfree = new Cashfree({
      XClientId: process.env.CASHFREE_APP_ID,
      XClientSecret: process.env.CASHFREE_SECRET_KEY,
      XEnvironment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'SANDBOX'
    });

    const request = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerDetails.customerId,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/order-success?order_id=${orderId}`,
        notify_url: `${process.env.BACKEND_URL}/api/payments/webhook`
      }
    };

    const response = await cashfree.PGCreateOrder("2023-08-01", request);
    
    if (response.data && response.data.payment_session_id) {
      return {
        success: true,
        paymentSessionId: response.data.payment_session_id,
        orderId: response.data.order_id
      };
    } else {
      throw new AppError('Failed to create payment order', 400);
    }
  } catch (error) {
    console.error('Payment order creation failed:', error);
    throw new AppError(error.message || 'Payment order creation failed', 500);
  }
};

export const verifyPayment = async (orderId) => {
  try {
    if (isTestMode) {
      // Mock successful payment verification for testing
      return {
        success: true,
        paymentStatus: 'SUCCESS',
        paymentId: `test_payment_${orderId}`,
        paymentMethod: 'test_method'
      };
    }

    // TODO: Real Cashfree implementation when credentials are configured
    const { Cashfree } = await import('cashfree-pg');
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    
    if (response.data && response.data.length > 0) {
      const payment = response.data[0];
      return {
        success: true,
        paymentStatus: payment.payment_status,
        paymentId: payment.cf_payment_id,
        paymentMethod: payment.payment_method
      };
    } else {
      return {
        success: false,
        message: 'No payment found for this order'
      };
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw new AppError(error.message || 'Payment verification failed', 500);
  }
};

export const handleWebhook = async (webhookData, signature) => {
  try {
    console.log('Webhook received:', webhookData);
    
    if (isTestMode) {
      return {
        success: true,
        data: webhookData
      };
    }

    // TODO: Real webhook verification when credentials are configured
    return {
      success: true,
      data: webhookData
    };
  } catch (error) {
    console.error('Webhook verification failed:', error);
    throw new AppError(error.message || 'Webhook verification failed', 500);
  }
};