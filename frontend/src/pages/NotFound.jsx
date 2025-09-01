import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--hash-purple))_0%,transparent_50%),radial-gradient(circle_at_75%_75%,hsl(var(--hash-blue))_0%,transparent_50%)] opacity-5"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          {/* 404 with HASH styling */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-bold font-space mb-4">
              <span className="hash-text-gradient">4</span>
              <span className="text-hash-purple">0</span>
              <span className="hash-text-gradient">4</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-hash-purple via-hash-blue to-hash-pink mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-space">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild className="bg-gradient-to-r from-hash-purple via-hash-blue to-hash-pink hover:shadow-lg hover:shadow-hash-purple/25 transition-all duration-300 hover:scale-105 font-semibold font-space px-8 py-3">
              <a href="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Go Home
              </a>
            </Button>
            
            <Button asChild variant="outline" className="border-hash-purple/30 hover:border-hash-purple hover:bg-hash-purple/10 hover:text-hash-purple transition-all duration-300 hover:scale-105 font-semibold font-space px-8 py-3">
              <a href="/shop" className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Browse Shop
              </a>
            </Button>
          </motion.div>

          {/* Fun animation element */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="mt-12 mx-auto w-16 h-16 rounded-2xl flex items-center justify-center opacity-20 overflow-hidden"
          >
            <img 
              src="/hash-logo.jpg" 
              alt="Hash Logo" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 