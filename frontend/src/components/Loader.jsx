import { motion } from "framer-motion";

export default function Loader({ variant = 'spinner', size = 'md', text = '' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const SpinnerLoader = () => (
    <motion.div 
      className={`rounded-full border-2 border-slate-200 border-t-slate-800 ${sizes[size]}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  const DotsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`bg-slate-800 rounded-full ${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'}`}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const PulseLoader = () => (
    <motion.div 
      className={`bg-slate-800 rounded-full ${sizes[size]}`}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    />
  );

  const BarsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={`bg-slate-800 ${size === 'sm' ? 'w-1 h-4' : size === 'lg' ? 'w-2 h-8' : 'w-1.5 h-6'}`}
          animate={{ scaleY: [1, 2, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const RingLoader = () => (
    <div className={`relative ${sizes[size]}`}>
      <motion.div 
        className="absolute inset-0 rounded-full border-2 border-slate-200"
      />
      <motion.div 
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-slate-800"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  const loaderComponents = {
    spinner: SpinnerLoader,
    dots: DotsLoader,
    pulse: PulseLoader,
    bars: BarsLoader,
    ring: RingLoader
  };

  const LoaderComponent = loaderComponents[variant] || SpinnerLoader;

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4" role="status" aria-label="Loading">
      <LoaderComponent />
      {text && (
        <motion.p 
          className="text-slate-600 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Progress bar component
export function ProgressBar({ progress = 0, className = '', showPercentage = false }) {
  return (
    <div className={`w-full bg-slate-200 rounded-full h-2 ${className}`}>
      <motion.div 
        className="bg-slate-800 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {showPercentage && (
        <div className="text-xs text-slate-600 mt-1 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}

// Loading overlay component
export function LoadingOverlay({ isLoading, children, text = 'Loading...' }) {
  if (!isLoading) return children;

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <Loader text={text} />
      </div>
    </div>
  );
} 