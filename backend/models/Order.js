import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size: String,
  color: String,
  sku: String,
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const shippingAddressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, default: 'India' },
  phone: String,
  name: String
});

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cod', 'emi'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  transactionId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  gatewayResponse: Object,
  paidAt: Date,
  refundedAt: Date,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String
});

const trackingSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['order_placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'order_placed'
  },
  message: String,
  location: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'],
    default: 'pending'
  },
  paymentInfo: paymentSchema,
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  billingAddress: shippingAddressSchema,
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  shippingMethod: {
    name: String,
    cost: Number,
    estimatedDays: Number
  },
  tracking: [trackingSchema],
  trackingNumber: String,
  carrier: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  returnedAt: Date,
  cancellationReason: String,
  returnReason: String,
  notes: String,
  adminNotes: String,
  couponCode: String,
  couponDiscount: {
    type: Number,
    default: 0
  },
  // OTP for delivery verification
  deliveryOTP: String,
  otpExpires: Date,
  isOTPVerified: {
    type: Boolean,
    default: false
  },
  // Invoice details
  invoiceNumber: String,
  invoiceDate: Date,
  gstNumber: String,
  // Fulfillment
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  isShipped: {
    type: Boolean,
    default: false
  },
  shippedAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  // Analytics
  deviceInfo: {
    type: String,
    userAgent: String,
    ip: String
  },
  referralSource: String,
  // Communication
  emailsSent: [{
    type: {
      type: String,
      enum: ['confirmation', 'payment', 'shipping', 'delivery', 'cancellation', 'return']
    },
    sentAt: Date,
    success: Boolean
  }],
  smsSent: [{
    type: {
      type: String,
      enum: ['confirmation', 'payment', 'shipping', 'delivery', 'otp']
    },
    sentAt: Date,
    success: Boolean
  }]
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ trackingNumber: 1 });

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD${timestamp.slice(-6)}${random}`;
  }
  next();
});

// Generate delivery OTP
orderSchema.methods.generateDeliveryOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.deliveryOTP = otp;
  this.otpExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return otp;
};

// Verify delivery OTP
orderSchema.methods.verifyDeliveryOTP = function(enteredOTP) {
  if (this.deliveryOTP === enteredOTP && this.otpExpires > Date.now()) {
    this.isOTPVerified = true;
    this.status = 'delivered';
    this.isDelivered = true;
    this.deliveredAt = new Date();
    this.addTracking('delivered', 'Package delivered successfully');
    return true;
  }
  return false;
};

// Add tracking information
orderSchema.methods.addTracking = function(status, message, location) {
  this.tracking.push({
    status,
    message,
    location,
    timestamp: new Date()
  });
  this.status = status;
  
  // Update flags based on status
  switch (status) {
    case 'confirmed':
      this.isPaid = true;
      this.paidAt = new Date();
      break;
    case 'shipped':
      this.isShipped = true;
      this.shippedAt = new Date();
      break;
    case 'delivered':
      this.isDelivered = true;
      this.deliveredAt = new Date();
      break;
    case 'cancelled':
      this.cancelledAt = new Date();
      break;
    case 'returned':
      this.returnedAt = new Date();
      break;
  }
};

// Calculate order totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  this.tax = Math.round(this.subtotal * 0.18); // 18% GST
  this.total = this.subtotal + this.tax + this.shipping - this.discount - this.couponDiscount;
};

// Check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed', 'packed'].includes(this.status);
};

// Check if order can be returned
orderSchema.methods.canBeReturned = function() {
  if (this.status !== 'delivered') return false;
  
  const deliveryDate = this.deliveredAt || this.createdAt;
  const daysSinceDelivery = (Date.now() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysSinceDelivery <= 7; // 7 days return policy
};

// Cancel order
orderSchema.methods.cancelOrder = function(reason, refundAmount) {
  if (!this.canBeCancelled()) {
    throw new Error('Order cannot be cancelled at this stage');
  }
  
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  
  if (refundAmount && refundAmount > 0) {
    this.paymentInfo.status = 'refunded';
    this.paymentInfo.refundAmount = refundAmount;
    this.paymentInfo.refundedAt = new Date();
    this.paymentInfo.refundReason = reason;
  }
  
  this.addTracking('cancelled', `Order cancelled: ${reason}`);
};

// Return order
orderSchema.methods.returnOrder = function(reason, refundAmount) {
  if (!this.canBeReturned()) {
    throw new Error('Order cannot be returned');
  }
  
  this.status = 'returned';
  this.returnedAt = new Date();
  this.returnReason = reason;
  
  if (refundAmount && refundAmount > 0) {
    this.paymentInfo.status = 'refunded';
    this.paymentInfo.refundAmount = refundAmount;
    this.paymentInfo.refundedAt = new Date();
    this.paymentInfo.refundReason = reason;
  }
  
  this.addTracking('returned', `Order returned: ${reason}`);
};

export default mongoose.model('Order', orderSchema); 