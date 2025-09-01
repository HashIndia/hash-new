# Quick Fix for Admin Login 500 Error

## The Issue
The admin login is failing with a 500 error because of missing environment variables for JWT token generation.

## Quick Fix - Add These Environment Variables to Render

In your Render dashboard, go to your backend service and add these environment variables:

### Required Variables:
```
JWT_SECRET=your_main_jwt_secret_here
```

### Optional (for better security):
```
JWT_REFRESH_SECRET=your_refresh_secret_here
ADMIN_JWT_SECRET=your_admin_specific_secret_here
```

## How to Generate Secrets:
You can use any of these methods to generate secure secrets:

### Method 1: Online Generator
- Go to https://generate-random.org/api-key-generator
- Generate a 64-character key

### Method 2: Node.js (if you have it installed)
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Method 3: Simple Random String
Just create a long random string (at least 32 characters) with letters and numbers.

## After Adding the Variables:
1. Redeploy your Render service
2. Test the admin login again
3. Check the debug endpoint at: `https://your-backend.onrender.com/api/debug`

## Test the Debug Endpoint:
Visit: `https://your-backend.onrender.com/api/debug`

This will show you:
- Which environment variables are set
- Current environment status
- CORS configuration

## If Still Having Issues:
The code now has fallback logic, so it should work with just `JWT_SECRET` set. If you're still getting 500 errors, check the Render logs for the specific error message.
