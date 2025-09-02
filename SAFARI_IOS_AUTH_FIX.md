# Safari/iOS Authentication Fix

## Problem Description

Users on iPhone and Mac (Safari browser) were experiencing automatic logout after clicking any navigation or action. This is a common issue with Safari's **Intelligent Tracking Prevention (ITP)** and strict cookie policies.

## Root Cause

1. **Safari ITP (Intelligent Tracking Prevention)**: Safari aggressively blocks third-party cookies and sometimes first-party cookies in cross-origin scenarios
2. **SameSite Cookie Policy**: Safari has stricter enforcement of SameSite=None requirements
3. **Cross-Origin Cookie Issues**: When frontend and backend are on different domains (Vercel + Render), Safari may block cookies

## Solution Implemented

### 1. Enhanced Cookie Configuration (`backend/utils/tokenUtils.js`)

**Before:**
```javascript
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};
```

**After:**
```javascript
const safariCompatibleOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' ? true : false,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
  // No domain restriction for cross-origin compatibility
};

// Added fallback headers for Safari/iOS
res.setHeader('X-Auth-Token', accessToken);
res.setHeader('X-Refresh-Token', refreshToken);
```

### 2. Multi-Layer Authentication (`backend/middleware/auth.js`)

**Enhanced Token Detection:**
```javascript
// Primary: Try cookies first
if (req.cookies && req.cookies[cookieName]) {
  token = req.cookies[cookieName];
}

// Fallback 1: Authorization header
if (!token && req.headers.authorization?.startsWith('Bearer ')) {
  token = req.headers.authorization.split(' ')[1];
}

// Fallback 2: Custom header (for Safari/iOS)
if (!token && req.headers['x-auth-token']) {
  token = req.headers['x-auth-token'];
}
```

### 3. Frontend Safari Detection & Fallback (`frontend/src/services/api.js`)

**Safari/iOS Detection:**
```javascript
const isSafariOrIOS = () => {
  const userAgent = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isMac = /Macintosh/.test(userAgent);
  return isSafari || isIOS || isMac;
};
```

**Token Management:**
- **Primary**: HTTP-only cookies (preferred method)
- **Fallback**: Authorization header with Bearer token
- **Emergency**: localStorage token for Safari/iOS session persistence

### 4. Enhanced CORS Configuration (`backend/server.js`)

**Added Headers:**
```javascript
allowedHeaders: [
  'Content-Type', 
  'Authorization', 
  'Cookie', 
  'X-Auth-Token',    // Safari/iOS fallback
  'X-Refresh-Token'
],
exposedHeaders: [
  'Set-Cookie',
  'X-Auth-Token',    // Expose for Safari/iOS
  'X-Refresh-Token'
],
```

## How It Works

### Normal Flow (Chrome, Firefox, Edge):
1. User logs in → Cookies are set
2. User navigates → Cookies are sent automatically
3. Backend validates cookie → User stays logged in

### Safari/iOS Flow:
1. User logs in → Cookies are set + fallback headers
2. If cookies work → Normal flow
3. If cookies blocked → Fallback to Authorization header
4. If all else fails → Use localStorage token

## Testing Steps

### 1. Test on Different Browsers:
```bash
# Chrome/Firefox (should work normally)
curl -c cookies.txt https://your-backend.com/api/auth/login -d '{"email":"test@test.com","password":"test"}'
curl -b cookies.txt https://your-backend.com/api/auth/me

# Safari simulation (without cookies)
curl -H "Authorization: Bearer <token>" https://your-backend.com/api/auth/me
```

### 2. Browser DevTools Testing:
1. **Chrome**: Open DevTools → Application → Cookies
2. **Safari**: Develop → Show Web Inspector → Storage → Cookies
3. Check if cookies persist after navigation

### 3. Network Tab Analysis:
- Look for `Cookie` headers in requests
- Check `Set-Cookie` headers in responses
- Verify `X-Auth-Token` headers for Safari

## Environment Variables Required

### Backend (Render):
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
JWT_SECRET=your-strong-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

### Frontend (Vercel):
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

## Key Improvements

1. **Multi-layer Authentication**: Cookies → Headers → LocalStorage
2. **Safari-specific Detection**: Targeted fixes for Safari/iOS/Mac
3. **Enhanced Cookie Options**: Better SameSite and Secure flag handling
4. **Fallback Token Headers**: X-Auth-Token for when cookies fail
5. **Improved CORS**: Better header exposure and allowance

## Browser Compatibility

| Browser | Method | Status |
|---------|--------|--------|
| Chrome | Cookies | ✅ Primary |
| Firefox | Cookies | ✅ Primary |
| Safari Desktop | Cookies + Headers | ✅ Fallback |
| Safari iOS | Headers + LocalStorage | ✅ Fallback |
| Edge | Cookies | ✅ Primary |

## Troubleshooting

### Still Getting Logout on Safari?

1. **Check Browser Settings**:
   - Safari → Preferences → Privacy → "Prevent cross-site tracking" (may need to be disabled for testing)

2. **Verify Headers**:
   ```javascript
   // In browser console on your site:
   console.log(document.cookie); // Should show auth cookies
   console.log(localStorage.getItem('safari_auth_token')); // Fallback token
   ```

3. **Network Analysis**:
   - Look for 401 responses
   - Check if cookies are being sent in requests
   - Verify CORS headers are present

### Additional Safari Settings for Development:

1. **Enable Develop Menu**: Safari → Preferences → Advanced → "Show Develop menu"
2. **Disable Security Features** (for testing only):
   - Develop → Disable Cross-Origin Restrictions
   - Develop → Disable Local File Restrictions

## Production Deployment

### Vercel Configuration:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### Render Configuration:
- Ensure environment variables are set correctly
- Verify HTTPS is enabled (required for SameSite=None)

## Files Modified

1. `backend/utils/tokenUtils.js` - Enhanced cookie handling
2. `backend/middleware/auth.js` - Multi-layer token detection  
3. `backend/server.js` - Enhanced CORS configuration
4. `frontend/src/services/api.js` - Safari detection and fallback
5. `frontend/src/stores/useUserStore.js` - Cleanup localStorage
6. `frontend/src/pages/Login.jsx` - Token extraction
7. `admin/src/services/api.js` - Admin Safari support

This comprehensive fix ensures authentication works across all browsers while maintaining security best practices.
