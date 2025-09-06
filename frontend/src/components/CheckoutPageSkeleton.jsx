import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function CheckoutPageSkeleton() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Title Skeleton */}
        <motion.div
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-8 md:h-12 bg-gray-300 rounded-lg w-48 mx-auto animate-pulse shadow-sm"></div>
        </motion.div>

        <motion.div 
          className="grid gap-6 lg:grid-cols-3 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Checkout Form */}
          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            
            {/* Delivery Address Section */}
            <motion.div variants={itemVariants}>
              <Card className="border border-border shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-purple-100">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-purple-300 rounded animate-pulse shadow-sm"></div>
                    <div className="h-6 bg-gray-300 rounded w-32 animate-pulse shadow-sm"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Address Cards */}
                  {[1, 2].map((index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-xl shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-gray-300 rounded w-24 animate-pulse shadow-sm"></div>
                          <div className="h-4 bg-gray-200 rounded w-full animate-pulse shadow-sm"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse shadow-sm"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse shadow-sm"></div>
                        </div>
                        <div className="w-4 h-4 bg-purple-300 rounded-full animate-pulse shadow-sm"></div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Address Button */}
                  <div className="w-full h-10 bg-purple-200 rounded-lg animate-pulse shadow-md"></div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method Section */}
            <motion.div variants={itemVariants}>
              <Card className="border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-blue-100">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-300 rounded animate-pulse shadow-sm"></div>
                    <div className="h-6 bg-gray-300 rounded w-40 animate-pulse shadow-sm"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Payment Options */}
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl shadow-sm">
                        <div className="w-4 h-4 bg-blue-300 rounded-full animate-pulse shadow-sm"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-300 rounded w-32 animate-pulse mb-1 shadow-sm"></div>
                          <div className="h-3 bg-gray-200 rounded w-48 animate-pulse shadow-sm"></div>
                        </div>
                        <div className="w-8 h-8 bg-gray-300 rounded animate-pulse shadow-sm"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Items Section */}
            <motion.div variants={itemVariants}>
              <Card className="border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-green-100">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-300 rounded animate-pulse shadow-sm"></div>
                    <div className="h-6 bg-gray-300 rounded w-32 animate-pulse shadow-sm"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[1, 2].map((index) => (
                      <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-xl shadow-sm">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg animate-pulse flex-shrink-0 shadow-sm"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse shadow-sm"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse shadow-sm"></div>
                          <div className="flex justify-between items-center">
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse shadow-sm"></div>
                            <div className="h-5 bg-purple-200 rounded w-20 animate-pulse shadow-sm"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Order Summary */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card shadow-lg rounded-2xl overflow-hidden sticky top-4 border border-border">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600">
                <CardTitle className="text-xl font-space">
                  <div className="h-6 bg-white/30 rounded w-32 animate-pulse shadow-sm"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Summary Lines */}
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse shadow-sm"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse shadow-sm"></div>
                  </div>
                ))}
                
                <hr className="border-gray-200" />
                
                {/* Total */}
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-300 rounded w-16 animate-pulse shadow-sm"></div>
                  <div className="h-6 bg-gray-300 rounded w-24 animate-pulse shadow-sm"></div>
                </div>
                
                <div className="space-y-3 pt-4">
                  {/* Place Order Button Skeleton */}
                  <div className="w-full h-12 bg-purple-300 rounded-xl animate-pulse shadow-md"></div>
                  
                  {/* Security Notice */}
                  <div className="p-3 bg-green-100 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-300 rounded animate-pulse shadow-sm"></div>
                      <div className="h-3 bg-green-200 rounded w-32 animate-pulse shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
