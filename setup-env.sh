#!/bin/bash

# Environment Variables Setup Script for Hash Store

echo "🚀 Hash Store - Environment Variables Setup"
echo "==========================================="
echo ""

# Check if we're setting up production or development
read -p "Are you setting up for production? (y/n): " is_production

if [ "$is_production" = "y" ] || [ "$is_production" = "Y" ]; then
    echo ""
    echo "📋 Production Environment Variables"
    echo "Copy these to your Render dashboard:"
    echo ""
    echo "NODE_ENV=production"
    echo "PORT=5000"
    echo "MONGODB_URI=your_mongodb_connection_string"
    echo "JWT_SECRET=your_super_secret_jwt_key_at_least_64_characters_long"
    echo "ADMIN_JWT_SECRET=your_admin_jwt_secret_different_from_user_jwt"
    echo "JWT_EXPIRES_IN=7d"
    echo "CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name"
    echo "CLOUDINARY_API_KEY=your_cloudinary_api_key"
    echo "CLOUDINARY_API_SECRET=your_cloudinary_api_secret"
    echo "SMTP_HOST=smtp-relay.brevo.com"
    echo "SMTP_PORT=587"
    echo "SMTP_USER=your_brevo_smtp_user"
    echo "SMTP_PASS=your_brevo_smtp_password"
    echo "SENDER_EMAIL=your_sender_email"
    echo "FRONTEND_URL=https://your-frontend-app.vercel.app"
    echo "ADMIN_URL=https://your-admin-app.vercel.app"
    echo "COOKIE_DOMAIN=.onrender.com"
    echo "OTP_EXPIRY_MINUTES=10"
    echo "OTP_LENGTH=4"
    echo "RATE_LIMIT_WINDOW_MS=900000"
    echo "RATE_LIMIT_MAX_REQUESTS=100"
    echo ""
    echo "📋 Frontend/Admin Environment Variables"
    echo "Copy this to your Vercel dashboard:"
    echo ""
    echo "VITE_API_URL=https://your-backend-app.onrender.com/api"
    echo ""
    echo "⚠️  Remember to replace placeholder values with actual credentials!"
else
    echo ""
    echo "📋 Development Environment Variables"
    echo "These are already configured in your .env files"
    echo ""
    echo "✅ Backend: backend/.env"
    echo "✅ Frontend: frontend/.env"
    echo "✅ Admin: admin/.env"
fi

echo ""
echo "🔗 Helpful Links:"
echo "- Render Dashboard: https://dashboard.render.com"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- MongoDB Atlas: https://cloud.mongodb.com"
echo "- Cloudinary: https://cloudinary.com/console"
echo "- Brevo SMTP: https://app.brevo.com"
echo ""
echo "📖 For detailed deployment instructions, see DEPLOYMENT.md"
