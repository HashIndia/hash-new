import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function CartPageSkeleton() {
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
          <div className="h-8 md:h-12 bg-gray-300 rounded-lg w-64 mx-auto animate-pulse shadow-sm"></div>
        </motion.div>

        <motion.div 
          className="grid gap-6 lg:grid-cols-3 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Cart Items Skeleton */}
          <motion.div className="lg:col-span-2 space-y-4" variants={itemVariants}>
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border"
              >
                <div className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                    {/* Product Image Skeleton */}
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-xl animate-pulse shadow-sm"></div>
                    </div>

                    {/* Product Details Skeleton */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                        {/* Product Name */}
                        <div className="h-5 md:h-6 bg-gray-300 rounded w-32 md:w-48 animate-pulse mx-auto sm:mx-0 shadow-sm"></div>
                        {/* Remove Button */}
                        <div className="w-6 h-6 bg-red-200 rounded-full animate-pulse mx-auto sm:mx-0 shadow-sm"></div>
                      </div>
                      
                      {/* Description */}
                      <div className="space-y-2 mb-3 md:mb-4">
                        <div className="h-3 bg-gray-200 rounded w-full animate-pulse shadow-sm"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse shadow-sm"></div>
                      </div>
                        
                      <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mb-3 md:mb-4">
                        {/* Quantity Controls Skeleton */}
                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                          <div className="px-2 md:px-3 py-1 bg-gray-200 w-8 h-8 animate-pulse"></div>
                          <div className="px-3 md:px-4 py-1 w-12 h-8 bg-gray-300 animate-pulse flex items-center justify-center">
                            <div className="w-4 h-4 bg-gray-400 rounded animate-pulse"></div>
                          </div>
                          <div className="px-2 md:px-3 py-1 bg-gray-200 w-8 h-8 animate-pulse"></div>
                        </div>

                        {/* Size & Color Skeleton */}
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <div className="px-2 md:px-3 py-1 bg-blue-100 rounded-lg w-16 h-6 animate-pulse shadow-sm"></div>
                          <div className="px-2 md:px-3 py-1 bg-green-100 rounded-lg w-20 h-6 animate-pulse shadow-sm"></div>
                        </div>
                      </div>

                      {/* Price Skeleton */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <div className="h-6 md:h-8 bg-purple-200 rounded w-20 animate-pulse mx-auto sm:mx-0 shadow-sm"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse mx-auto sm:mx-0 shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Order Summary Skeleton */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card shadow-lg rounded-2xl overflow-hidden sticky top-4 border border-border">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600">
                <CardTitle className="text-xl font-space">
                  <div className="h-6 bg-white/30 rounded w-32 animate-pulse shadow-sm"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Summary Lines */}
                {[1, 2, 3].map((index) => (
                  <div key={index} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse shadow-sm"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse shadow-sm"></div>
                  </div>
                ))}
                
                <hr className="border-gray-200" />
                
                {/* Total */}
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-300 rounded w-16 animate-pulse shadow-sm"></div>
                  <div className="h-6 bg-gray-300 rounded w-20 animate-pulse shadow-sm"></div>
                </div>
                
                <div className="space-y-3 pt-4">
                  {/* Checkout Button Skeleton */}
                  <div className="w-full h-12 bg-purple-300 rounded-xl animate-pulse shadow-md"></div>
                  
                  {/* Clear Cart Button Skeleton */}
                  <div className="w-full h-12 bg-gray-200 rounded-xl animate-pulse shadow-md"></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
