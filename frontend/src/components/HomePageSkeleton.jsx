import { motion } from 'framer-motion';

const ProductCardSkeleton = () => (
  <div className="bg-card rounded-2xl shadow-sm border border-border p-4 animate-pulse overflow-hidden">
    <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
    <div className="space-y-3">
      <div className="bg-gray-200 h-5 rounded w-3/4"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
      <div className="bg-gray-200 h-6 rounded w-1/3"></div>
      <div className="bg-gray-200 h-10 rounded-xl w-full"></div>
    </div>
  </div>
);

const HeroSkeleton = () => (
  <section className="relative bg-background border-b border-border overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 pt-4 sm:pt-8 pb-8 sm:pb-16 relative z-10">
      <div className="lg:hidden">
        {/* Mobile layout skeleton */}
        <div className="text-center mb-8 animate-pulse">
          <div className="bg-gray-200 h-8 rounded-full w-48 mx-auto mb-6"></div>
          <div className="bg-gray-200 h-12 rounded w-3/4 mx-auto mb-4"></div>
          <div className="bg-gray-200 h-6 rounded w-2/3 mx-auto mb-8"></div>
          <div className="bg-gray-200 h-12 rounded-lg w-40 mx-auto"></div>
        </div>
      </div>
      
      {/* Desktop layout skeleton */}
      <div className="hidden lg:block">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[60vh]">
          <div className="space-y-6 animate-pulse">
            <div className="bg-gray-200 h-8 rounded-full w-56"></div>
            <div className="bg-gray-200 h-16 rounded w-full"></div>
            <div className="bg-gray-200 h-6 rounded w-4/5"></div>
            <div className="bg-gray-200 h-12 rounded-lg w-40"></div>
          </div>
          <div className="flex justify-center">
            <div className="bg-gray-200 w-80 h-80 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function HomePageSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section Skeleton */}
      <HeroSkeleton />

      {/* Featured Products Section Skeleton */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="bg-gray-200 h-12 rounded w-64 mx-auto mb-6 animate-pulse"></div>
            <div className="bg-gray-200 h-6 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCardSkeleton />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="text-center animate-pulse">
                <div className="bg-gray-200 w-16 h-16 rounded-full mx-auto mb-4"></div>
                <div className="bg-gray-200 h-6 rounded w-32 mx-auto mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-48 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
