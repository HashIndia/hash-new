// Simple test script to check admin authentication
// Run this in the browser console on your admin panel

// Test 1: Check if we have any admin cookies
console.log('=== Admin Cookie Check ===');
console.log('All cookies:', document.cookie);
console.log('Has adminAccessToken:', document.cookie.includes('adminAccessToken'));
console.log('Has adminRefreshToken:', document.cookie.includes('adminRefreshToken'));

// Test 2: Check API connectivity
console.log('\n=== API Connectivity Test ===');
fetch('/api/debug', { 
  credentials: 'include',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Debug endpoint response:', data);
  console.log('Environment:', data.environment);
  console.log('Cookies received by server:', data.cookies);
})
.catch(error => {
  console.error('Debug endpoint error:', error);
});

// Test 3: Try admin auth endpoint
console.log('\n=== Admin Auth Test ===');
fetch('/api/admin/auth/me', { 
  credentials: 'include',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Admin auth status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Admin auth response:', data);
})
.catch(error => {
  console.error('Admin auth error:', error);
});

console.log('\n=== Test Complete ===');
console.log('Check the responses above to diagnose the issue.');
