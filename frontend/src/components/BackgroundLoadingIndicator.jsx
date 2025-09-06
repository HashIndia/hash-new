import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';

export default function BackgroundLoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProcesses, setLoadingProcesses] = useState(new Set());

  useEffect(() => {
    // Listen for background loading events
    const handleLoadingStart = (event) => {
      const { process } = event.detail;
      setLoadingProcesses(prev => new Set([...prev, process]));
      setIsLoading(true);
    };

    const handleLoadingEnd = (event) => {
      const { process } = event.detail;
      setLoadingProcesses(prev => {
        const newSet = new Set(prev);
        newSet.delete(process);
        return newSet;
      });
    };

    // Custom events for background loading
    window.addEventListener('background-loading-start', handleLoadingStart);
    window.addEventListener('background-loading-end', handleLoadingEnd);

    return () => {
      window.removeEventListener('background-loading-start', handleLoadingStart);
      window.removeEventListener('background-loading-end', handleLoadingEnd);
    };
  }, []);

  useEffect(() => {
    setIsLoading(loadingProcesses.size > 0);
  }, [loadingProcesses]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200"
        >
          <div className="flex items-center gap-2 px-3 py-1">
            <Loader className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-xs text-gray-600">Loading...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Helper functions to trigger the background loading events
export const startBackgroundLoading = (process) => {
  window.dispatchEvent(new CustomEvent('background-loading-start', { 
    detail: { process } 
  }));
};

export const endBackgroundLoading = (process) => {
  window.dispatchEvent(new CustomEvent('background-loading-end', { 
    detail: { process } 
  }));
};
