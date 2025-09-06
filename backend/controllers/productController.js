import { validationResult } from 'express-validator';
import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Get all products (public)
export const getAllProducts = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 12,
    category,
    subcategory,
    brand,
    minPrice,
    maxPrice,
    search,
    sort = '-createdAt',
    status = 'active'
  } = req.query;

  // Limit the number of products per page to prevent long loading times
  const maxLimit = 50;
  const actualLimit = Math.min(parseInt(limit), maxLimit);

  // Build filter object
  const filter = { status };

  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (brand) filter.brand = new RegExp(brand, 'i');
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  if (search) {
    filter.$text = { $search: search };
  }

  // Execute query with pagination and optimized field selection
  const skip = (page - 1) * actualLimit;
  
  // Only select essential fields for list view to reduce data transfer
  const productFields = 'name price category images stock rating numReviews createdAt status brand';
  
  const products = await Product.find(filter)
    .select(productFields)
    .sort(sort)
    .skip(skip)
    .limit(actualLimit)
    .lean(); // Use lean() for better performance

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / actualLimit),
    data: {
      products
    }
  });
});

// Get single product (public)
export const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).select('-__v');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Get featured products (public)
export const getFeaturedProducts = catchAsync(async (req, res, next) => {
  const { limit = 8 } = req.query;

  const products = await Product.find({ 
    status: 'active', 
    isFeatures: true 
  })
    .sort('-createdAt')
    .limit(parseInt(limit))
    .select('-__v');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// Get products by category (public)
export const getProductsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const { page = 1, limit = 12, sort = '-createdAt' } = req.query;

  const filter = { category, status: 'active' };
  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    data: {
      products
    }
  });
});

// Admin Functions

// Get all products for admin
export const getAllProductsAdmin = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    category,
    status,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build filter object
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { sku: new RegExp(search, 'i') }
    ];
  }

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
    data: {
      products
    }
  });
});

// Create product (admin)
export const createProduct = catchAsync(async (req, res, next) => {
  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Request body is empty. Please check if you are sending JSON data with correct Content-Type header.',
      receivedData: req.body
    });
  }
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array(),
      receivedData: req.body
    });
  }

  // Convert and clean the data
  const productData = {
    name: req.body.name?.trim(),
    description: req.body.description?.trim(),
    price: parseFloat(req.body.price),
    category: req.body.category?.trim(),
    subcategory: req.body.subcategory?.trim(),
    brand: req.body.brand?.trim(),
    sku: req.body.sku?.trim(),
    stock: parseInt(req.body.stock) || 0,
    status: req.body.status || 'active',
    images: Array.isArray(req.body.images) ? req.body.images : [],
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    isFeatures: Boolean(req.body.isFeatures) || false,
    
    // New unified variants system
    variants: Array.isArray(req.body.variants) ? req.body.variants.map(variant => ({
      size: variant.size,
      color: {
        name: variant.color?.name || '',
        hex: variant.color?.hex || '#000000'
      },
      stock: parseInt(variant.stock) || 0,
      price: variant.price ? parseFloat(variant.price) : undefined,
      sku: variant.sku || ''
    })) : [],
    
    // Size chart handling
    sizeChart: req.body.sizeChart || {
      hasChart: false,
      chartType: 'clothing',
      measurements: [],
      guidelines: []
    }
  };

  // If variants are provided, calculate total stock from variants
  if (productData.variants.length > 0) {
    productData.stock = productData.variants.reduce((total, variant) => total + variant.stock, 0);
  }

  try {
    const product = await Product.create(productData);

    res.status(201).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Update product (admin)
export const updateProduct = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, errors.array()));
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Delete product (admin)
export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Update product stock (admin)
export const updateProductStock = catchAsync(async (req, res, next) => {
  const { stock } = req.body;

  if (typeof stock !== 'number' || stock < 0) {
    return next(new AppError('Stock must be a non-negative number', 400));
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock },
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Bulk update products (admin)
export const bulkUpdateProducts = catchAsync(async (req, res, next) => {
  const { productIds, updateData } = req.body;

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return next(new AppError('Product IDs array is required', 400));
  }

  const result = await Product.updateMany(
    { _id: { $in: productIds } },
    updateData,
    { runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: `Updated ${result.modifiedCount} products`,
    data: {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    }
  });
});

// Get all categories (public)
export const getCategories = catchAsync(async (req, res, next) => {
  const categories = await Product.distinct('category', { status: 'active' });
  
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});