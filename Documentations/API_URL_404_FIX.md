# 🔧 API URL Fix for 404 Error

## ❌ **Problem Identified:**

The frontend is trying to call:
```
POST https://hash-c170.onrender.com/api/auth/forgot-password 404 (Not Found)
```

But getting a 404 error. This happens because:

### **Root Cause**: Wrong API URL Configuration

The frontend `.env` files were pointing to placeholder/localhost URLs instead of your actual backend URL.

## ✅ **Fixes Applied:**

### 1. Updated Frontend Environment Files

**File**: `frontend/.env`
```bash
# Before
VITE_API_URL=http://localhost:5000/api

# After  
VITE_API_URL=https://hash-c170.onrender.com/api
```

**File**: `frontend/.env.production`
```bash
# Before
VITE_API_URL=https://your-backend-app.onrender.com/api

# After
VITE_API_URL=https://hash-c170.onrender.com/api
```

### 2. Verification Steps

**Backend Route Exists**: ✅ Confirmed `/api/auth/forgot-password` route exists
**Controller Function**: ✅ `forgotPassword` function is properly exported  
**Server Mounting**: ✅ Auth routes mounted at `/api/auth`

## 🚀 **Deploy Frontend Fix**

### **For Vercel Deployment:**

1. **Set Environment Variable in Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - Select your project: `Hash`
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://hash-c170.onrender.com/api`
   - Set for: Production, Preview, Development

2. **Redeploy Frontend:**
```bash
git add .
git commit -m "Fix API URL for production deployment"
git push origin main
```

### **Alternative: Quick Deploy**
```bash
cd frontend
npm run build
# Then upload the dist folder to your hosting
```

## 🧪 **Test After Deployment**

### Expected API Calls:
- **Forgot Password**: `POST https://hash-c170.onrender.com/api/auth/forgot-password`
- **Reset Password**: `PATCH https://hash-c170.onrender.com/api/auth/reset-password/{token}`

### Test Flow:
1. Go to: https://www.hashindia.in/forgot-password
2. Enter email and click "Send Reset Link"
3. **Expected**: Success message, email sent
4. **Should NOT see**: 404 error

## 🔍 **Debug Information**

### If Still Getting 404:

**Check Browser Network Tab:**
- URL should be: `https://hash-c170.onrender.com/api/auth/forgot-password`
- Method: `POST`
- Body: `{"email": "user@example.com"}`

**Check Vercel Environment Variables:**
- Go to Vercel Dashboard → Settings → Environment Variables
- Verify `VITE_API_URL` is set correctly
- Redeploy if needed

**Check Backend is Running:**
- Visit: https://hash-c170.onrender.com/api/auth (should return method not allowed)
- Check Render dashboard for backend status

## 📋 **Quick Checklist**

- ✅ **Backend URL**: `https://hash-c170.onrender.com` (confirmed working)
- ✅ **Frontend Files**: Updated `.env` and `.env.production`
- ⏳ **Vercel Environment**: Need to set `VITE_API_URL` in dashboard
- ⏳ **Redeploy Frontend**: Push changes and verify deployment
- ⏳ **Test Password Reset**: Should work after frontend redeploy

## 🎯 **Expected Result**

After frontend redeployment:
- ✅ **No More 404**: Forgot password API calls succeed
- ✅ **Email Sent**: Password reset emails delivered
- ✅ **Complete Flow**: Full password reset functionality working
- ✅ **Production Ready**: All environment variables correctly configured

The 404 error should be completely resolved once the frontend is redeployed with the correct API URL!
