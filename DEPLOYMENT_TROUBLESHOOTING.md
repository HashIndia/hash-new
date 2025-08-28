# Authentication Troubleshooting Guide

## Issue: Users get logged out when navigating between pages

### Key Changes Made:

1. **Removed Cookie Domain Restriction**
   - Updated `tokenUtils.js` to not set a domain for cookies in production
   - This allows cookies to work properly across different domains (Vercel + Render)

2. **Cookie Configuration**
   - `httpOnly: true` - Prevents XSS attacks
   - `secure: true` - Only sends cookies over HTTPS in production
   - `sameSite: 'none'` - Allows cross-origin cookie sharing
   - No domain restriction - Let browser handle cookie domain

### Steps to Fix:

1. **Deploy the updated backend** with the new cookie settings
2. **Check Render Environment Variables** using the template in `.env.render.template`
3. **Verify Vercel Environment Variables** using templates in frontend/admin folders
4. **Test the debug endpoint**: `GET /api/debug` to see what cookies are being received

### Critical Environment Variables for Render:

```
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
JWT_SECRET=your-strong-secret
JWT_REFRESH_SECRET=your-other-strong-secret
```

### Critical Environment Variables for Vercel:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Testing Steps:

1. **Test the debug endpoint**:
   ```
   curl https://your-backend.onrender.com/api/debug
   ```

2. **Check browser developer tools**:
   - Go to Application > Cookies
   - Check if `userAccessToken` and `userRefreshToken` cookies are present
   - Verify they persist across page navigations

3. **Check Network tab**:
   - Look for authentication requests
   - Verify cookies are being sent with requests
   - Check for CORS errors

### Common Issues and Solutions:

1. **Cookies not being set**:
   - Verify CORS configuration allows credentials
   - Check that `withCredentials: true` is set in frontend API calls
   - Ensure `sameSite: 'none'` and `secure: true` for cross-origin

2. **Environment variables not set correctly**:
   - Double-check FRONTEND_URL and ADMIN_URL in Render
   - Verify VITE_API_URL in Vercel projects
   - Make sure URLs match exactly (no trailing slashes, correct protocol)

3. **CORS errors**:
   - Verify origin in CORS configuration matches your Vercel URLs exactly
   - Check that credentials are allowed in CORS settings

### Debug Endpoint Usage:

After deploying, visit:
- `https://your-backend.onrender.com/api/debug`

This will show you:
- Current environment
- Cookies received by the server
- CORS configuration
- Request headers

### If Still Having Issues:

1. Check Render deployment logs for errors
2. Use browser developer tools to inspect network requests
3. Verify all environment variables are set correctly
4. Test login flow step by step using the debug endpoint
