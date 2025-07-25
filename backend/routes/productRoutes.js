import express from 'express';
import { body } from 'express-validator';
import * as productController from '../controllers/productController.js';
import { protectUser, protectAdmin, restrictTo } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Comment must be between 5 and 500 characters')
];

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProduct);

// Special inventory routes (admin access required but placed before middleware)
router.get('/inventory/low-stock', protectAdmin, productController.getLowStockProducts);
router.get('/inventory/out-of-stock', protectAdmin, productController.getOutOfStockProducts);

// Protected routes (require user authentication)
router.use(protectUser);
router.post('/:id/reviews', reviewValidation, productController.addReview);

// Admin routes (require admin authentication)
router.use(protectAdmin);
router.post(
  '/',
  upload.array('images', 5),
  productValidation,
  productController.createProduct
);
router.patch(
  '/:id',
  upload.array('images', 5),
  productValidation,
  productController.updateProduct
);
router.delete('/:id', productController.deleteProduct);

// Stock management routes
router.patch('/:id/stock', productController.updateStock);
router.patch('/bulk-stock', productController.bulkUpdateStock);

export default router; 