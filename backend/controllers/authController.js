import crypto from 'crypto';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as emailService from '../services/emailService.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken, 
  revokeRefreshToken,
  revokeAllRefreshTokens,
  setAuthCookies,
  clearAuthCookies,
  extractTokensFromCookies
} from '../utils/tokenUtils.js';

// Create and send tokens via cookies
const createSendTokens = async (user, statusCode, res, req) => {
  const accessToken = generateAccessToken({ id: user._id, role: user.role }, 'user');
  const refreshToken = await generateRefreshToken(
    user._id, 
    'user', 
    req.ip, 
    req.get('User-Agent')
  );

  // Set secure HTTP-only cookies
  setAuthCookies(res, accessToken, refreshToken, 'user');

  // Remove sensitive data from output
  user.password = undefined;
  user.otp = undefined;
  user.otpExpires = undefined;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  });
};

// Register new user - Step 1: Initiate registration and send OTP
export const register = catchAsync(async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, errors.array()));
  }

  const { name, email, phone, password } = req.body;

  // Check if user already exists and is verified
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
    isPhoneVerified: true
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return next(new AppError('An account with this email already exists.', 400));
    }
    if (existingUser.phone === phone) {
      return next(new AppError('An account with this phone number already exists.', 400));
    }
  }

  // Generate OTP
  const otp = User.generateOTP();
  console.log(`[DEV] Registration OTP for ${email}: ${otp}`); // <-- Log OTP for dev

  // Send OTP email
  try {
    await emailService.sendOTPEmail({ name, email }, otp);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return next(new AppError('Failed to send OTP. Please try again.', 500));
  }

  // Create a temporary token containing user data and OTP
  const registrationToken = jwt.sign(
    { name, email, phone, password, otp },
    process.env.JWT_SECRET,
    { expiresIn: `${process.env.OTP_EXPIRY_MINUTES}m` }
  );

  res.status(200).json({
    status: 'success',
    message: `An OTP has been sent to ${email}. Please use it to verify your account.`,
    data: {
      registrationToken
    }
  });
});

// Login user
export const login = catchAsync(async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, errors.array()));
  }

  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // Check if user exists && password is correct
  let user = await User.findOne({ 
    $or: [
      { email: email },
      { phone: email } // Allow login with phone number
    ]
  }).select('+password +loginAttempts +lockUntil');

  if (!user || !(await user.correctPassword(password, user.password))) {
    // Handle failed login attempts
    if (user) {
      await user.incLoginAttempts();
    }
    return next(new AppError('Incorrect email or password', 401));
  }

  // Check if account is locked
  if (user.isLocked) {
    return next(new AppError('Account is temporarily locked due to too many failed login attempts. Please try again later.', 423));
  }

  // Reset login attempts on successful login
  if (user.loginAttempts && user.loginAttempts > 0) {
    await user.updateOne({
      $unset: { loginAttempts: 1, lockUntil: 1 }
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Create and send tokens
  await createSendTokens(user, 200, res, req);
});

// Verify OTP - Step 2: Verify OTP and create user
export const verifyOTP = catchAsync(async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Validation failed', 400, errors.array()));
  }

  const { registrationToken, otp } = req.body;

  if (!registrationToken || !otp) {
    return next(new AppError('Registration token and OTP are required.', 400));
  }

  // Verify the temporary token
  let decoded;
  try {
    decoded = jwt.verify(registrationToken, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired registration token. Please register again.', 400));
  }

  // Check if OTP matches
  if (decoded.otp !== otp) {
    return next(new AppError('Invalid OTP.', 400));
  }

  // OTP is correct, create the user
  const { name, email, phone, password } = decoded;

  const newUser = await User.create({
    name,
    email,
    phone,
    password,
    isPhoneVerified: true, // Mark as verified since OTP is correct
    verifiedAt: new Date()
  });

  // Send welcome email
  try {
    await emailService.sendWelcomeEmail(newUser);
  } catch (error) {
    console.error('Failed to send welcome email after verification:', error);
  }

  // Log the new user in
  await createSendTokens(newUser, 201, res, req);
});

