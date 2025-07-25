import express from 'express';
import { body } from 'express-validator';
import * as adminController from '../controllers/adminController.js';
import * as analyticsController from '../controllers/analyticsController.js';
import { protectAdmin, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const campaignValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Campaign name must be between 3 and 100 characters'),
  body('type')
    .isIn(['email', 'sms'])
    .withMessage('Campaign type must be either email or sms'),
  body('content')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Content must be between 10 and 1000 characters'),
  body('targetAudience')
    .isIn(['all', 'verified', 'custom'])
    .withMessage('Invalid target audience')
];

const customerStatusValidation = [
  body('status')
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Invalid customer status')
];

// Public admin routes
router.post('/login', loginValidation, adminController.adminLogin);
router.post('/refresh-token', adminController.adminRefreshToken);

// Protected admin routes
router.use(protectAdmin);

// Admin auth management
router.get('/me', adminController.getCurrentAdmin);
router.post('/logout', adminController.adminLogout);
router.post('/logout-all', adminController.adminLogoutAll);

// Dashboard and analytics
router.get('/dashboard', adminController.getDashboardAnalytics);
router.get('/system-stats', adminController.getSystemStats);
router.get('/analytics/revenue', analyticsController.getRevenueAnalytics);
router.get('/analytics/customers', analyticsController.getCustomerAnalytics);
router.get('/analytics/products', analyticsController.getProductAnalytics);

// Customer management
router.get('/customers', adminController.getAllCustomers);
router.get('/customers/:id', adminController.getCustomer);
router.patch('/customers/:id/status', customerStatusValidation, adminController.updateCustomerStatus);

// Campaign management
router.get('/campaigns', adminController.getAllCampaigns);
router.get('/campaigns/templates', adminController.getCampaignTemplates);
router.post('/campaigns', campaignValidation, adminController.createCampaign);
router.post('/campaigns/templates', campaignValidation, adminController.createTemplate);
router.get('/campaigns/:id', adminController.getCampaign);
router.patch('/campaigns/:id', campaignValidation, adminController.updateCampaign);
router.delete('/campaigns/:id', adminController.deleteCampaign);
router.post('/campaigns/:id/send', adminController.sendCampaign);

export default router; 