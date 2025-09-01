import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import useProductStore from "../stores/useProductStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Star,
  Truck,
  Shield,
  RefreshCw,
  CreditCard,
  ArrowRight,
  Search,
  Heart,
  Eye,
  Zap,
  Award,
  Clock,
  Globe,
  CheckCircle,
  Plus
} from "lucide-react";

export default function Home() {
  const { products, initialize, isLoading } = useProductStore();
  const featured = products.slice(0, 6);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const stats = [
    {
      title: "Products Available",
      value: "500+",
      change: "+12.5%",
      changeType: "increase",
      icon: ShoppingCart,
      color: "bg-blue-500",
      description: "Premium collection"
    },
    {
      title: "Happy Customers",
      value: "10K+",
      change: "+8.2%",
      changeType: "increase",
      icon: Users,
      color: "bg-green-500",
      description: "Worldwide"
    },
    {
      title: "Customer Rating",
      value: "4.9/5",
      change: "+0.8%",
      changeType: "increase",
      icon: Star,
      color: "bg-purple-500",
      description: "Average rating"
    },
    {
      title: "Orders Delivered",
      value: "25K+",
      change: "+15.1%",
      changeType: "increase",
      icon: Truck,
      color: "bg-orange-500",
      description: "On time delivery"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Carefully crafted with the finest materials for lasting comfort and style.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Complimentary shipping on all orders above ₹999. Fast and reliable delivery.",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30-day hassle-free returns. Your satisfaction is our priority.",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  const categories = [
    {
      name: "T-Shirts",
      bg: "bg-blue-500",
      count: "50+ Items",
      trending: true
    },
    {
      name: "Jeans",
      bg: "bg-purple-500",
      count: "30+ Items",
      trending: false
    },
    {
      name: "Dresses",
      bg: "bg-green-500",
      count: "40+ Items",
      trending: true
    },
    {
      name: "Accessories",
      bg: "bg-yellow-500",
      count: "25+ Items",
      trending: false
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      image: "https://placehold.co/80x80/64748b/fff?text=PS",
      rating: 5,
      comment: "Amazing quality and fit! The fabrics feel premium and the designs are so trendy. Highly recommend!",
      location: "Mumbai, India",
      verified: true
    },
    {
      name: "Arjun Patel",
      image: "https://placehold.co/80x80/64748b/fff?text=AP",
      rating: 5,
      comment: "Fast delivery and excellent customer service. The clothes exceeded my expectations!",
      location: "Delhi, India",
      verified: true
    },
    {
      name: "Sneha Reddy",
      image: "https://placehold.co/80x80/64748b/fff?text=SR",
      rating: 5,
      comment: "Love the sustainable approach and modern designs. Perfect for college and casual outings.",
      location: "Bangalore, India",
      verified: true
    }
  ];

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
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-card to-background border-b border-border overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--hash-purple))_0%,transparent_50%),radial-gradient(circle_at_80%_80%,hsl(var(--hash-blue))_0%,transparent_50%),radial-gradient(circle_at_40%_40%,hsl(var(--hash-pink))_0%,transparent_50%)] opacity-10"></div>
        
        <div className="container mx-auto px-6 pt-8 pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-hash-purple/10 via-hash-blue/10 to-hash-pink/10 border border-hash-purple/20 rounded-full text-sm text-hash-purple mb-8 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Zap className="w-4 h-4 mr-2 text-hash-purple" />
                <span className="w-2 h-2 bg-hash-purple rounded-full mr-2 animate-pulse"></span>
                New Collection Available
              </motion.div>
              
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 md:mb-8 leading-tight font-space"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="text-foreground">Define Your</span>
                <motion.span 
                  className="block bg-gradient-to-r from-hash-purple via-hash-blue to-hash-pink bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  #STYLE
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-inter px-4 lg:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover premium fashion that speaks your language. Bold, modern, and uniquely you. Every piece tells a story.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start mb-8 md:mb-12 px-4 lg:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Button asChild className="bg-gradient-to-r from-hash-purple via-hash-blue to-hash-pink hover:shadow-xl hover:shadow-hash-purple/25 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105 group font-space">
                  <a href="/shop">
                    Shop Collection
                    <ArrowRight className="w-4 md:w-5 h-4 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg border-2 border-hash-purple/30 hover:border-hash-purple hover:bg-hash-purple/10 hover:text-hash-purple transition-all duration-300 hover:scale-105 font-space">
                  <a href="#featured" className="flex items-center gap-2">
                    <Eye className="w-4 md:w-5 h-4 md:h-5" />
                    Explore Trends
                  </a>
                </Button>
              </motion.div>

              <motion.div 
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground px-4 lg:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex text-hash-orange">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 md:w-4 h-3 md:h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-medium text-foreground">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3 md:w-4 h-3 md:h-4 text-hash-green" />
                  <span>10,000+ Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3 md:w-4 h-3 md:h-4 text-hash-blue" />
                  <span>Free Shipping</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Creative Hero Visual */}
            <motion.div 
              className="relative flex items-center justify-center mt-8 lg:mt-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative max-w-xs sm:max-w-sm md:max-w-md">
                {/* Main circular design with gradient border */}
                <motion.div
                  className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-hash-purple via-hash-blue to-hash-pink p-1"
                  animate={{ 
                    rotate: 360,
                  }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center relative overflow-hidden">
                    {/* Inner content */}
                    <motion.div
                      className="text-center z-10"
                      animate={{ 
                        rotate: -360,
                      }}
                      transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br from-hash-purple/10 via-hash-blue/10 to-hash-pink/10 backdrop-blur-sm border border-hash-purple/20 flex items-center justify-center mb-4">
                        <img
                          src="https://placehold.co/180x180/404040/ffffff?text=HASH+Style"
                          alt="HASH Fashion"
                          className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 object-cover rounded-xl"
                        />
                      </div>
                      <div className="text-hash-purple font-space font-bold text-base md:text-lg">#FASHION</div>
                    </motion.div>
                    
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--hash-purple))_0%,transparent_50%),radial-gradient(circle_at_70%_70%,hsl(var(--hash-blue))_0%,transparent_50%)] opacity-10"></div>
                  </div>
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div 
                  className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-hash-purple to-hash-blue rounded-2xl flex items-center justify-center shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>

                <motion.div 
                  className="absolute -top-3 -right-8 sm:-top-4 sm:-right-12 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-hash-pink to-hash-orange rounded-xl flex items-center justify-center shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  whileHover={{ scale: 1.1, rotate: -10 }}
                >
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>

                <motion.div 
                  className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-hash-green to-hash-blue rounded-2xl flex items-center justify-center shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  whileHover={{ scale: 1.1, rotate: 15 }}
                >
                  <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>

                <motion.div 
                  className="absolute -bottom-3 -left-8 sm:-bottom-4 sm:-left-12 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-hash-orange to-hash-pink rounded-xl flex items-center justify-center shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  whileHover={{ scale: 1.1, rotate: -15 }}
                >
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current" />
                </motion.div>

                {/* Orbiting dots */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 -translate-x-1/2 -translate-y-1/2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-hash-purple/30 rounded-full"
                      style={{
                        top: `${50 + 45 * Math.cos(i * Math.PI / 4)}%`,
                        left: `${50 + 45 * Math.sin(i * Math.PI / 4)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      animate={{
                        scale: [0.5, 1, 0.5],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.25,
                      }}
                    />
                  ))}
                </motion.div>

                {/* Side stats cards */}
                <motion.div 
                  className="absolute top-16 -left-20 bg-card/80 backdrop-blur-sm border border-hash-purple/20 rounded-xl p-4 shadow-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  <div className="text-2xl font-bold text-hash-purple font-space">4.9★</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </motion.div>

                <motion.div 
                  className="absolute bottom-16 -right-24 bg-card/80 backdrop-blur-sm border border-hash-blue/20 rounded-xl p-4 shadow-lg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2, duration: 0.6 }}
                >
                  <div className="text-2xl font-bold text-hash-blue font-space">10K+</div>
                  <div className="text-xs text-muted-foreground">Customers</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card border-b border-border">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-card to-background border border-border rounded-2xl hover:border-hash-purple/30 transition-all duration-300 hover:shadow-lg hover:shadow-hash-purple/10 flex flex-col justify-between items-stretch min-h-[220px] h-full">
                  <CardContent className="flex flex-col h-full p-8 md:p-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-muted-foreground">{stat.description}</span>
                        <span className="text-3xl md:text-4xl font-extrabold text-foreground font-space">{stat.value}</span>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${
                        index === 0 ? 'from-hash-purple to-hash-blue' :
                        index === 1 ? 'from-hash-blue to-hash-green' :
                        index === 2 ? 'from-hash-pink to-hash-purple' :
                        'from-hash-orange to-hash-pink'
                      } rounded-xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-hash-green" />
                      <span className="text-hash-green font-semibold">{stat.change}</span>
                      <span className="text-muted-foreground text-xs">this month</span>
                    </div>
                    <div className="mt-auto">
                      <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">{stat.title}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--hash-purple))_0%,transparent_50%),radial-gradient(circle_at_80%_20%,hsl(var(--hash-blue))_0%,transparent_50%)] opacity-5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-space">
              Shop by <span className="hash-text-gradient">#Category</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse collection across different styles and occasions.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`overflow-hidden rounded-2xl border border-border hover:border-hash-purple/50 group flex flex-col justify-end min-h-[260px] aspect-[1.1/1] relative transition-all duration-300 bg-gradient-to-br ${
                  index === 0 ? 'from-hash-purple/20 to-hash-blue/20' :
                  index === 1 ? 'from-hash-blue/20 to-hash-green/20' :
                  index === 2 ? 'from-hash-pink/20 to-hash-purple/20' :
                  'from-hash-orange/20 to-hash-pink/20'
                } hover:shadow-2xl hover:shadow-hash-purple/20`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--hash-purple))_0%,transparent_70%)] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  
                  {/* Content */}
                  <div className="relative z-20 flex flex-col h-full justify-between p-8">
                    <div className="flex justify-between items-start">
                      {category.trending && (
                        <span className="bg-gradient-to-r from-hash-orange to-hash-pink text-white text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wide animate-pulse">
                          🔥 Trending
                        </span>
                      )}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        index === 0 ? 'bg-hash-purple' :
                        index === 1 ? 'bg-hash-blue' :
                        index === 2 ? 'bg-hash-pink' :
                        'bg-hash-orange'
                      } shadow-lg group-hover:scale-110 transition-transform`}>
                        <span className="text-white text-xl font-bold">#</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-space group-hover:text-hash-purple transition-colors">{category.name}</h3>
                      <span className="text-base text-muted-foreground font-medium">{category.count}</span>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-hash-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card border-b border-border relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--hash-blue))_0%,transparent_50%)] opacity-5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-space">
              Why Choose <span className="hash-text-gradient">#HASH</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're committed to delivering exceptional quality and service with every order.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="text-center px-6 py-8 border border-border hover:border-hash-purple/50 rounded-2xl bg-gradient-to-br from-card to-background h-full flex flex-col items-center justify-center min-h-0 hover:shadow-lg hover:shadow-hash-purple/10 transition-all duration-300 group" style={{ minHeight: '180px', height: '100%' }}>
                  <CardContent className="p-0 flex flex-col items-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${
                      index === 0 ? 'from-hash-purple to-hash-blue' :
                      index === 1 ? 'from-hash-green to-hash-blue' :
                      'from-hash-pink to-hash-purple'
                    } rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 font-space group-hover:text-hash-purple transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-base flex-1">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-20 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--hash-pink))_0%,transparent_50%),radial-gradient(circle_at_20%_80%,hsl(var(--hash-blue))_0%,transparent_50%)] opacity-5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-space">
              <span className="hash-text-gradient">#Trending</span> Now
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our most popular pieces loved by thousands of customers worldwide.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featured.map((product, index) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-hash-purple/20 transition-all duration-300 bg-card border border-border hover:border-hash-purple/50 rounded-2xl">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images[0] || "https://placehold.co/400x500/404040/ffffff?text=HASH+Product"}
                      alt={product.name}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    
                    {/* Actions */}
                    <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <motion.button 
                        className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:bg-hash-purple/20 transition-colors border border-border"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-5 h-5 text-foreground" />
                      </motion.button>
                      <motion.button 
                        className="w-12 h-12 bg-card/80 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center hover:bg-hash-purple/20 transition-colors border border-border"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-5 h-5 text-foreground" />
                      </motion.button>
                    </div>

                    {/* Sale Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-xl text-sm font-bold shadow-lg">
                        Sale
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-8">
                    <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl font-bold text-gray-900">₹{product.price}</div>
                      <div className="text-lg text-gray-500 line-through">₹{Math.round(product.price * 1.3)}</div>
                      <span className="badge badge-success">
                        {Math.round(((product.price * 1.3 - product.price) / (product.price * 1.3)) * 100)}% OFF
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-2">
                        {product.sizes.slice(0, 3).map((size) => (
                          <span key={size} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-medium">
                            {size}
                          </span>
                        ))}
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>

                    <Button asChild className="w-full btn-gradient py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all">
                      <Link to={`/product/${product._id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Button asChild className="btn-gradient px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover-lift">
              <Link to="/shop" className="flex items-center gap-2">
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card border-b border-border relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(var(--hash-green))_0%,transparent_50%),radial-gradient(circle_at_70%_30%,hsl(var(--hash-pink))_0%,transparent_50%)] opacity-5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-space">
              What Our <span className="hash-text-gradient">#Community</span> Says
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of satisfied customers who love our products and service.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 bg-gradient-to-br from-card to-background border border-border hover:border-hash-purple/50 rounded-2xl h-full hover:shadow-lg hover:shadow-hash-purple/10 transition-all duration-300 group">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="flex text-hash-orange mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground mb-8 italic leading-relaxed text-lg flex-1 group-hover:text-foreground transition-colors">
                      "{testimonial.comment}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-hash-purple to-hash-blue flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-bold text-foreground text-lg font-space">{testimonial.name}</div>
                          {testimonial.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{testimonial.location}</div>
                        <div className="text-xs text-hash-green font-medium">✓ Verified Purchase</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-hash-purple via-hash-blue to-hash-pink text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white/90 mb-8 border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Globe className="w-4 h-4 mr-2" />
              Join 50,000+ #HASH Enthusiasts
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-space">
              Stay in <span className="text-white/90">#Style</span>
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Subscribe to our newsletter and be the first to know about new collections, 
              exclusive offers, and style tips from our fashion experts.
            </p>
            
            <div className="max-w-md mx-auto flex gap-4 mb-8">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:border-white/50 focus:ring-white/30 rounded-xl px-6 py-4 text-lg backdrop-blur-md h-14"
              />
              <Button className="bg-white text-hash-purple hover:bg-white/90 font-bold px-8 rounded-xl shadow-lg whitespace-nowrap transition-all hover:scale-105 font-space h-14">
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm text-white/70">
              Join 50,000+ subscribers. Unsubscribe anytime. No spam, we promise!
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 