import { motion } from "framer-motion";

export default function Skeleton({ className = '', variant = 'default', children, animate = true }) {
  const variants = {
    default: "bg-gray-200 rounded",
    card: "bg-gray-200 rounded-2xl",
    text: "bg-gray-200 rounded-lg h-4",
    title: "bg-gray-200 rounded-lg h-6",
    button: "bg-gray-200 rounded-xl h-12",
    avatar: "bg-gray-200 rounded-full",
    image: "bg-gray-200 rounded-2xl aspect-square",
    circle: "bg-gray-200 rounded-full",
    pill: "bg-gray-200 rounded-full h-8"
  };

  const shimmerVariants = {
    loading: {
      x: '-100%',
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  if (children) {
    return (
      <div className={`relative overflow-hidden ${animate ? 'animate-pulse' : ''}`}>
        {children}
        {animate && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            variants={shimmerVariants}
            animate="loading"
            style={{ transform: 'translateX(-100%)' }}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${variants[variant]} ${className}`} aria-busy="true" aria-label="Loading placeholder">
      {animate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          variants={shimmerVariants}
          animate="loading"
          style={{ transform: 'translateX(-100%)' }}
        />
      )}
    </div>
  );
}

// Enhanced pre-built skeleton components
export function ProductCardSkeleton() {
  return (
    <motion.div 
      className="card-base p-6 space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Skeleton variant="image" className="w-full h-64" />
      <div className="space-y-4">
        <Skeleton variant="title" className="w-3/4" />
        <div className="flex items-center gap-3">
          <Skeleton variant="text" className="w-20 h-8" />
          <Skeleton variant="text" className="w-16 h-6" />
          <Skeleton variant="pill" className="w-12" />
        </div>
        <Skeleton variant="text" className="w-full h-5" />
        <Skeleton variant="text" className="w-2/3 h-5" />
        <div className="flex gap-2 mt-4">
          <Skeleton variant="pill" className="w-8" />
          <Skeleton variant="pill" className="w-8" />
          <Skeleton variant="pill" className="w-8" />
        </div>
      </div>
      <Skeleton variant="button" className="w-full" />
    </motion.div>
  );
}

export function OrderSkeleton() {
  return (
    <motion.div 
      className="card-base p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <Skeleton variant="title" className="w-40" />
          <Skeleton variant="text" className="w-32" />
          <Skeleton variant="pill" className="w-20" />
        </div>
        <Skeleton variant="text" className="w-24 h-8" />
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton variant="image" className="w-16 h-16" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="w-3/4 h-5" />
              <Skeleton variant="text" className="w-1/2 h-4" />
            </div>
            <Skeleton variant="text" className="w-16 h-6" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton variant="image" className="w-16 h-16" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="w-2/3 h-5" />
              <Skeleton variant="text" className="w-1/3 h-4" />
            </div>
            <Skeleton variant="text" className="w-16 h-6" />
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 flex gap-3">
        <Skeleton variant="button" className="w-32 h-10" />
        <Skeleton variant="button" className="w-28 h-10" />
      </div>
    </motion.div>
  );
}

export function ProfileSkeleton() {
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Profile Header */}
      <div className="card-base p-8">
        <div className="flex items-center gap-6">
          <Skeleton variant="avatar" className="w-24 h-24" />
          <div className="space-y-3 flex-1">
            <Skeleton variant="title" className="w-48" />
            <Skeleton variant="text" className="w-64" />
            <div className="flex gap-2">
              <Skeleton variant="pill" className="w-16" />
              <Skeleton variant="pill" className="w-20" />
            </div>
          </div>
          <Skeleton variant="button" className="w-32" />
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-base p-8 space-y-6">
          <Skeleton variant="title" className="w-40" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton variant="text" className="w-24 h-4" />
                <Skeleton variant="text" className="w-full h-10" />
              </div>
            ))}
          </div>
          <Skeleton variant="button" className="w-full" />
        </div>

        <div className="card-base p-8 space-y-6">
          <Skeleton variant="title" className="w-32" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circle" className="w-8 h-8" />
                  <Skeleton variant="text" className="w-32 h-5" />
                </div>
                <Skeleton variant="circle" className="w-6 h-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardSkeleton() {
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div 
            key={i}
            className="card-base p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-3 flex-1">
                <Skeleton variant="text" className="w-16 h-4" />
                <Skeleton variant="title" className="w-20" />
                <Skeleton variant="text" className="w-12 h-4" />
              </div>
              <Skeleton variant="circle" className="w-12 h-12" />
            </div>
            <Skeleton variant="text" className="w-full h-3" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 card-base p-8 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton variant="title" className="w-32" />
            <Skeleton variant="button" className="w-24 h-8" />
          </div>
          <Skeleton variant="card" className="w-full h-64" />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card-base p-6 space-y-4">
            <Skeleton variant="title" className="w-24" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <Skeleton variant="avatar" className="w-10 h-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-full h-4" />
                  <Skeleton variant="text" className="w-2/3 h-3" />
                </div>
              </div>
            ))}
          </div>

          <div className="card-base p-6 space-y-4">
            <Skeleton variant="title" className="w-28" />
            <Skeleton variant="card" className="w-full h-32" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <motion.div 
      className="card-base overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Table Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, i) => (
            <Skeleton key={i} variant="text" className="w-24 h-5" />
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-200">
        {[...Array(rows)].map((_, rowIndex) => (
          <motion.div 
            key={rowIndex}
            className="p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rowIndex * 0.1, duration: 0.3 }}
          >
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  variant="text" 
                  className={`${colIndex === 0 ? 'w-32' : 'w-20'} h-5`} 
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function NotificationSkeleton() {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {[...Array(3)].map((_, i) => (
        <motion.div 
          key={i}
          className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        >
          <Skeleton variant="circle" className="w-10 h-10 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4 h-5" />
            <Skeleton variant="text" className="w-full h-4" />
            <Skeleton variant="text" className="w-1/3 h-3" />
          </div>
          <Skeleton variant="circle" className="w-6 h-6" />
        </motion.div>
      ))}
    </motion.div>
  );
} 
