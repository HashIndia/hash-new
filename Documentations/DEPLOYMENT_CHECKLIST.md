# Deployment Checklist

## Before Deployment

### Backend (Render)
- [ ] Remove all console.log statements ✓
- [ ] Set NODE_ENV=production ✓
- [ ] Configure CORS for production domains ✓
- [ ] Set secure cookie options for production ✓
- [ ] Environment variables configured ✓
- [ ] Health check endpoint available ✓
- [ ] Database connection string updated
- [ ] Email service credentials configured
- [ ] Payment gateway credentials configured

### Frontend (Vercel)
- [ ] Remove all console.log statements ✓
- [ ] API URL environment variable configured ✓
- [ ] Vercel.json routing configuration added ✓
- [ ] Build command and output directory configured
- [ ] Environment variables set in Vercel dashboard

### Admin Panel (Vercel)
- [ ] Remove all console.log statements ✓
- [ ] API URL environment variable configured ✓
- [ ] Vercel.json routing configuration added ✓
- [ ] Build command and output directory configured
- [ ] Environment variables set in Vercel dashboard

## Environment Variables to Set

### Render (Backend)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
ADMIN_JWT_SECRET=your_admin_jwt_secret
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
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend-app.onrender.com/api
```

### Vercel (Admin)
```
VITE_API_URL=https://your-backend-app.onrender.com/api
```

## Post-Deployment Testing

### Backend
- [ ] Health check endpoint responds: `GET /health`
- [ ] CORS headers are present in responses
- [ ] Authentication endpoints work
- [ ] Admin authentication works
- [ ] Database connection is successful
- [ ] Email sending works
- [ ] File uploads work (Cloudinary)

### Frontend
- [ ] Application loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] API calls are successful
- [ ] Routing works correctly
- [ ] Authentication state persists

### Admin Panel
- [ ] Application loads without errors
- [ ] Admin login works
- [ ] Dashboard loads data
- [ ] API calls are successful
- [ ] Routing works correctly
- [ ] Admin functions work

## Security Checks
- [ ] All secrets are in environment variables
- [ ] No hardcoded URLs or credentials in code
- [ ] HTTPS is enforced
- [ ] Secure cookies are enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Error messages don't expose sensitive data

## Performance
- [ ] Database indexes are optimized
- [ ] Image optimization is enabled
- [ ] Compression is enabled
- [ ] CDN is configured (if applicable)

## Monitoring
- [ ] Error logging is configured
- [ ] Application monitoring is set up
- [ ] Database monitoring is active
- [ ] Uptime monitoring is configured

## Domain & SSL
- [ ] Custom domains configured (if applicable)
- [ ] SSL certificates are valid
- [ ] HTTP redirects to HTTPS
- [ ] HSTS headers are set

## Backup & Recovery
- [ ] Database backup strategy is in place
- [ ] File storage backup is configured
- [ ] Disaster recovery plan is documented

## Go-Live
- [ ] DNS records updated (if using custom domains)
- [ ] Load testing completed
- [ ] Final smoke tests passed
- [ ] Team notified of deployment
- [ ] Documentation updated with production URLs
