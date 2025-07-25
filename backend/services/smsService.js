import twilio from 'twilio';
import AppError from '../utils/appError.js';

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  // Send SMS
  async sendSMS(to, message) {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: to
      });

      return { 
        success: true, 
        sid: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw new AppError('Failed to send SMS', 500);
    }
  }

  // Send OTP via SMS
  async sendOTP(phoneNumber, otp, name = '') {
    const message = `Hello ${name}! Your Hash Store verification code is: ${otp}. This code expires in 10 minutes. Do not share with anyone.`;
    
    return this.sendSMS(phoneNumber, message);
  }

  // Send order confirmation SMS
  async sendOrderConfirmationSMS(order) {
    const message = `Hi ${order.customerInfo.name}! Your order #${order.orderNumber} has been confirmed. Total: ₹${order.total}. Track at: ${process.env.FRONTEND_URL}/orders/${order._id}`;
    
    return this.sendSMS(order.customerInfo.phone, message);
  }

  // Send shipping notification SMS
  async sendShippingNotificationSMS(order) {
    let message = `Hi ${order.customerInfo.name}! Your order #${order.orderNumber} has been shipped`;
    
    if (order.trackingNumber) {
      message += `. Tracking: ${order.trackingNumber}`;
    }
    
    message += `. Track at: ${process.env.FRONTEND_URL}/orders/${order._id}`;
    
    return this.sendSMS(order.customerInfo.phone, message);
  }

  // Send delivery OTP via SMS
  async sendDeliveryOTPSMS(order, otp) {
    const message = `Hi ${order.customerInfo.name}! Your order #${order.orderNumber} is out for delivery. Share this OTP with delivery partner: ${otp}. Valid for 24 hours.`;
    
    return this.sendSMS(order.customerInfo.phone, message);
  }

  // Send promotional SMS
  async sendPromotionalSMS(phoneNumber, message, name = '') {
    const personalizedMessage = name ? `Hi ${name}! ${message}` : message;
    personalizedMessage += `\n\nReply STOP to opt out.`;
    
    return this.sendSMS(phoneNumber, personalizedMessage);
  }

  // Send password reset SMS
  async sendPasswordResetSMS(phoneNumber, resetCode, name = '') {
    const message = `Hi ${name}! Your Hash Store password reset code is: ${resetCode}. This code expires in 1 hour. Do not share with anyone.`;
    
    return this.sendSMS(phoneNumber, message);
  }

  // Send order status update SMS
  async sendOrderStatusUpdateSMS(order, status) {
    let message = `Hi ${order.customerInfo.name}! Your order #${order.orderNumber} is now ${status}`;
    
    switch (status) {
      case 'confirmed':
        message += '. We\'re preparing your order.';
        break;
      case 'packed':
        message += '. Your order has been packed and ready for shipment.';
        break;
      case 'delivered':
        message += '. Thank you for shopping with Hash Store!';
        break;
      case 'cancelled':
        message += '. If you have any questions, contact our support.';
        break;
    }
    
    return this.sendSMS(order.customerInfo.phone, message);
  }

  // Send bulk SMS for campaigns
  async sendBulkSMS(recipients, message) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendSMS(recipient.phone, message);
        results.push({
          phone: recipient.phone,
          success: true,
          sid: result.sid
        });
      } catch (error) {
        results.push({
          phone: recipient.phone,
          success: false,
          error: error.message
        });
      }
      
      // Add delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber) {
    // Remove spaces, dashes, and other non-numeric characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Check if it's a valid format (starts with + or country code)
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return phoneRegex.test(cleaned);
  }

  // Format phone number for Twilio
  formatPhoneNumber(phoneNumber) {
    // Remove all non-numeric characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, add +91 for India
    if (!cleaned.startsWith('+')) {
      if (cleaned.length === 10) {
        cleaned = '+91' + cleaned;
      } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
        cleaned = '+91' + cleaned.substring(1);
      }
    }
    
    return cleaned;
  }
}

export default new SMSService(); 