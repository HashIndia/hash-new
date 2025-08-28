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
  // Inventory management - size-color combinations
  variants: [{
    size: {
      type: String,
      required: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '28', '30', '32', '34', '36', '38', '40', '42', '6', '7', '8', '9', '10', '11', '12', 'ONE_SIZE']
    },
    color: {
      name: { type: String, required: true },
      hex: { type: String, required: true }
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Variant stock cannot be negative'],
      default: 0
    },
    price: {
      type: Number, // Optional different price for different variants
      min: [0, 'Variant price cannot be negative']
    },
    sku: {
      type: String, // Optional SKU for this specific variant
      trim: true
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

// Virtual for total stock across all variants
productSchema.virtual('totalStock').get(function() {
  if (this.variants && this.variants.length > 0) {
    return this.variants.reduce((total, variant) => total + variant.stock, 0);
  }
  return this.stock;
});

// Virtual for available sizes
productSchema.virtual('availableSizes').get(function() {
  if (this.variants && this.variants.length > 0) {
    const sizesWithStock = this.variants.filter(variant => variant.stock > 0);
    return [...new Set(sizesWithStock.map(variant => variant.size))];
  }
  return [];
});

// Virtual for available colors
productSchema.virtual('availableColors').get(function() {
  if (this.variants && this.variants.length > 0) {
    const colorsWithStock = this.variants.filter(variant => variant.stock > 0);
    return colorsWithStock.reduce((colors, variant) => {
      const existingColor = colors.find(c => c.hex === variant.color.hex);
      if (!existingColor) {
        colors.push(variant.color);
      }
      return colors;
    }, []);
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

// Method to get stock for specific size-color combination
productSchema.methods.getVariantStock = function(size, colorHex) {
  if (this.variants && this.variants.length > 0) {
    const variant = this.variants.find(v => v.size === size && v.color.hex === colorHex);
    return variant ? variant.stock : 0;
  }
  return 0;
};

// Method to get available sizes for a specific color
productSchema.methods.getSizesForColor = function(colorHex) {
  if (this.variants && this.variants.length > 0) {
    const sizesForColor = this.variants
      .filter(v => v.color.hex === colorHex && v.stock > 0)
      .map(v => v.size);
    return [...new Set(sizesForColor)];
  }
  return [];
};

// Method to get available colors for a specific size
productSchema.methods.getColorsForSize = function(size) {
  if (this.variants && this.variants.length > 0) {
    const colorsForSize = this.variants
      .filter(v => v.size === size && v.stock > 0)
      .map(v => v.color);
    return colorsForSize.reduce((colors, color) => {
      const exists = colors.find(c => c.hex === color.hex);
      if (!exists) colors.push(color);
      return colors;
    }, []);
  }
  return [];
};

// Method to update stock for specific size-color combination
productSchema.methods.updateVariantStock = function(size, colorHex, quantity) {
  if (this.variants && this.variants.length > 0) {
    const variant = this.variants.find(v => v.size === size && v.color.hex === colorHex);
    if (variant) {
      variant.stock = Math.max(0, variant.stock - quantity);
      return true;
    }
    return false;
  }
  // Fallback to legacy method
  this.updateSizeStock(size, quantity);
  return true;
};

// Method to get stock for specific size (total across all colors)
productSchema.methods.getStockForSize = function(size) {
  if (this.variants && this.variants.length > 0) {
    const variantsForSize = this.variants.filter(v => v.size === size);
    return variantsForSize.reduce((total, variant) => total + variant.stock, 0);
  }
  return this.stock;
};

// Method to update stock for specific variant
productSchema.methods.updateVariantStock = function(size, colorHex, quantity) {
  if (this.variants && this.variants.length > 0) {
    const variant = this.variants.find(v => v.size === size && v.color.hex === colorHex);
    if (variant) {
      variant.stock = Math.max(0, variant.stock - quantity);
      return true;
    }
  }
  return false;
};

// Pre-save middleware to generate SKU and calculate total stock
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = `HASH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  
  // Auto-calculate total stock from variants if variants exist
  if (this.variants && this.variants.length > 0) {
    this.stock = this.variants.reduce((total, variant) => total + variant.stock, 0);
  }
  
  next();
});

export default mongoose.model('Product', productSchema);