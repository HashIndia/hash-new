#!/bin/bash

# Performance Diagnostics Script for HASH Website
echo "🔍 HASH Website Performance Diagnostics"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the frontend directory"
    exit 1
fi

echo ""
echo "1. 📊 Bundle Analysis"
echo "   Run: npm run build && npm run analyze"
echo "   This will show which packages are taking up the most space"

echo ""
echo "2. 🌐 Network Analysis"
echo "   Open browser DevTools (F12) → Network tab"
echo "   - Look for requests taking > 2-3 seconds"
echo "   - Check if API calls are timing out"
echo "   - Identify large image/asset downloads"

echo ""
echo "3. 🔧 Quick Fixes Applied:"
echo "   ✅ Added 10-second timeout to API requests"
echo "   ✅ Made product initialization non-blocking"
echo "   ✅ Added progress indicators to loading screen"
echo "   ✅ Optimized database queries to load only essential fields"
echo "   ✅ Added performance monitoring"

echo ""
echo "4. 🚀 Performance Optimizations Implemented:"
echo "   ✅ Parallel API calls instead of sequential"
echo "   ✅ Early timeout (8 seconds) with fallback"
echo "   ✅ Skip option for users if loading takes too long"
echo "   ✅ Reduced API response payload size"
echo "   ✅ Added proper error handling"

echo ""
echo "5. 📋 Manual Testing Checklist:"
echo "   □ Test on different network speeds (3G, WiFi)"
echo "   □ Test on different devices (mobile, desktop)"
echo "   □ Test with browser cache disabled"
echo "   □ Check for console errors"
echo "   □ Monitor API response times in Network tab"

echo ""
echo "6. 🎯 Expected Results:"
echo "   - Loading time should now be < 5 seconds"
echo "   - Users can skip waiting after 60% progress"
echo "   - Better visual feedback during loading"
echo "   - Graceful degradation if APIs are slow"

echo ""
echo "7. 📡 API Health Check:"
echo "   Production API: https://hash-c170.onrender.com/api/health"
echo "   Local API: http://localhost:50001/api/health"

# Check API health if curl is available
if command -v curl &> /dev/null; then
    echo ""
    echo "🔍 Checking API health..."
    
    # Check production API
    echo "Production API:"
    curl -s -w "Response time: %{time_total}s\n" "https://hash-c170.onrender.com/api/health" | head -n 1
    
    # Check local API if running
    echo "Local API:"
    curl -s -w "Response time: %{time_total}s\n" "http://localhost:50001/api/health" 2>/dev/null | head -n 1 || echo "Not running or not accessible"
fi

echo ""
echo "8. 🎨 Next Steps if Still Slow:"
echo "   - Implement service worker for caching"
echo "   - Add image lazy loading"
echo "   - Consider server-side rendering (SSR)"
echo "   - Implement Progressive Web App (PWA) features"
echo "   - Add CDN for static assets"

echo ""
echo "✨ Performance improvements have been applied!"
echo "   Try refreshing the website to see the changes."
