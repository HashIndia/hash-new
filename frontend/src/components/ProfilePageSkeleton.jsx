import { motion } from 'framer-motion';

const ProfileHeaderSkeleton = () => (
  <div className="bg-card rounded-2xl border border-border p-8 animate-pulse">
    <div className="flex items-start space-x-6">
      <div className="bg-gray-200 w-24 h-24 rounded-full"></div>
      <div className="flex-1 space-y-4">
        <div className="bg-gray-200 h-8 rounded w-48"></div>
        <div className="bg-gray-200 h-5 rounded w-64"></div>
        <div className="flex space-x-4">
          <div className="bg-gray-200 h-10 w-24 rounded-lg"></div>
          <div className="bg-gray-200 h-10 w-32 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

const StatsCardSkeleton = () => (
  <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="bg-gray-200 h-6 w-20 rounded"></div>
      <div className="bg-gray-200 w-8 h-8 rounded-lg"></div>
    </div>
    <div className="bg-gray-200 h-8 w-16 rounded mb-2"></div>
    <div className="bg-gray-200 h-4 w-24 rounded"></div>
  </div>
);

const OrderCardSkeleton = () => (
  <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <div className="bg-gray-200 h-5 w-32 rounded"></div>
        <div className="bg-gray-200 h-4 w-24 rounded"></div>
      </div>
      <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
    </div>
    
    <div className="space-y-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="bg-gray-200 w-16 h-16 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
          </div>
          <div className="bg-gray-200 h-6 w-16 rounded"></div>
        </div>
      ))}
    </div>
    
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
      <div className="bg-gray-200 h-5 w-24 rounded"></div>
      <div className="bg-gray-200 h-9 w-20 rounded-lg"></div>
    </div>
  </div>
);

const AddressCardSkeleton = () => (
  <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <div className="bg-gray-200 h-5 w-20 rounded"></div>
        <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
      </div>
      <div className="bg-gray-200 w-8 h-8 rounded-lg"></div>
    </div>
    
    <div className="space-y-2">
      <div className="bg-gray-200 h-4 w-full rounded"></div>
      <div className="bg-gray-200 h-4 w-4/5 rounded"></div>
      <div className="bg-gray-200 h-4 w-3/5 rounded"></div>
    </div>
  </div>
);

const SidebarSkeleton = () => (
  <div className="space-y-2">
    {['Profile', 'Orders', 'Addresses', 'Wishlist', 'Settings'].map((item, i) => (
      <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-200 w-5 h-5 rounded"></div>
          <div className="bg-gray-200 h-4 w-20 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const WishlistGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="bg-card rounded-2xl shadow-sm border border-border p-4 animate-pulse"
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
);

export default function ProfilePageSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <section className="bg-background border-b border-border py-8">
        <div className="container mx-auto px-6">
          <div className="bg-gray-200 h-10 rounded w-32 animate-pulse mb-6"></div>
          <ProfileHeaderSkeleton />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SidebarSkeleton />
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-6 border-b border-border">
                {['Overview', 'Orders', 'Wishlist', 'Addresses'].map((tab, i) => (
                  <div key={i} className="bg-gray-200 h-6 w-20 rounded animate-pulse mb-4"></div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="space-y-6">
                <div className="bg-gray-200 h-8 rounded w-40 animate-pulse"></div>
                <div className="space-y-4">
                  <OrderCardSkeleton />
                  <OrderCardSkeleton />
                  <OrderCardSkeleton />
                </div>
              </div>

              {/* Addresses Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="bg-gray-200 h-8 rounded w-32 animate-pulse"></div>
                  <div className="bg-gray-200 h-10 w-28 rounded-lg animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AddressCardSkeleton />
                  <AddressCardSkeleton />
                </div>
              </div>

              {/* Wishlist Section */}
              <div className="space-y-6">
                <div className="bg-gray-200 h-8 rounded w-36 animate-pulse"></div>
                <WishlistGridSkeleton />
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
