# Admin Authentication Fix - Deployment Guide

## Changes Made to Fix Admin Login Issues

### Backend Changes:
1. **Updated Admin Authentication Routes** (`routes/admin/auth.js`):
   - Now uses centralized `setAuthCookies()` function with consistent cross-origin settings
   - Added refresh token mechanism for admin
   - Fixed cookie settings to use `sameSite: 'none'` for production

2. **Added Token Generation** (`utils/tokenUtils.js`):
   - Added `generateTokens()` function for both user and admin
   - Supports refresh tokens for admin with 30-day expiration

### Frontend Admin Changes:
1. **Updated API Interceptor** (`admin/src/services/api.js`):
   - Added automatic token refresh on 401 errors
   - Prevents infinite loops with retry logic

2. **Enhanced Auth Store** (`admin/src/stores/useAuthStore.js`):
   - Added token refresh attempt in `checkAuth()` function
   - Better error handling for authentication

## Key Fixes:
- **Cookie Domain**: Removed domain restrictions for cross-origin compatibility
- **SameSite Policy**: Set to 'none' for production cross-origin requests
- **Token Refresh**: Added automatic refresh mechanism for admin panel
- **Consistent Settings**: Admin now uses same cookie configuration as user auth

## Environment Variables Needed:
```
JWT_REFRESH_SECRET=your-refresh-secret (different from JWT_SECRET)
ADMIN_JWT_SECRET=your-admin-secret (or uses JWT_SECRET as fallback)
```

## Testing Steps:
1. Deploy backend with new authentication code
2. Test admin login - should stay logged in when navigating
3. Check browser developer tools for cookies persistence
4. Verify no authentication loops or redirects

## Expected Behavior:
- Admin logs in successfully
- Cookies persist across page navigation
- Automatic token refresh prevents logout
- Smooth navigation between admin pages
