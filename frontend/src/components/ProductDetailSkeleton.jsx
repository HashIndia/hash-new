import { motion } from 'framer-motion';

const ImageGallerySkeleton = () => (
  <div className="space-y-4">
    {/* Main Image */}
    <div className="bg-gray-200 aspect-square rounded-2xl animate-pulse"></div>
    
    {/* Thumbnail Images */}
    <div className="grid grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 aspect-square rounded-lg animate-pulse"></div>
      ))}
    </div>
  </div>
);

const ProductInfoSkeleton = () => (
  <div className="space-y-6">
    {/* Title and Rating */}
    <div className="space-y-4 animate-pulse">
      <div className="bg-gray-200 h-8 rounded w-3/4"></div>
      <div className="flex items-center space-x-2">
        <div className="bg-gray-200 h-5 w-24 rounded"></div>
        <div className="bg-gray-200 h-5 w-16 rounded"></div>
      </div>
    </div>

    {/* Price */}
    <div className="space-y-2 animate-pulse">
      <div className="bg-gray-200 h-8 rounded w-32"></div>
      <div className="bg-gray-200 h-5 rounded w-24"></div>
    </div>

    {/* Description */}
    <div className="space-y-3 animate-pulse">
      <div className="bg-gray-200 h-5 rounded w-full"></div>
      <div className="bg-gray-200 h-5 rounded w-5/6"></div>
      <div className="bg-gray-200 h-5 rounded w-4/6"></div>
    </div>

    {/* Size Selector */}
    <div className="space-y-3">
      <div className="bg-gray-200 h-6 rounded w-16 animate-pulse"></div>
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-12 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>

    {/* Color Selector */}
    <div className="space-y-3">
      <div className="bg-gray-200 h-6 rounded w-20 animate-pulse"></div>
      <div className="flex space-x-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 w-8 h-8 rounded-full animate-pulse"></div>
        ))}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="space-y-4">
      <div className="bg-gray-200 h-12 rounded-xl animate-pulse"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-200 h-12 rounded-xl animate-pulse"></div>
        <div className="bg-gray-200 h-12 rounded-xl animate-pulse"></div>
      </div>
    </div>

    {/* Product Details */}
    <div className="space-y-4">
      <div className="bg-gray-200 h-6 rounded w-32 animate-pulse"></div>
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="bg-gray-200 h-4 rounded w-24 animate-pulse"></div>
            <div className="bg-gray-200 h-4 rounded w-20 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ReviewsSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-gray-200 h-8 rounded w-48 animate-pulse"></div>
    
    {/* Review Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-gray-200 h-16 rounded-xl animate-pulse"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="bg-gray-200 h-4 w-12 rounded animate-pulse"></div>
              <div className="bg-gray-200 h-3 flex-1 rounded animate-pulse"></div>
              <div className="bg-gray-200 h-4 w-8 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-200 h-32 rounded-xl animate-pulse"></div>
    </div>

    {/* Individual Reviews */}
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white border border-black rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 w-12 h-12 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 h-5 w-24 rounded animate-pulse"></div>
                <div className="bg-gray-200 h-4 w-20 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="bg-gray-200 h-5 w-16 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-200 h-4 w-full rounded animate-pulse"></div>
            <div className="bg-gray-200 h-4 w-4/5 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RelatedProductsSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-gray-200 h-8 rounded w-56 animate-pulse"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-black p-4 animate-pulse"
        >
          <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
          <div className="space-y-3">
            <div className="bg-gray-200 h-5 rounded w-3/4"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            <div className="bg-gray-200 h-6 rounded w-1/3"></div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default function ProductDetailSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Breadcrumb */}
      <section className="bg-white border-b border-neutral-200 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center space-x-2 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="bg-gray-200 h-4 w-16 rounded"></div>
                {i < 3 && <div className="bg-gray-200 h-4 w-4 rounded"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ImageGallerySkeleton />
            <ProductInfoSkeleton />
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-12 bg-white/30">
        <div className="container mx-auto px-6">
          {/* Tab Navigation */}
          <div className="flex space-x-8 mb-8">
            {['Description', 'Reviews', 'Shipping'].map((tab, i) => (
              <div key={i} className="bg-gray-200 h-6 w-20 rounded animate-pulse"></div>
            ))}
          </div>
          
          {/* Tab Content */}
          <ReviewsSkeleton />
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <RelatedProductsSkeleton />
        </div>
      </section>
    </motion.div>
  );
}
