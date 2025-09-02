#!/bin/bash

# HASH Password Reset Fix - Deployment Script
echo "🚀 Deploying Password Reset Fix..."

# Check if we're in the right directory
if [ ! -f "backend/server.js" ]; then
    echo "❌ Error: Please run this script from the hash project root directory"
    exit 1
fi

# Stage all changes
echo "📦 Staging changes..."
git add .

# Check for changes
if git diff --staged --quiet; then
    echo "⚠️  No changes to commit. All fixes already staged?"
else
    echo "✅ Changes detected, proceeding with commit..."
fi

# Commit the password reset fixes
echo "💾 Committing password reset fixes..."
git commit -m "🔧 Fix password reset 500 error

- Add missing revokeAllRefreshTokens function to tokenUtils.js
- Update authController.js import to include revokeAllRefreshTokens
- Enhance resetPassword function with detailed logging
- Add comprehensive error handling and validation
- Fix backend crash when resetting password via email link

Fixes: 500 Internal Server Error on password reset
Impact: Users can now successfully reset passwords via email"

# Push to main branch (triggers Render deployment)
echo "🌐 Pushing to main branch..."
git push origin main

echo ""
echo "✅ Deployment initiated! Check Render dashboard for build progress."
echo ""
echo "🔍 Next Steps:"
echo "1. Wait for Render deployment to complete (~2-3 minutes)"
echo "2. Test password reset flow on production"
echo "3. Check Render logs if any issues occur"
echo ""
echo "📧 Test Flow:"
echo "1. Go to: https://www.hashindia.in/forgot-password"
echo "2. Enter email and request reset"
echo "3. Check email for reset link"
echo "4. Click link and set new password"
echo "5. Should redirect to home page, logged in"
echo ""
echo "🎯 Expected: No more 500 errors, smooth password reset!"
