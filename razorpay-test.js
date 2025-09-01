// Test script for Razorpay integration
// Run this in the browser console or as a Node.js script

// Test 1: Check if Razorpay credentials are loaded
console.log('=== Razorpay Integration Test ===');

// Test payment order creation
const testPaymentOrder = async () => {
  try {
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_jwt_token_here' // Replace with actual token
      },
      credentials: 'include',
      body: JSON.stringify({
        orderId: 'test_order_id', // Replace with actual order ID
        amount: 100 // Test amount
      })
    });

    const data = await response.json();
    console.log('Payment Order Creation Test:', data);
    
    if (data.status === 'success') {
      console.log('✅ Payment order created successfully');
      return data.data;
    } else {
      console.log('❌ Payment order creation failed');
      return null;
    }
  } catch (error) {
    console.error('Payment order test error:', error);
    return null;
  }
};

// Test payment verification (mock data)
const testPaymentVerification = async () => {
  try {
    const mockVerificationData = {
      razorpay_order_id: 'order_test123',
      razorpay_payment_id: 'pay_test123',
      razorpay_signature: 'test_signature'
    };

    const response = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_jwt_token_here' // Replace with actual token
      },
      credentials: 'include',
      body: JSON.stringify(mockVerificationData)
    });

    const data = await response.json();
    console.log('Payment Verification Test:', data);
    
    if (data.status === 'success') {
      console.log('✅ Payment verification endpoint working');
    } else {
      console.log('❌ Payment verification failed');
    }
  } catch (error) {
    console.error('Payment verification test error:', error);
  }
};

// Test webhook endpoint
const testWebhook = async () => {
  try {
    const mockWebhookData = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            order_id: 'order_test123',
            payment_id: 'pay_test123',
            status: 'captured',
            method: 'card'
          }
        }
      }
    };

    const response = await fetch('/api/payments/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': 'test_signature'
      },
      body: JSON.stringify(mockWebhookData)
    });

    const data = await response.json();
    console.log('Webhook Test:', data);
    
    if (data.status === 'success') {
      console.log('✅ Webhook endpoint working');
    } else {
      console.log('❌ Webhook test failed');
    }
  } catch (error) {
    console.error('Webhook test error:', error);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('Starting Razorpay integration tests...\n');
  
  console.log('1. Testing Payment Order Creation...');
  await testPaymentOrder();
  
  console.log('\n2. Testing Payment Verification...');
  await testPaymentVerification();
  
  console.log('\n3. Testing Webhook...');
  await testWebhook();
  
  console.log('\n=== Tests Complete ===');
  console.log('Note: Some tests may fail due to authentication or test data.');
  console.log('Replace test values with actual order IDs and tokens for full testing.');
};

// Uncomment to run tests
// runAllTests();

console.log('Razorpay test script loaded. Run runAllTests() to execute tests.');
