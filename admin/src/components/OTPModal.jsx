import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const OTPModal = ({ isOpen, onClose, order, onGenerateOTP, onVerifyOTP }) => {
  const [otp, setOtp] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleGenerateOTP = async () => {
    setIsGenerating(true);
    try {
      await onGenerateOTP(order.id);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsVerifying(true);
    try {
      const success = await onVerifyOTP(order.id, otp);
      if (success) {
        setOtp('');
        onClose();
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setOtp('');
    onClose();
  };

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Delivery - OTP Verification
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900">Order: {order.id}</h4>
                <p className="text-sm text-gray-600">Customer: {order.customerName}</p>
                <p className="text-sm text-gray-600">Phone: {order.customerPhone}</p>
              </div>

              {order.otpVerified ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-600 mb-2">Order Delivered!</h3>
                  <p className="text-gray-600">This order has been successfully delivered and verified.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {!order.otp ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        Generate an OTP to send to the customer for delivery verification.
                      </p>
                      <Button
                        onClick={handleGenerateOTP}
                        disabled={isGenerating}
                        className="w-full"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isGenerating ? 'Generating...' : 'Generate & Send OTP'}
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-blue-800">
                          <strong>OTP sent to customer:</strong> {order.otp}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Customer should provide this OTP upon delivery
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Enter OTP from Customer
                        </label>
                        <Input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                        />
                        <Button
                          onClick={handleVerifyOTP}
                          disabled={isVerifying || otp.length !== 6}
                          className="w-full"
                        >
                          {isVerifying ? 'Verifying...' : 'Verify & Mark Delivered'}
                        </Button>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Button
                          variant="outline"
                          onClick={handleGenerateOTP}
                          disabled={isGenerating}
                          className="w-full"
                        >
                          {isGenerating ? 'Generating...' : 'Regenerate OTP'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OTPModal; 