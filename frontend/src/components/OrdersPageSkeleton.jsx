import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function OrdersPageSkeleton() {
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
    <div className="min-h-screen bg-white py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Title Skeleton */}
        <motion.div
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-8 md:h-12 bg-gray-300 rounded-lg w-48 mx-auto animate-pulse shadow-md"></div>
        </motion.div>

        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Order Cards Skeleton */}
          {[1, 2, 3].map((orderIndex) => (
            <motion.div key={orderIndex} variants={itemVariants}>
              <Card className="border border-black shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-white border-b border-black">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="space-y-2">
                      {/* Order ID */}
                      <div className="h-6 bg-purple-300 rounded w-32 animate-pulse shadow-sm"></div>
                      {/* Order Date */}
                      <div className="h-4 bg-blue-200 rounded w-24 animate-pulse shadow-sm"></div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {/* Status Badge */}
                      <div className="h-6 bg-green-300 rounded-full w-20 animate-pulse shadow-sm"></div>
                      {/* Payment Status Badge */}
                      <div className="h-6 bg-yellow-300 rounded-full w-16 animate-pulse shadow-sm"></div>
                    </div>
                  </div>
                  
                  {/* Order Actions */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <div className="h-8 bg-purple-400 rounded w-24 animate-pulse shadow-sm"></div>
                    <div className="h-8 bg-gray-300 rounded w-28 animate-pulse shadow-sm"></div>
                    <div className="h-8 bg-green-400 rounded w-32 animate-pulse shadow-sm"></div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {[1, 2].map((itemIndex) => (
                      <div key={itemIndex} className="flex gap-4 p-4 bg-accent/30 rounded-xl">
                        {/* Product Image */}
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-400 rounded-lg animate-pulse flex-shrink-0 shadow-md"></div>
                        
                        <div className="flex-1 space-y-2">
                          {/* Product Name */}
                          <div className="h-5 bg-blue-300 rounded w-3/4 animate-pulse shadow-sm"></div>
                          
                          {/* Product Details */}
                          <div className="flex flex-wrap gap-2">
                            <div className="h-4 bg-pink-300 rounded w-12 animate-pulse shadow-sm"></div>
                            <div className="h-4 bg-orange-300 rounded w-16 animate-pulse shadow-sm"></div>
                          </div>
                          
                          {/* Price and Quantity */}
                          <div className="flex justify-between items-center">
                            <div className="h-4 bg-teal-300 rounded w-20 animate-pulse shadow-sm"></div>
                            <div className="h-5 bg-purple-400 rounded w-16 animate-pulse shadow-sm"></div>
                          </div>
                        </div>
                        
                        {/* Review Button */}
                        <div className="flex flex-col justify-center">
                          <div className="h-8 bg-yellow-400 rounded w-20 animate-pulse shadow-sm"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Summary */}
                  <div className="border-t border-black pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="h-3 bg-slate-400 rounded w-12 animate-pulse shadow-sm"></div>
                        <div className="h-5 bg-indigo-300 rounded w-16 animate-pulse shadow-sm"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 bg-slate-400 rounded w-16 animate-pulse shadow-sm"></div>
                        <div className="h-5 bg-indigo-300 rounded w-12 animate-pulse shadow-sm"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 bg-slate-400 rounded w-10 animate-pulse shadow-sm"></div>
                        <div className="h-5 bg-indigo-300 rounded w-14 animate-pulse shadow-sm"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 bg-slate-400 rounded w-8 animate-pulse shadow-sm"></div>
                        <div className="h-6 bg-purple-400 rounded w-20 animate-pulse shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Address */}
                  <div className="mt-6 p-4 bg-accent/20 rounded-xl">
                    <div className="h-5 bg-emerald-400 rounded w-32 animate-pulse mb-3 shadow-sm"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-stone-300 rounded w-full animate-pulse shadow-sm"></div>
                      <div className="h-4 bg-stone-300 rounded w-3/4 animate-pulse shadow-sm"></div>
                      <div className="h-4 bg-stone-300 rounded w-1/2 animate-pulse shadow-sm"></div>
                    </div>
                  </div>
                  
                  {/* Order Timeline */}
                  <div className="mt-6">
                    <div className="h-5 bg-rose-400 rounded w-28 animate-pulse mb-4 shadow-sm"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((timelineIndex) => (
                        <div key={timelineIndex} className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-sm"></div>
                          <div className="flex-1 flex justify-between items-center">
                            <div className="h-4 bg-cyan-300 rounded w-32 animate-pulse shadow-sm"></div>
                            <div className="h-3 bg-amber-300 rounded w-24 animate-pulse shadow-sm"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
