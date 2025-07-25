import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import useProductStore from "../stores/useProductStore";
import { motion, AnimatePresence } from "framer-motion";
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
  const { products } = useProductStore();
  const featured = products.slice(0, 6);

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 overflow-hidden">
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-sm text-blue-700 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Zap className="w-4 h-4 mr-2 text-blue-500" />
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                New Collection Available
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Define Your
                <motion.span 
                  className="block gradient-text"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Style Story
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover premium fashion that speaks your language. Bold, modern, and uniquely you.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Button asChild className="btn-gradient px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover-lift group">
                  <a href="/shop">
                    Shop Collection
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="px-8 py-4 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transition-all hover-lift border-2 border-gray-300 hover:border-gray-400">
                  <a href="#featured" className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Explore Trends
                  </a>
                </Button>
              </motion.div>

              <motion.div 
                className="flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-medium">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>10,000+ Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Free Shipping</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <motion.div
                  className="card-hover"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl">
                    <img
                      src="https://placehold.co/600x700/64748b/fff?text=Hero+Fashion"
                      alt="Fashion Hero"
                      className="w-full h-auto object-cover"
                    />
                  </Card>
                </motion.div>
                
                {/* Floating Cards */}
                <motion.div 
                  className="absolute -top-6 -left-6 glass rounded-2xl shadow-xl p-6 max-w-xs backdrop-blur-md"
                  initial={{ opacity: 0, y: 20, rotate: -5 }}
                  animate={{ opacity: 1, y: 0, rotate: -5 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  whileHover={{ rotate: 0, scale: 1.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Premium Quality</div>
                      <div className="text-sm text-gray-600">Sustainably made</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute -bottom-6 -right-6 glass rounded-2xl shadow-xl p-6 max-w-xs backdrop-blur-md"
                  initial={{ opacity: 0, y: -20, rotate: 5 }}
                  animate={{ opacity: 1, y: 0, rotate: 5 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  whileHover={{ rotate: 0, scale: 1.05 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Fast Delivery</div>
                      <div className="text-sm text-gray-600">2-3 business days</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-b border-gray-200">
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
                <Card className="card-hover border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50 flex flex-col justify-between items-stretch min-h-[220px] h-full">
                  <CardContent className="flex flex-col h-full p-8 md:p-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-500">{stat.description}</span>
                        <span className="text-3xl md:text-4xl font-extrabold text-gray-900">{stat.value}</span>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-semibold">{stat.change}</span>
                      <span className="text-gray-400 text-xs">this month</span>
                    </div>
                    <div className="mt-auto">
                      <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">{stat.title}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                <Card className={`card-interactive overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl border-0 group flex flex-col justify-end min-h-[260px] aspect-[1.1/1] relative transition-all duration-300 ${category.bg}`}>
                  {/* Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                  <div className="relative z-20 flex flex-col h-full justify-end p-8 md:p-10">
                    {category.trending && (
                      <span className="absolute top-6 left-6 bg-red-500/90 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md tracking-wide">
                        Trending
                      </span>
                    )}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">{category.name}</h3>
                    <span className="text-base text-white/80 font-medium">{category.count}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose Hash?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <Card className="card-hover text-center px-6 py-8 md:py-6 md:px-4 border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50 h-full flex flex-col items-center justify-center min-h-0" style={{ minHeight: '180px', height: '100%' }}>
                  <CardContent className="p-0 flex flex-col items-center">
                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-base flex-1">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Trending Now</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white border-0 rounded-2xl">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images[0] || "https://placehold.co/400x500/64748b/fff?text=Product"}
                      alt={product.name}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    
                    {/* Actions */}
                    <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <motion.button 
                        className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-5 h-5 text-gray-600" />
                      </motion.button>
                      <motion.button 
                        className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
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
                      <a href={`/product/${product.id}`}>View Details</a>
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
              <a href="/shop" className="flex items-center gap-2">
                View All Products
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <Card className="card-hover p-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="flex text-yellow-400 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 mb-8 italic leading-relaxed text-lg flex-1">
                      "{testimonial.comment}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover shadow-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                          {testimonial.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{testimonial.location}</div>
                        <div className="text-xs text-green-600 font-medium">Verified Purchase</div>
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
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white/90 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Globe className="w-4 h-4 mr-2" />
              Join 50,000+ Fashion Enthusiasts
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Stay in Style</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Subscribe to our newsletter and be the first to know about new collections, 
              exclusive offers, and style tips from our fashion experts.
            </p>
            
            <div className="max-w-md mx-auto flex gap-4 mb-8">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="glass border-white/30 text-white placeholder:text-white/70 focus:border-white/50 focus:ring-white/30 rounded-xl px-6 py-4 text-lg backdrop-blur-md"
              />
              <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 rounded-xl shadow-lg whitespace-nowrap transition-all hover-lift">
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm text-blue-200">
              Join 50,000+ subscribers. Unsubscribe anytime. No spam, we promise!
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 