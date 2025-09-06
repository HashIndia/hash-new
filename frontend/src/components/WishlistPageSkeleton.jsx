import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';

export default function WishlistPageSkeleton() {
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
    <div className="min-h-screen bg-background py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Title Skeleton */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-pink-300 rounded animate-pulse shadow-sm"></div>
            <div className="h-8 md:h-12 bg-gray-300 rounded-lg w-48 animate-pulse shadow-sm"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-64 mx-auto animate-pulse shadow-sm"></div>
        </motion.div>

        {/* Wishlist Stats */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-6 bg-gray-300 rounded w-40 mx-auto animate-pulse shadow-sm"></div>
        </motion.div>

        {/* Wishlist Grid */}
        <motion.div 
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="group hover:shadow-xl transition-all duration-300 border-border bg-card h-full overflow-hidden">
                <CardContent className="p-0">
                  {/* Product Image Skeleton */}
                  <div className="aspect-square relative overflow-hidden">
                    <div className="w-full h-full bg-gray-300 animate-pulse shadow-sm"></div>
                    
                    {/* Heart Icon Skeleton */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-pink-200 rounded-full animate-pulse shadow-sm"></div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0"></div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {/* Product Name */}
                    <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse shadow-sm"></div>
                    
                    {/* Product Description */}
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse shadow-sm"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse shadow-sm"></div>
                    </div>
                    
                    {/* Price and Category */}
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-purple-200 rounded w-16 animate-pulse shadow-sm"></div>
                      <div className="h-5 bg-purple-100 rounded-full w-20 animate-pulse shadow-sm"></div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="w-4 h-4 bg-yellow-200 rounded animate-pulse shadow-sm"></div>
                        ))}
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-12 animate-pulse shadow-sm"></div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {/* Add to Cart Button */}
                      <div className="flex-1 h-9 bg-purple-300 rounded-lg animate-pulse shadow-md"></div>
                      
                      {/* Remove Button */}
                      <div className="w-9 h-9 bg-red-200 rounded-lg animate-pulse shadow-md"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons Section */}
        <motion.div
          className="mt-12 text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            {/* Clear Wishlist Button */}
            <div className="w-full sm:w-auto h-10 bg-gradient-to-r from-destructive/20 to-destructive/10 rounded-lg animate-pulse flex-1"></div>
            
            {/* Continue Shopping Button */}
            <div className="w-full sm:w-auto h-10 bg-gradient-to-r from-hash-purple/20 to-hash-purple/10 rounded-lg animate-pulse flex-1"></div>
          </div>
          
          {/* Wishlist Tips */}
          <div className="max-w-2xl mx-auto">
            <div className="h-5 bg-gradient-to-r from-muted-foreground/15 to-muted-foreground/10 rounded w-64 mx-auto animate-pulse mb-3"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10 rounded w-full animate-pulse"></div>
              <div className="h-3 bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10 rounded w-5/6 mx-auto animate-pulse"></div>
            </div>
          </div>
        </motion.div>

        {/* Recommended Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center mb-8">
            <div className="h-7 bg-gradient-to-r from-foreground/15 to-foreground/10 rounded w-48 mx-auto animate-pulse mb-2"></div>
            <div className="h-4 bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-4">
                <div className="aspect-square bg-gradient-to-br from-foreground/10 to-foreground/5 rounded-lg animate-pulse mb-3"></div>
                <div className="h-4 bg-gradient-to-r from-foreground/15 to-foreground/10 rounded w-3/4 animate-pulse mb-2"></div>
                <div className="h-5 bg-gradient-to-r from-hash-purple/30 to-hash-purple/20 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
