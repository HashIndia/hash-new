# Razorpay Test User Setup Guide

## 🎯 Test User Credentials for Razorpay Verification

### User Details
- **Name**: Razorpay Test User
- **Email**: razorpay.test@hashdemo.com
- **Password**: RazorpayTest@2024
- **Phone**: +919876543210

### Address Information
```
NITK Surathkal Campus
Student Hostel Block
Mangalore, Karnataka 575025
India
```

## 📋 Setup Options

### Option 1: Manual Registration (Recommended)
1. Go to your website's registration page
2. Fill in the form with the credentials above
3. Verify the email (if verification is enabled)
4. Complete the profile setup

### Option 2: Database Creation (When MongoDB is accessible)
Run the updated `createTestUser.js` script:
```bash
cd backend
node createTestUser.js
```

### Option 3: Admin Panel Creation
If you have an admin panel, create the user with these exact credentials.

## 🛒 Test Purchase Flow for Razorpay

### Step 1: Login
- Use the test credentials to login

### Step 2: Shopping
- Browse the shop
- Add items to cart
- Proceed to checkout

### Step 3: Payment Testing
Use these Razorpay test card details:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits (e.g., 123)
- **Name**: Any name

### Step 4: Verification Points
Razorpay will check:
- ✅ User can register successfully
- ✅ User can login
- ✅ Shopping cart functionality works
- ✅ Checkout process is smooth
- ✅ Payment integration works
- ✅ All compliance pages are accessible
- ✅ Order confirmation works

## 📄 Compliance Pages Checklist
Make sure these are accessible from your website:
- ✅ Terms and Conditions (`/terms`)
- ✅ Privacy Policy (`/privacy`)
- ✅ Shipping Policy (`/shipping`)
- ✅ Contact Us (`/contact`)
- ✅ Cancellation & Refunds (`/returns`)

## 🔗 Website URLs to Provide Razorpay
- **Main Website**: https://your-hash-website.vercel.app
- **Terms**: https://your-hash-website.vercel.app/terms
- **Privacy**: https://your-hash-website.vercel.app/privacy
- **Shipping**: https://your-hash-website.vercel.app/shipping
- **Contact**: https://your-hash-website.vercel.app/contact
- **Returns**: https://your-hash-website.vercel.app/returns

## 📧 What to Send Razorpay

```
Dear Razorpay Team,

Please find the test user credentials for verification:

Website: https://your-hash-website.vercel.app
Test Email: razorpay.test@hashdemo.com
Test Password: RazorpayTest@2024

All required compliance pages are accessible via the footer links.
You can complete a full test purchase using standard Razorpay test cards.

Thank you,
[Your Name]
```

## ⚠️ Important Notes
- Keep these credentials secure
- Only share with Razorpay verification team
- Ensure your website is deployed and accessible
- Test the full purchase flow yourself before submitting
- Make sure all compliance pages load correctly
