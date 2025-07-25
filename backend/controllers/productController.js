import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Product from '../models/Product.js';
import upload from '../middleware/upload.js';

// Get all products with filtering, sorting, and pagination
export const getAllProducts = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    search,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (category && category !== 'all') {
    filter.category = { $regex: category, $options: 'i' };
  }
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Build sort object
  const sortObj = {};
  sortObj[sort] = order === 'desc' ? -1 : 1;

  const skip = (page - 1) * limit;
  
  const products = await Product.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(Number(limit))
    .populate('reviews.user', 'name');

  const total = await Product.countDocuments(filter);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    data: {
      products
    }
  });
});

// Get single product by ID
export const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
  
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

// Create new product (Admin only)
export const createProduct = catchAsync(async (req, res, next) => {
  const productData = {
    ...req.body,
    images: req.files ? req.files.map(file => file.path) : []
  };

  const product = await Product.create(productData);

  res.status(201).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Update product (Admin only)
export const updateProduct = catchAsync(async (req, res, next) => {
  const updateData = { ...req.body };
  
  if (req.files && req.files.length > 0) {
    updateData.images = req.files.map(file => file.path);
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
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

// Delete product (Admin only)
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

// Add review to product
export const addReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check if user already reviewed this product
  const existingReview = product.reviews.find(
    review => review.user.toString() === userId.toString()
  );

  if (existingReview) {
    return next(new AppError('You have already reviewed this product', 400));
  }

  const review = {
    user: userId,
    rating: Number(rating),
    comment,
    createdAt: new Date()
  };

  product.reviews.push(review);
  
  // Calculate new average rating
  const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
  product.averageRating = totalRating / product.reviews.length;

  await product.save();

  await product.populate('reviews.user', 'name');

  res.status(201).json({
    status: 'success',
    data: {
      product
    }
  });
});

// Get product categories
export const getCategories = catchAsync(async (req, res, next) => {
  const categories = await Product.distinct('category');
  
  res.status(200).json({
    status: 'success',
    data: {
      categories
    }
  });
});

// Search products by text
export const searchProducts = catchAsync(async (req, res, next) => {
  const { q: query, limit = 10 } = req.query;
  
  if (!query) {
    return next(new AppError('Search query is required', 400));
  }

  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  }).limit(Number(limit));

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
}); 