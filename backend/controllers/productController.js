import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Get all products with filtering, sorting, and pagination
export const getAllProducts = catchAsync(async (req, res, next) => {
  // Build query object
  const queryObj = { isActive: true };
  
  // Handle category filter
  if (req.query.category && req.query.category !== 'all') {
    queryObj.category = req.query.category;
  }
  
  // Handle price filters
  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
  }
  
  // Handle search
  if (req.query.search) {
    queryObj.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { tags: { $in: [new RegExp(req.query.search, 'i')] } }
    ];
  }

  // Handle stock filters for admin
  if (req.query.stock) {
    if (req.query.stock === 'low') {
      queryObj.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    } else if (req.query.stock === 'out') {
      queryObj.stock = 0;
    }
  }

  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Sorting
  let sortObj = {};
  if (req.query.sort) {
    const sortField = req.query.sort;
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    sortObj[sortField] = sortOrder;
  } else {
    sortObj.createdAt = -1; // Default sort by newest
  }

  // Execute query
  const products = await Product.find(queryObj)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .select('name price images rating category slug stock isActive description tags');

  // Get total count for pagination
  const total = await Product.countDocuments(queryObj);

  res.status(200).json({
    status: 'success',
    results: products.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: {
      products
    }
  });
});

// Get single product
export const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
    isActive: true
  }).populate('reviews.user', 'name');

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
  const productData = { ...req.body };
  
  // Handle image uploads
  if (req.files && req.files.length > 0) {
    productData.images = req.files.map(file => file.path);
  }

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
  
  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    updateData.images = req.files.map(file => file.path);
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
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

// Delete product (Admin only)
export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Add product review
export const addReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check if user has already reviewed this product
  const existingReview = product.reviews.find(
    review => review.user.toString() === userId.toString()
  );

  if (existingReview) {
    return next(new AppError('You have already reviewed this product', 400));
  }

  // Add review
  const review = {
    user: userId,
    rating: Number(rating),
    comment,
    createdAt: new Date()
  };

  product.reviews.push(review);

  // Calculate new average rating
  const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
  product.rating = totalRating / product.reviews.length;

  await product.save();

  // Populate the user field for the response
  await product.populate('reviews.user', 'name');

  res.status(201).json({
    status: 'success',
    data: {
      review: product.reviews[product.reviews.length - 1]
    }
  });
});

// Get product categories
export const getCategories = catchAsync(async (req, res, next) => {
  const categories = await Product.distinct('category', { isActive: true });

  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  });
});

// Search products
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
    ],
    isActive: true
  }).limit(Number(limit));

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// Update product stock
export const updateStock = catchAsync(async (req, res, next) => {
  const { stock, lowStockThreshold } = req.body;
  
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { 
      stock,
      lowStockThreshold: lowStockThreshold || 10,
      updatedAt: new Date()
    },
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

// Bulk update stock
export const bulkUpdateStock = catchAsync(async (req, res, next) => {
  const { updates } = req.body;
  
  if (!updates || !Array.isArray(updates)) {
    return next(new AppError('Updates array is required', 400));
  }

  const bulkOps = updates.map(update => ({
    updateOne: {
      filter: { _id: update.productId },
      update: { 
        stock: update.stock,
        lowStockThreshold: update.lowStockThreshold || 10,
        updatedAt: new Date()
      }
    }
  }));

  const result = await Product.bulkWrite(bulkOps);

  res.status(200).json({
    status: 'success',
    data: {
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    }
  });
});

// Get low stock products
export const getLowStockProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    isActive: true
  }).select('name stock lowStockThreshold category price');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

// Get out of stock products
export const getOutOfStockProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    stock: 0,
    isActive: true
  }).select('name stock category price');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
}); 