import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { protectUser, sensitiveOpLimit } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const loginValidation = [
  body('email')
    .custom((value) => {
      // Allow either email or phone number
      const isEmail = /\S+@\S+\.\S+/.test(value);
      const isPhone = /^\+?[\d\s-()]+$/.test(value);
      if (!isEmail && !isPhone) {
        throw new Error('Please provide a valid email or phone number');
      }
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const otpValidation = [
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),
  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
];

const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('passwordConfirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

const addressValidation = [
  body('street')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('zipCode')
    .trim()
    .isLength({ min: 5, max: 10 })
    .withMessage('ZIP code must be between 5 and 10 characters')
];

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/verify-otp', otpValidation, authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', resetPasswordValidation, authController.resetPassword);

// Protected routes (require authentication)
router.use(protectUser);

// User profile routes
router.get('/me', authController.getMe);
router.patch('/update-me', authController.updateMe);
router.patch('/update-password', 
  sensitiveOpLimit,
  [
    body('passwordCurrent').notEmpty().withMessage('Current password is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('passwordConfirm')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      })
  ],
  authController.updatePassword
);

// Logout routes
router.post('/logout', authController.logout);
router.post('/logout-all', authController.logoutAll);

// Address management routes
router.get('/addresses', authController.getAddresses);
router.post('/addresses', addressValidation, authController.addAddress);
router.patch('/addresses/:addressId', authController.updateAddress);
router.delete('/addresses/:addressId', authController.deleteAddress);

// Wishlist management routes
router.get('/wishlist', authController.getWishlist);
router.post('/wishlist/:productId', authController.addToWishlist);
router.delete('/wishlist/:productId', authController.removeFromWishlist);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running!' });
});

export default router; 