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
      className="min-h-screen bg-background py-8"
    >
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-8">
          <div className="bg-gray-200 h-10 rounded w-48 mx-auto animate-pulse"></div>
        </div>

        {/* Profile Form (if shown) - placeholder */}
        <div className="mb-6">
          <div className="bg-card rounded-xl border border-border p-6 animate-pulse">
            <div className="bg-gray-200 h-8 rounded w-32 mb-4"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-12 rounded"></div>
              <div className="bg-gray-200 h-12 rounded"></div>
              <div className="flex space-x-4">
                <div className="bg-gray-200 h-10 w-24 rounded-lg"></div>
                <div className="bg-gray-200 h-10 w-24 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Grid Layout matching actual Profile page */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* My Details Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-card border border-border shadow-sm rounded-xl animate-pulse">
              <div className="bg-card border-b border-border p-4">
                <div className="bg-gray-200 h-6 rounded w-24"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 h-4 w-12 rounded"></div>
                  <div className="bg-gray-200 h-4 w-32 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 h-4 w-12 rounded"></div>
                  <div className="bg-gray-200 h-4 w-40 rounded"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 h-4 w-12 rounded"></div>
                  <div className="bg-gray-200 h-4 w-28 rounded"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* My Addresses Column - spans 2 columns */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card border border-border shadow-sm rounded-xl animate-pulse">
              <div className="flex flex-row items-center justify-between bg-card border-b border-border p-4">
                <div className="bg-gray-200 h-6 rounded w-28"></div>
                <div className="bg-gray-200 h-10 w-24 rounded-lg"></div>
              </div>
              <div className="p-6">
                {/* Address Cards */}
                <div className="space-y-4">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="border border-border rounded-lg p-4 bg-muted/30">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="bg-gray-200 h-5 w-24 rounded"></div>
                          <div className="bg-gray-200 h-4 w-full rounded"></div>
                          <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                          <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="bg-gray-200 h-8 w-12 rounded"></div>
                          <div className="bg-gray-200 h-8 w-16 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Orders Section */}
        <motion.div 
          className="mt-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-card border border-border shadow-sm rounded-xl animate-pulse">
            <div className="bg-card border-b border-border p-4">
              <div className="bg-gray-200 h-6 rounded w-32"></div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <div className="bg-gray-200 h-5 w-32 rounded"></div>
                        <div className="bg-gray-200 h-4 w-24 rounded"></div>
                      </div>
                      <div className="bg-gray-200 h-6 w-20 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 h-4 w-full rounded"></div>
                      <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
