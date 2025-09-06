# Hash Store - Deployment Guide

This guide will help you deploy the Hash Store application to production using Render (backend) and Vercel (frontend & admin).

## Backend Deployment (Render)

### Prerequisites
- Render account (https://render.com)
- MongoDB Atlas cluster
- Cloudinary account
- Email service (Brevo/Sendinblue)

### Steps

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the `backend` folder as the root directory
   - Use the following settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Node Version**: 18 or higher

2. **Environment Variables**
   Set the following environment variables in Render dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_at_least_64_characters_long
   ADMIN_JWT_SECRET=your_admin_jwt_secret_different_from_user_jwt
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=your_brevo_smtp_user
   SMTP_PASS=your_brevo_smtp_password
   SENDER_EMAIL=your_sender_email
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ADMIN_URL=https://your-admin-app.vercel.app
   COOKIE_DOMAIN=.onrender.com
   OTP_EXPIRY_MINUTES=10
   OTP_LENGTH=4
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   CASHFREE_APP_ID=your_cashfree_app_id
   CASHFREE_SECRET_KEY=your_cashfree_secret_key
   CASHFREE_WEBHOOK_SECRET=your_cashfree_webhook_secret
   ```

3. **Deploy**
   - Render will automatically deploy your backend
   - Note the deployment URL (e.g., `https://your-app-name.onrender.com`)

## Frontend Deployment (Vercel)

### Steps

1. **Create a new Project on Vercel**
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Environment Variables**
   Set the following environment variable in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```

3. **Deploy**
   - Vercel will automatically deploy your frontend
   - Note the deployment URL

## Admin Panel Deployment (Vercel)

### Steps

1. **Create another new Project on Vercel**
   - Import your GitHub repository
   - Select the `admin` folder as the root directory
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Environment Variables**
   Set the following environment variable in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```

3. **Deploy**
   - Vercel will automatically deploy your admin panel

## Post-Deployment Steps

1. **Update Backend Environment Variables**
   - Update `FRONTEND_URL` and `ADMIN_URL` in your Render environment variables with the actual Vercel URLs
   - Redeploy the backend service

2. **Test the Application**
   - Test user registration, login, and logout
   - Test admin login and functionality
   - Test API endpoints
   - Verify cookie-based authentication works across domains

## Important Notes

- **CORS**: The backend is configured to allow requests from your frontend and admin URLs in production
- **Cookies**: Configured for cross-origin requests with `sameSite: 'none'` and `secure: true` in production
- **Environment Variables**: Make sure all sensitive data is stored in environment variables, not in code
- **Database**: Ensure your MongoDB Atlas cluster allows connections from Render's IP addresses
- **SSL**: Both Render and Vercel provide HTTPS by default

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify `FRONTEND_URL` and `ADMIN_URL` are correctly set in backend environment variables
   - Check that the URLs match exactly (including https://)

2. **Cookie Issues**
   - Ensure cookies are configured with `secure: true` and `sameSite: 'none'` in production
   - Verify domain settings in cookie configuration

3. **API Connection Issues**
   - Check that `VITE_API_URL` is set correctly in frontend/admin
   - Verify the backend is running and accessible

4. **Environment Variables**
   - Double-check all environment variables are set correctly
   - Restart services after changing environment variables

## Security Considerations

- Change all default passwords and secrets
- Use strong, unique JWT secrets
- Enable rate limiting
- Monitor application logs
- Set up error monitoring (e.g., Sentry)
- Regularly update dependencies

## Monitoring

- Use Render's built-in logging for backend monitoring
- Set up Vercel Analytics for frontend monitoring
- Consider adding error tracking services

For any issues during deployment, check the logs in Render dashboard and Vercel deployment logs.
