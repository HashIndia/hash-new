import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { paymentsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  const orderId = searchParams.get('order_id');
  const codOrderData = location.state; // For COD orders passed via navigation state

  useEffect(() => {
    if (codOrderData) {
      // Handle COD order
      setIsVerifying(false);
      setPaymentStatus('SUCCESS');
      setOrderDetails({
        orderId: codOrderData.orderId,
        orderNumber: codOrderData.orderNumber,
        paymentMethod: 'cod'
      });
      toast.success('Order placed successfully! You will pay on delivery.');
    } else if (orderId) {
      // Handle online payment verification
      verifyPayment();
    } else {
      setIsVerifying(false);
      setPaymentStatus('failed');
    }
  }, [orderId, codOrderData]);

  const verifyPayment = async () => {
    try {
      const response = await paymentsAPI.verifyPayment(orderId);
      setPaymentStatus(response.data.paymentStatus);
      setOrderDetails(response.data.order);
      
      if (response.data.paymentStatus === 'SUCCESS') {
        toast.success('Payment successful! Your order has been confirmed.');
      } else {
        toast.error('Payment verification failed.');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      setPaymentStatus('FAILED');
      toast.error('Failed to verify payment status.');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = () => {
    if (isVerifying) return <Loader className="w-16 h-16 animate-spin text-blue-500" />;
    if (paymentStatus === 'SUCCESS') return <CheckCircle className="w-16 h-16 text-green-500" />;
    return <XCircle className="w-16 h-16 text-red-500" />;
  };

  const getStatusMessage = () => {
    if (isVerifying) return 'Verifying your payment...';
    if (paymentStatus === 'SUCCESS') {
      return orderDetails?.paymentMethod === 'cod' ? 'Order Placed Successfully!' : 'Payment Successful!';
    }
    return 'Payment Failed';
  };

  const getStatusDescription = () => {
    if (isVerifying) return 'Please wait while we confirm your payment.';
    if (paymentStatus === 'SUCCESS') {
      if (orderDetails?.paymentMethod === 'cod') {
        return 'Your order has been confirmed. You will pay when the order is delivered.';
      }
      return 'Your order has been confirmed and will be processed shortly.';
    }
    return 'Your payment could not be processed. Please try again or contact support.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-2xl font-bold">
              {getStatusMessage()}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">
              {getStatusDescription()}
            </p>

            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h4 className="font-semibold mb-2">Order Details:</h4>
                <p className="text-sm text-gray-600">
                  Order ID: {orderDetails.orderId || orderDetails._id}
                </p>
                {orderDetails.orderNumber && (
                  <p className="text-sm text-gray-600">
                    Order Number: {orderDetails.orderNumber}
                  </p>
                )}
                {orderDetails.totalAmount && (
                  <p className="text-sm text-gray-600">
                    Total Amount: ₹{orderDetails.totalAmount}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Payment Method: {orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
                {orderDetails.status && (
                  <p className="text-sm text-gray-600">
                    Status: {orderDetails.status}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              {paymentStatus === 'SUCCESS' && (
                <Button
                  onClick={() => navigate('/orders')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  View My Orders
                </Button>
              )}
              
              {paymentStatus === 'FAILED' && (
                <Button
                  onClick={() => navigate('/cart')}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Try Again
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
