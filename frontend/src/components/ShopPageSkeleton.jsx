import { motion } from 'framer-motion';

const FilterSkeleton = () => (
  <div className="bg-white rounded-xl border border-black p-6 animate-pulse">
    <div className="bg-gray-200 h-6 rounded w-24 mb-4"></div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <div className="bg-gray-200 w-4 h-4 rounded"></div>
          <div className="bg-gray-200 h-4 rounded w-20"></div>
        </div>
      ))}
    </div>
  </div>
);

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(12)].map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-2xl shadow-sm border border-black p-4 animate-pulse overflow-hidden"
      >
        <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
        <div className="space-y-3">
          <div className="bg-gray-200 h-5 rounded w-3/4"></div>
          <div className="bg-gray-200 h-4 rounded w-1/2"></div>
          <div className="bg-gray-200 h-6 rounded w-1/3"></div>
          <div className="bg-gray-200 h-10 rounded-xl w-full"></div>
        </div>
      </motion.div>
    ))}
  </div>
);

const SearchBarSkeleton = () => (
  <div className="bg-white rounded-xl border border-black p-4 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="bg-gray-200 h-10 rounded-lg flex-1"></div>
      <div className="bg-gray-200 h-10 w-24 rounded-lg"></div>
    </div>
  </div>
);

const SortingSkeleton = () => (
  <div className="flex items-center justify-between mb-6">
    <div className="bg-gray-200 h-6 rounded w-32 animate-pulse"></div>
    <div className="flex items-center space-x-4">
      <div className="bg-gray-200 h-10 w-32 rounded-lg animate-pulse"></div>
      <div className="bg-gray-200 h-10 w-16 rounded-lg animate-pulse"></div>
    </div>
  </div>
);

export default function ShopPageSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Section Skeleton */}
      <section className="bg-hash-purple text-white py-16 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/20 h-12 md:h-16 rounded w-64 md:w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="bg-white/10 h-6 rounded w-96 mx-auto animate-pulse"></div>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters Section - Top Layout */}
      <section className="bg-white border-b border-black md:sticky md:top-16 md:z-40 md:backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative w-full">
              <div className="bg-gray-200 h-12 md:h-14 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Quick Filters - Horizontal Layout */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              <div className="bg-gray-200 h-10 w-40 rounded-lg animate-pulse"></div>
              <div className="bg-gray-200 h-10 w-40 rounded-lg animate-pulse"></div>
              <div className="bg-gray-200 h-10 w-40 rounded-lg animate-pulse"></div>
              <div className="bg-gray-200 h-10 w-32 rounded-lg animate-pulse"></div>
              <div className="bg-gray-200 h-10 w-24 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          {/* Results and View Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="bg-gray-200 h-6 rounded w-32 animate-pulse"></div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 h-10 w-32 rounded-lg animate-pulse"></div>
              <div className="bg-gray-200 h-10 w-16 rounded-lg animate-pulse"></div>
            </div>
          </div>
          
          <ProductGridSkeleton />
          
          {/* Pagination Skeleton */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 w-10 h-10 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
