# CORS Fix for Custom Domain

## 🔧 What I Fixed

Updated the backend CORS configuration to include your custom domain `https://www.hashindia.in`.

### Changes Made:

1. **Updated `backend/server.js`** - Enhanced CORS configuration to include:
   - `https://www.hashindia.in`
   - `https://hashindia.in` (without www)
   - Support for additional origins via environment variable

2. **Added debugging** - The server will now log allowed CORS origins in production

## 🚀 Deployment Steps

### Step 1: Update Environment Variables on Render

Go to your Render dashboard for the backend service and update these environment variables:

```bash
FRONTEND_URL=https://www.hashindia.in
# OR if you want to keep both
ADDITIONAL_ORIGINS=https://www.hashindia.in,https://hashindia.in
```

### Step 2: Deploy the Updated Backend

1. Commit and push the changes:
```bash
cd backend
git add .
git commit -m "Fix CORS for custom domain hashindia.in"
git push origin main
```

2. Render will automatically redeploy your backend

### Step 3: Update Frontend API Base URL

Make sure your frontend is pointing to the correct backend URL. Check your frontend environment variables:

```bash
# In your frontend deployment (Vercel/Netlify)
VITE_API_BASE_URL=https://hash-c170.onrender.com
```

## 🔍 How to Verify the Fix

1. **Check Backend Logs**: After deployment, check Render logs for:
   ```
   🌐 CORS allowed origins: ["https://www.hashindia.in", "https://hashindia.in", ...]
   ```

2. **Test API Calls**: Open your browser dev tools and check if CORS errors are gone

3. **Network Tab**: Look for successful OPTIONS preflight requests

## 🛠️ Alternative Solutions (if above doesn't work)

### Option 1: Temporary Fix - Allow All Origins
If you need a quick fix while testing:

```javascript
// In server.js (ONLY for testing - not recommended for production)
const corsOptions = {
  origin: true, // Allows all origins
  credentials: true,
  // ... rest of the config
};
```

### Option 2: Dynamic Origin Validation
```javascript
const corsOptions = {
  origin: (origin, callback) => {
    const allowedDomains = ['hashindia.in', 'www.hashindia.in'];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin domain is allowed
    const originDomain = new URL(origin).hostname;
    if (allowedDomains.some(domain => originDomain === domain || originDomain.endsWith('.' + domain))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  // ... rest of the config
};
```

## 🔗 Frontend Configuration

Make sure your frontend API service is configured correctly:

```javascript
// In frontend/src/services/api.js or similar
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hash-c170.onrender.com';

// Ensure credentials are included in requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for CORS with cookies
});
```

## 📋 Checklist

- [ ] Updated backend CORS configuration
- [ ] Deployed backend changes to Render
- [ ] Updated FRONTEND_URL environment variable on Render
- [ ] Verified frontend API base URL
- [ ] Checked browser dev tools for CORS errors
- [ ] Tested API calls from custom domain

## 🆘 If Issues Persist

1. **Check Render Environment Variables**: Ensure all URLs are exact matches
2. **Verify HTTPS**: Make sure all URLs use HTTPS in production
3. **Browser Cache**: Clear browser cache and hard refresh
4. **Check Network Tab**: Look for 200 OK responses on OPTIONS requests

## 📞 Common CORS Error Messages

- `No 'Access-Control-Allow-Origin' header` → Origin not in allowed list
- `CORS policy: credentials mode` → withCredentials config issue
- `Method not allowed` → HTTP method not in allowed methods list

The fix should resolve your CORS error. Redeploy the backend and test!
