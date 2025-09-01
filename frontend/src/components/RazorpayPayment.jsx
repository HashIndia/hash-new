import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const RazorpayPayment = ({ order, onPaymentSuccess, onPaymentFailure }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async () => {
    try {
      setIsProcessing(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        return;
      }

      // Create payment order
      const response = await api.post('/payments/create-order', {
        orderId: order._id,
        amount: order.totalAmount
      });

      const { razorpayOrderId, amount, currency, key } = response.data;

      // Razorpay options
      const options = {
        key: key, // Your Razorpay key
        amount: amount, // Amount in paise
        currency: currency,
        name: 'Hash Store',
        description: `Order #${order.orderNumber}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verificationResponse = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationResponse.data.verified) {
              toast.success('Payment successful!');
              onPaymentSuccess && onPaymentSuccess(verificationResponse.data);
            } else {
              toast.error('Payment verification failed');
              onPaymentFailure && onPaymentFailure('Verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
            onPaymentFailure && onPaymentFailure(error);
          }
        },
        prefill: {
          name: order.shippingAddress.name,
          email: order.user?.email || '',
          contact: order.shippingAddress.phone
        },
        notes: {
          order_id: order._id,
          order_number: order.orderNumber
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
      onPaymentFailure && onPaymentFailure(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Order Number:</span>
            <span className="font-medium">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹{order.shippingCost}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>₹{order.taxAmount}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <button
          onClick={initiatePayment}
          disabled={isProcessing}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Pay with Razorpay'
          )}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Secure payments powered by Razorpay
          </p>
          <div className="flex justify-center items-center mt-2 space-x-4">
            <span className="text-xs text-gray-500">Accepted:</span>
            <span className="text-xs text-gray-500">Cards • UPI • Wallets • Net Banking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
