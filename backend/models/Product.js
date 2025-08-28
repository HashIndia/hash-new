import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['clothing', 'accessories', 'shoes', 'bags', 'electronics', 'home', 'beauty', 'sports']
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    required: [true, 'SKU is required']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  // Size variants with individual stock
  sizeVariants: [{
    size: {
      type: String,
      required: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '28', '30', '32', '34', '36', '38', '40', '42', '6', '7', '8', '9', '10', '11', '12', 'ONE_SIZE']
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Size stock cannot be negative'],
      default: 0
    },
    price: {
      type: Number, // Optional different price for different sizes
      min: [0, 'Size price cannot be negative']
    }
  }],
  // Size chart information
  sizeChart: {
    hasChart: {
      type: Boolean,
      default: false
    },
    chartType: {
      type: String,
      enum: ['clothing', 'shoes', 'accessories'],
      default: 'clothing'
    },
    measurements: [{
      size: String,
      chest: Number, // in cm
      waist: Number, // in cm
      hips: Number,  // in cm
      length: Number, // in cm
      shoulders: Number, // in cm
      sleeves: Number   // in cm
    }],
    guidelines: [String] // Array of sizing guidelines
  },
  // Colors available
  colors: [{
    name: String,
    hex: String,
    images: [String] // Images for this color variant
  }],
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'discontinued'],
    default: 'active'
  },
  tags: [String],
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  isFeatures: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative']
  },
  saleStartDate: Date,
  saleEndDate: Date,
  minOrderQuantity: {
    type: Number,
    default: 1,
    min: [1, 'Minimum order quantity must be at least 1']
  },
  maxOrderQuantity: {
    type: Number,
    default: 100
  },
  // Review aggregation
  reviewStats: {
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    ratingDistribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for current selling price
productSchema.virtual('currentPrice').get(function() {
  if (this.salePrice && this.saleStartDate && this.saleEndDate) {
    const now = new Date();
    if (now >= this.saleStartDate && now <= this.saleEndDate) {
      return this.salePrice;
    }
  }
  return this.price;
});

// Virtual for total stock across all sizes
productSchema.virtual('totalStock').get(function() {
  if (this.sizeVariants && this.sizeVariants.length > 0) {
    return this.sizeVariants.reduce((total, variant) => total + variant.stock, 0);
  }
  return this.stock;
});

// Virtual for available sizes
productSchema.virtual('availableSizes').get(function() {
  if (this.sizeVariants && this.sizeVariants.length > 0) {
    return this.sizeVariants.filter(variant => variant.stock > 0).map(variant => variant.size);
  }
  return [];
});

// Method to check if product is on sale
productSchema.methods.isOnSale = function() {
  if (!this.salePrice || !this.saleStartDate || !this.saleEndDate) {
    return false;
  }
  const now = new Date();
  return now >= this.saleStartDate && now <= this.saleEndDate;
};

// Method to get stock for specific size
productSchema.methods.getStockForSize = function(size) {
  if (this.sizeVariants && this.sizeVariants.length > 0) {
    const variant = this.sizeVariants.find(v => v.size === size);
    return variant ? variant.stock : 0;
  }
  return this.stock;
};

// Method to update stock for specific size
productSchema.methods.updateSizeStock = function(size, quantity) {
  if (this.sizeVariants && this.sizeVariants.length > 0) {
    const variant = this.sizeVariants.find(v => v.size === size);
    if (variant) {
      variant.stock = Math.max(0, variant.stock - quantity);
    }
  } else {
    this.stock = Math.max(0, this.stock - quantity);
  }
};

// Pre-save middleware to generate SKU if not provided
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = `HASH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('Product', productSchema);