// Resend OTP
export const resendOTP = catchAsync(async (req, res, next) => {
  const { registrationToken } = req.body;

  if (!registrationToken) {
    return next(new AppError('Registration token is required to resend OTP.', 400));
  }

  // Verify the temporary token to get user details
  let decoded;
  try {
    decoded = jwt.verify(registrationToken, process.env.JWT_SECRET, {
      ignoreExpiration: true // We allow resending OTP for expired tokens
    });
  } catch (err) {
    return next(new AppError('Invalid registration token.', 400));
  }

  const { name, email, phone, password } = decoded;

  // Generate and send new OTP
  const newOtp = User.generateOTP();
  console.log(`[DEV] Resend OTP for ${email}: ${newOtp}`); // <-- Log OTP for dev

  try {
    await emailService.sendOTPEmail({ name, email }, newOtp);
  } catch (error) {
    return next(new AppError('Failed to send OTP. Please try again.', 500));
  }

  // Create a new registration token with the new OTP
  const newRegistrationToken = jwt.sign(
    { name, email, phone, password, otp: newOtp },
    process.env.JWT_SECRET,
    { expiresIn: `${process.env.OTP_EXPIRY_MINUTES}m` }
  );

  res.status(200).json({
    status: 'success',
    message: 'A new OTP has been sent to your email.',
    data: {
      registrationToken: newRegistrationToken
    }
  });
});

// Refresh access token
export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = extractTokensFromCookies(req);

  if (!refreshToken) {
    return next(new AppError('Refresh token not provided', 401));
  }

  try {
    // Verify refresh token
    const tokenDoc = await verifyRefreshToken(refreshToken, 'user');
    const user = tokenDoc.user;

    // Generate new access token
    const newAccessToken = generateAccessToken({ id: user._id, role: user.role }, 'user');

    // Update access token cookie (keep refresh token as is)
    setAuthCookies(res, newAccessToken, refreshToken, 'user');

    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    // Clear cookies if refresh token is invalid
    clearAuthCookies(res, 'user');
    return next(new AppError('Invalid refresh token', 401));
  }
});

// Logout
export const logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = extractTokensFromCookies(req);

  // Revoke refresh token if it exists
  if (refreshToken) {
    try {
      await revokeRefreshToken(refreshToken, req.ip, req.get('User-Agent'));
    } catch (error) {
      console.error('Failed to revoke refresh token:', error);
    }
  }

  // Clear auth cookies
  clearAuthCookies(res, 'user');

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// Logout from all devices
export const logoutAll = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // Revoke all refresh tokens for this user
  await revokeAllRefreshTokens(userId, 'user');

  // Clear auth cookies
  clearAuthCookies(res, 'user');

  res.status(200).json({
    status: 'success',
    message: 'Logged out from all devices successfully'
  });
});

// Forgot password
export const forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    await emailService.sendPasswordResetEmail(user, resetToken);

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later.', 500)
    );
  }
});

// Reset password
export const resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Revoke all existing refresh tokens for security
  await revokeAllRefreshTokens(user._id, 'user');

  // Log the user in, send JWT
  await createSendTokens(user, 200, res, req);
});

// Update password (for authenticated users)
export const updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.user._id).select('+password');

  // Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // If so, update password
  user.password = req.body.password;
  await user.save();

  // Revoke all existing refresh tokens except current session
  const { refreshToken } = extractTokensFromCookies(req);
  await revokeAllRefreshTokens(user._id, 'user');

  // Keep current session active by generating new tokens
  await createSendTokens(user, 200, res, req);
});

// Get current user
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate('addresses')
    .populate({
      path: 'orders',
      options: { sort: { createdAt: -1 }, limit: 5 }
    });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Update current user data
export const updateMe = catchAsync(async (req, res, next) => {
  // Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // Filter out unwanted fields that are not allowed to be updated
  const filteredBody = {};
  const allowedFields = ['name', 'email', 'phone', 'dateOfBirth', 'gender'];
  
  Object.keys(req.body).forEach(el => {
    if (allowedFields.includes(el)) {
      filteredBody[el] = req.body[el];
    }
  });

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Address management
export const getAddresses = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('addresses');
  
  res.status(200).json({
    status: 'success',
    data: {
      addresses: user.addresses
    }
  });
});

export const addAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  const newAddress = {
    ...req.body,
    id: new Date().getTime().toString()
  };
  
  user.addresses.push(newAddress);
  await user.save();
  
  res.status(201).json({
    status: 'success',
    data: {
      address: newAddress
    }
  });
});

export const updateAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const addressIndex = user.addresses.findIndex(addr => addr.id === req.params.addressId);
  
  if (addressIndex === -1) {
    return next(new AppError('Address not found', 404));
  }
  
  user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...req.body };
  await user.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      address: user.addresses[addressIndex]
    }
  });
});

export const deleteAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(addr => addr.id !== req.params.addressId);
  await user.save();
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Wishlist management
export const getWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  
  res.status(200).json({
    status: 'success',
    data: {
      wishlist: user.wishlist
    }
  });
});

export const addToWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  
  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }
  
  res.status(200).json({
    status: 'success',
    message: 'Product added to wishlist'
  });
});

export const removeFromWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
  await user.save();
  
  res.status(200).json({
    status: 'success',
    message: 'Product removed from wishlist'
  });
});