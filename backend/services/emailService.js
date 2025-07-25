import nodemailer from 'nodemailer';
import AppError from '../utils/appError.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Send email
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `Hash Store <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new AppError('Failed to send email', 500);
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Hash Store!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to Hash Store</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.name}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for joining Hash Store! We're excited to have you as part of our community.
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Get ready to explore our amazing collection of fashion items and enjoy exclusive deals.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/shop" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Start Shopping
            </a>
          </div>
          <p style="color: #999; font-size: 14px; margin-top: 40px;">
            If you have any questions, feel free to contact our support team.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  // Send OTP email
  async sendOTPEmail(user, otp) {
    const subject = 'Your Hash Store Verification Code';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #667eea; padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Verification Code</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.name}</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Your verification code is:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #667eea; color: white; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; display: inline-block;">
              ${otp}
            </div>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  // Send order confirmation email
  async sendOrderConfirmationEmail(order) {
    const subject = `Order Confirmation - ${order.orderNumber}`;
    
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.size ? `Size: ${item.size}` : ''} ${item.color ? `Color: ${item.color}` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #28a745; padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Order #${order.orderNumber}</p>
        </div>
        <div style="padding: 30px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${order.customerInfo.name}</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for your order! We've received your order and will process it soon.
          </p>
          
          <h3 style="color: #333; margin: 30px 0 15px 0;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #e9ecef;">
                <th style="padding: 15px 10px; text-align: left;">Image</th>
                <th style="padding: 15px 10px; text-align: left;">Product</th>
                <th style="padding: 15px 10px; text-align: center;">Details</th>
                <th style="padding: 15px 10px; text-align: center;">Qty</th>
                <th style="padding: 15px 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">Order Summary</h4>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Subtotal:</span>
              <span>₹${order.subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Shipping:</span>
              <span>₹${order.shipping}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>Tax:</span>
              <span>₹${order.tax}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px;">
              <span>Total:</span>
              <span>₹${order.total}</span>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Track Your Order
            </a>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: order.customerInfo.email,
      subject,
      html
    });
  }

  // Send shipping notification
  async sendShippingNotification(order) {
    const subject = `Your order has been shipped - ${order.orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #17a2b8; padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Shipped!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Order #${order.orderNumber}</p>
        </div>
        <div style="padding: 30px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${order.customerInfo.name}</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Great news! Your order has been shipped and is on its way to you.
          </p>
          
          ${order.trackingNumber ? `
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 30px 0;">
              <h4 style="margin: 0 0 10px 0; color: #333;">Tracking Information</h4>
              <p style="margin: 0; color: #666;">Tracking Number: <strong>${order.trackingNumber}</strong></p>
              ${order.carrier ? `<p style="margin: 5px 0 0 0; color: #666;">Carrier: ${order.carrier}</p>` : ''}
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" 
               style="background: #17a2b8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Track Your Package
            </a>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: order.customerInfo.email,
      subject,
      html
    });
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const subject = 'Password Reset Request';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc3545; padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 30px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.name}</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to reset it:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" 
               style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; word-break: break-all;">
            If the button doesn't work, copy and paste this URL into your browser: ${resetURL}
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  // Send delivery notification with OTP
  async sendDeliveryOTP(order, otp) {
    const subject = `Delivery OTP - ${order.orderNumber}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ffc107; padding: 30px 20px; text-align: center;">
          <h1 style="color: #212529; margin: 0;">Out for Delivery</h1>
          <p style="color: #212529; margin: 10px 0 0 0; font-size: 18px;">Order #${order.orderNumber}</p>
        </div>
        <div style="padding: 30px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${order.customerInfo.name}</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Your order is out for delivery! Please share this OTP with the delivery partner:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #ffc107; color: #212529; padding: 20px; font-size: 32px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; display: inline-block;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            This OTP is valid for 24 hours and is required for delivery confirmation.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: order.customerInfo.email,
      subject,
      html
    });
  }
}

export default new EmailService(); 