# 🌐 Custom Domain Configuration

## ✅ **Environment Variable Added**

### **CUSTOM_DOMAIN Environment Variable**

Added `CUSTOM_DOMAIN=hashindia.in` to all environment files and configurations.

## 🔧 **Files Updated**

### **1. Backend Environment Configuration**
**File**: `backend/.env`
```bash
# Domain Configuration
CUSTOM_DOMAIN=hashindia.in

# Frontend URLs for Production
FRONTEND_URL=https://www.hashindia.in
ADMIN_URL=https://your-admin-app.vercel.app
```

### **2. Frontend Environment Configuration**
**Files**: `frontend/.env` and `frontend/.env.production`
```bash
VITE_API_URL=https://hash-c170.onrender.com/api
VITE_CUSTOM_DOMAIN=hashindia.in
```

### **3. Domain Utility Functions**
**File**: `backend/utils/domainUtils.js`
- ✅ `getCustomDomain()` - Get domain from environment
- ✅ `getFrontendUrl()` - Construct frontend URL
- ✅ `getAllowedOrigins()` - Get CORS allowed origins
- ✅ `getAdminUrl()` - Construct admin URL
- ✅ `getResetPasswordUrl()` - Build reset password URLs
- ✅ `getAppUrl()` - Construct app URLs with paths

### **4. Updated CORS Configuration**
**File**: `backend/server.js`
```javascript
import { getAllowedOrigins } from './utils/domainUtils.js';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? getAllowedOrigins()  // Uses CUSTOM_DOMAIN dynamically
    : true,
  credentials: true,
  // ... other options
};
```

## 🎯 **How It Works**

### **Domain-Based URL Construction**
```javascript
// Before (hardcoded)
origins.push('https://www.hashindia.in');
origins.push('https://hashindia.in');

// After (dynamic from CUSTOM_DOMAIN)
const domain = process.env.CUSTOM_DOMAIN; // 'hashindia.in'
origins.push(`https://www.${domain}`);     // 'https://www.hashindia.in'
origins.push(`https://${domain}`);         // 'https://hashindia.in'
```

### **CORS Origins Automatically Include**
- ✅ `https://www.hashindia.in`
- ✅ `https://hashindia.in`
- ✅ `http://www.hashindia.in` (development)
- ✅ `http://hashindia.in` (development)
- ✅ Environment-specified URLs (`FRONTEND_URL`, `ADMIN_URL`)
- ✅ Additional origins from `ADDITIONAL_ORIGINS`

## 🔄 **Dynamic URL Generation**

### **Reset Password URLs**
```javascript
import { getResetPasswordUrl } from '../utils/domainUtils.js';

// Automatically uses CUSTOM_DOMAIN
const resetURL = getResetPasswordUrl(resetToken);
// Result: https://www.hashindia.in/reset-password/abc123...
```

### **App URLs**
```javascript
import { getAppUrl } from '../utils/domainUtils.js';

const shopUrl = getAppUrl('/shop');
// Result: https://www.hashindia.in/shop

const orderUrl = getAppUrl(`/orders/${orderId}`);
// Result: https://www.hashindia.in/orders/64f1a2b3c4d5e6f7...
```

## 🌍 **Production Deployment**

### **Render Environment Variables**
Set these in your Render dashboard:
```bash
CUSTOM_DOMAIN=hashindia.in
FRONTEND_URL=https://www.hashindia.in
ADMIN_URL=https://your-admin-app.vercel.app
# ... other existing variables
```

### **Vercel Environment Variables**
Set these in your Vercel dashboard:
```bash
VITE_API_URL=https://hash-c170.onrender.com/api
VITE_CUSTOM_DOMAIN=hashindia.in
```

## 🧪 **Testing the Configuration**

### **1. CORS Origins**
Check server logs on startup:
```
🌐 CORS allowed origins: [
  'https://www.hashindia.in',
  'https://hashindia.in',
  'https://your-admin-app.vercel.app'
]
```

### **2. Domain Utility Functions**
```javascript
import domainUtils from './utils/domainUtils.js';

console.log('Custom Domain:', domainUtils.getCustomDomain());
// Output: hashindia.in

console.log('Frontend URL:', domainUtils.getFrontendUrl());
// Output: https://www.hashindia.in

console.log('Allowed Origins:', domainUtils.getAllowedOrigins());
// Output: ['https://www.hashindia.in', 'https://hashindia.in', ...]
```

### **3. API Calls**
Frontend should now call:
```
POST https://hash-c170.onrender.com/api/auth/forgot-password
```
With CORS headers allowing `https://www.hashindia.in`

## 🔄 **Future Domain Changes**

### **To Change Domain**:
1. Update `CUSTOM_DOMAIN` in backend `.env`
2. Update `VITE_CUSTOM_DOMAIN` in frontend `.env`
3. Update production environment variables
4. Redeploy both frontend and backend

### **No Code Changes Required**:
- ✅ CORS origins update automatically
- ✅ Email URLs update automatically  
- ✅ Reset password links update automatically
- ✅ All app URLs update automatically

## 📊 **Benefits of This Approach**

- ✅ **Single Source of Truth**: One environment variable controls all domain usage
- ✅ **Easy Domain Changes**: Update environment variable instead of code
- ✅ **Consistent URLs**: All URLs constructed from same domain configuration
- ✅ **Development Friendly**: Supports both production and development environments
- ✅ **CORS Automatic**: Origins automatically include domain variations
- ✅ **Email Links**: Reset password emails use correct domain automatically

## 🎉 **Configuration Complete**

Your domain configuration is now centralized and uses `CUSTOM_DOMAIN=hashindia.in` throughout the application. All CORS origins, email links, and URL construction will use this environment variable dynamically!
