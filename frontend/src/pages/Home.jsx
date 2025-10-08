import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import useProductStore from "../stores/useProductStore";
import HomePageSkeleton from "../components/HomePageSkeleton";
import SEO from "../components/SEO";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/common/HeroSlider";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Star,
  Truck,
  Shield,
  RefreshCw,
  ArrowRight,
  Heart,
  Eye,
  Award,
  CheckCircle,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Home() {
  const { products, initialize, isLoading } = useProductStore();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length === 0) {
        await initialize();
      }
      setShowSkeleton(false);
    };

    fetchProducts();
  }, [initialize, products.length]);

  if (showSkeleton && products.length === 0) {
    return <HomePageSkeleton />;
  }

  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 6);
  const heroProducts = products.filter((p) => p.isHero).slice(0, 6);

  const trendingShirtsFallback = [
    {
      _id: "shirt1",
      name: "Classic White Shirt",
      img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80",
      description: "A timeless classic, perfect for every occasion. Crafted from premium cotton for all-day comfort.",
      price: 799,
      rating: 5,
      sizes: ["S", "M", "L", "XL"],
      sale: true,
    },
    {
      _id: "shirt2",
      name: "Urban Black Tee",
      img: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=400&q=80",
      description: "Minimal, bold, and versatile. The Urban Black Tee is a must-have for your streetwear collection.",
      price: 699,
      rating: 4,
      sizes: ["M", "L", "XL"],
      sale: false,
    },
    {
      _id: "shirt3",
      name: "Campus Blue Polo",
      img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=400&q=80",
      description: "Smart and casual, this blue polo brings a pop of color to your college days.",
      price: 899,
      rating: 5,
      sizes: ["S", "M", "L"],
      sale: true,
    },
    {
      _id: "shirt4",
      name: "HASH Signature Tee",
      img: "https://images.unsplash.com/photo-1537799921743-6fd2a58e0a77?auto=format&fit=crop&w=400&q=80",
      description: "Show your vibe with our signature tee. Soft, stylish, and made for trendsetters.",
      price: 849,
      rating: 4,
      sizes: ["M", "L", "XL", "XXL"],
      sale: false,
    },
  ];

  const featuredTrending = trendingProducts.length > 0
    ? trendingProducts
    : trendingShirtsFallback;

  const stats = [
    {
      title: "T-Shirts Sold",
      value: "3000+",
      change: "+12.5%",
      icon: ShoppingCart,
      description: "Premium T-shirts",
    },
    {
      title: "Happy Customers",
      value: "1000+",
      change: "+8.2%",
      icon: Users,
      description: "Satisfied customers",
    },
    {
      title: "Customer Rating",
      value: "4.5/5",
      change: "+0.8%",
      icon: Star,
      description: "Average rating",
    },
    {
      title: "Collections",
      value: "20+",
      change: "+15.1%",
      icon: Award,
      description: "Fashion collections",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Finest materials for lasting comfort and style.",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On all orders above ₹999. Fast and reliable delivery.",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30-day hassle-free returns. Your satisfaction is our priority.",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      rating: 5,
      comment: "Amazing quality and fit! The fabrics feel premium and the designs are so trendy. Highly recommend!",
      location: "Mumbai, India",
      verified: true,
    },
    {
      name: "Arjun Patel",
      rating: 5,
      comment: "Fast delivery and excellent customer service. The clothes exceeded my expectations!",
      location: "Delhi, India",
      verified: true,
    },
    {
      name: "Sneha Reddy",
      rating: 5,
      comment: "Love the sustainable approach and modern designs. Perfect for college and casual outings.",
      location: "Bangalore, India",
      verified: true,
    },
  ];

  const coreTeam = [
    {
      name: "Sutirth",
      role: "Founder",
      linkedin: "https://linkedin.com/in/sutirth-naik-689818297",
      img: "https://media.licdn.com/dms/image/v2/D5603AQEVtTiWrnT9vg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718231799800?e=2147483647&v=beta&t=uKTyC4gipnxNS9zFAbIp0tZ9JpeI7ffUCgADYCKFBUk",
    },
    {
      name: "Ankit",
      role: "Co-Founder",
      linkedin: "https://linkedin.com/in/ankit-sharma-3aba76325",
      img: "https://media.licdn.com/dms/image/v2/D4E03AQGxCkV1cum3SQ/profile-displayphoto-shrink_400_400/B4EZYcdlfAG0Ag-/0/1744234243489?e=1761782400&v=beta&t=HH0k257p9tyoGzdwxPeAe3pwFrSPr95AoSgwOBeN6OU",
    },
    {
      name: "Prajwal ",
      role: "Web Developer",
      linkedin: "https://linkedin.com/in/prajwal-ambekar-21b955286",
      img: "https://media.licdn.com/dms/image/v2/D5603AQHJ_hxqLwGEpQ/profile-displayphoto-scale_200_200/B56ZkoOLZTJoAY-/0/1757316431860?e=2147483647&v=beta&t=SHCBwBurG2RjmIu3to6SWCkStjqCglA8bARyxDCCOQ4",
    },
    {
      name: "Artharva",
      role: "Video Editor",
      linkedin: "https://linkedin.com/in/atharva-muthal-508187291",
      img: "https://placehold.co/120x120/f8fafc/222?text=AR",
    },
    {
      name: "Nikhil",
      role: "Media Head",
      linkedin: "https://linkedin.com/in/nikhil-ranganekar-a63b88221",
      img: "https://media.licdn.com/dms/image/v2/D5603AQHMNxlpWPBHuw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1708161089934?e=1761782400&v=beta&t=mdCF9caWRbJRgRLp_kZJCHKoajnPACNihIiI72wLtF4",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <SEO
        title="HASH India - Premium Fashion Store | Shop Latest Trends Online"
        description="HASH India - Discover premium fashion and clothing. Shop the latest trends in men's and women's fashion, t-shirts, jeans, dresses, and accessories with fast delivery across India. Best quality guaranteed."
        keywords="HASH India, hashindia, premium fashion, online clothing store, men's fashion, women's fashion, t-shirts, jeans, dresses, accessories, fashion trends, Indian fashion brand, online shopping India, latest fashion, trendy clothes"
        url="https://hashindia.com/"
        canonicalUrl="https://hashindia.com/"
      />
      <div className="bg-white shadow-lg rounded-b-3xl">
        <HeroSlider heroProducts={heroProducts} />
        {heroProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 px-6">
            {heroProducts.map((product) => (
              <Card key={product._id} className="group overflow-hidden bg-white border border-neutral-100 hover:border-black/10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden bg-neutral-100">
                  <img
                    src={product.images?.[0]?.url || product.images?.[0] || "https://placehold.co/400x500/f8fafc/222?text=HASH+Product"}
                    alt={product.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105 brightness-110"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-xl font-bold text-neutral-900">
                      ₹{product.price}
                    </div>
                  </div>
                  <p className="text-neutral-500 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <Button
                    asChild
                    className="w-full bg-black text-white py-3 rounded-xl font-semibold text-base shadow hover:bg-neutral-800 transition-all"
                  >
                    <Link to={`/product/${product._id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <section className="py-20 bg-gradient-to-b from-white to-neutral-50 border-b border-neutral-100 shadow-sm rounded-3xl my-12 mx-auto max-w-7xl">
        <div className="container mx-auto px-6 ">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 font-space">
              <span className="text-black/80 p-0 m-0">#Trending</span> Now
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
              Discover our most popular pieces loved by thousands of customers worldwide.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {featuredTrending.map((product, index) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group overflow-hidden bg-white border border-neutral-100 hover:border-black/10 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden bg-neutral-100">
                    <img
                      src={
                        product.img ||
                        product.images?.[0]?.url ||
                        product.images?.[0] ||
                        "https://placehold.co/400x500/f8fafc/222?text=HASH+Product"
                      }
                      alt={product.name}
                      className="w-full h-64 sm:h-72 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105 brightness-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <motion.button
                        className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl shadow flex items-center justify-center hover:bg-neutral-100 transition-colors border border-neutral-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-5 h-5 text-neutral-700" />
                      </motion.button>
                      <motion.button
                        className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl shadow flex items-center justify-center hover:bg-neutral-100 transition-colors border border-neutral-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-5 h-5 text-neutral-700" />
                      </motion.button>
                    </div>
                    {product.sale && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-black text-white px-3 py-1 rounded-xl text-xs font-bold shadow">
                          Sale
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5 md:p-6">
                    <h3 className="font-bold text-base sm:text-lg text-neutral-900 mb-2 sm:line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-xl font-bold text-neutral-900">
                        ₹{product.price}
                      </div>
                      {product.price && (
                        <div className="text-base text-neutral-400 line-through">
                          ₹{Math.round(product.price * 1.3)}
                        </div>
                      )}
                      {product.price && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                          {Math.round(
                            ((product.price * 1.3 - product.price) /
                              (product.price * 1.3)) *
                              100
                          )}
                          % OFF
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-500 mb-4 sm:line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        {(product.sizes || product.sizes?.length > 0
                          ? product.sizes
                          : ["M", "L", "XL"]
                        ).slice(0, 3).map((size) => (
                          <span
                            key={size}
                            className="text-xs bg-neutral-100 text-neutral-700 px-3 py-1 rounded-lg font-medium"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(product.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-black text-white py-3 rounded-xl font-semibold text-base shadow hover:bg-neutral-800 transition-all"
                    >
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
            <Button
              asChild
              className="bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg shadow hover:bg-neutral-800 transition-all"
            >
              <Link to="/shop" className="flex items-center gap-2">
                View All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-white border-b border-neutral-100 shadow-md rounded-3xl my-12 mx-auto max-w-7xl">
        <div className="container mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 xl:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white border border-neutral-100 rounded-2xl hover:border-black/10 transition-all duration-300 hover:shadow-md flex flex-col justify-between items-stretch min-h-[180px] h-full">
                  <CardContent className="flex flex-col h-full p-8 md:p-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-neutral-400">
                          {stat.description}
                        </span>
                        <span className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-space">
                          {stat.value}
                        </span>
                      </div>
                      <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center shadow-sm">
                        <stat.icon className="w-7 h-7 text-black/70" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-semibold">
                        {stat.change}
                      </span>
                      <span className="text-neutral-400 text-xs">
                        this month
                      </span>
                    </div>
                    <div className="mt-auto">
                      <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
                        {stat.title}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-100 shadow-sm rounded-3xl my-12 mx-auto max-w-7xl">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 font-space">
              Why Choose <span className="text-black/80">#HASH</span>?
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
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
                <Card className="text-center px-6 py-8 border border-neutral-100 hover:border-black/10 rounded-2xl bg-white h-full flex flex-col items-center justify-center min-h-0 hover:shadow-md transition-all duration-300 group">
                  <CardContent className="p-0 flex flex-col items-center">
                    <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-neutral-200 transition-colors">
                      <feature.icon className="w-8 h-8 text-black/70" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 font-space group-hover:text-black transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-500 leading-relaxed text-base flex-1">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white border-b border-neutral-100 shadow-md rounded-3xl my-12 mx-auto max-w-7xl">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 font-space">
              Top feedback <span className="text-black/80">from Professional</span>
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
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
                <Card className="p-8 bg-white border border-neutral-100 hover:border-black/10 rounded-2xl h-full hover:shadow-md transition-all duration-300 group">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="flex text-yellow-400 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-neutral-500 mb-8 italic leading-relaxed text-lg flex-1 group-hover:text-neutral-900 transition-colors">
                      "{testimonial.comment}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center shadow">
                        <span className="text-neutral-700 font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-bold text-neutral-900 text-lg font-space">
                            {testimonial.name}
                          </div>
                          {testimonial.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-sm text-neutral-400">
                          {testimonial.location}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          ✓ Verified Purchase
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Core Team Section */}
          <motion.div
            id="core-team"
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-10 font-space text-center">
              Meet Our <span className="text-black/80">Core Team</span>
            </h2>
            {/* First Row - Sutirth and Ankit */}
            <div className="grid grid-cols-2 gap-4 sm:gap-4 md:gap-8 mb-6 sm:mb-8 justify-center max-w-4xl mx-auto">
              {coreTeam.slice(0, 2).map((member, idx) => (
                <motion.div
                  key={member.name}
                  variants={itemVariants}
                  whileHover={{ y: -12, scale: 1.06, boxShadow: "0 18px 35px rgba(0,0,0,0.12)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="relative overflow-hidden flex flex-col items-center bg-neutral-50 border border-neutral-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow hover:shadow-xl hover:border-black/20 transition-all duration-300 group h-full"
                >
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4"
                  >
                    <motion.img
                      src={member.img}
                      alt={member.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-neutral-200 shadow object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 16 }}
                    />
                  </a>
                  <div className="text-center">
                    <h3 className="text-lg md:text-xl font-bold text-neutral-900 mt-2 font-space group-hover:text-black transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm md:text-base text-neutral-500 font-medium mb-2">
                      {member.role}
                    </p>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-neutral-700 font-semibold hover:underline text-xs md:text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 10.268h-3v-4.604c0-1.099-.021-2.513-1.531-2.513-1.531 0-1.767 1.197-1.767 2.434v4.683h-3v-9h2.881v1.229h.041c.401-.761 1.379-1.563 2.841-1.563 3.041 0 3.601 2.002 3.601 4.604v4.73z" />
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Second Row - Prajwal Praveen, Artharva, Nikhil */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 justify-center max-w-6xl mx-auto">
              {coreTeam.slice(2, 5).map((member, idx) => (
                <motion.div
                  key={member.name}
                  variants={itemVariants}
                  whileHover={{ y: -12, scale: 1.06, boxShadow: "0 18px 35px rgba(0,0,0,0.12)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="relative overflow-hidden flex flex-col items-center bg-neutral-50 border border-neutral-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow hover:shadow-xl hover:border-black/20 transition-all duration-300 group h-full"
                >
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4"
                  >
                    <motion.img
                      src={member.img}
                      alt={member.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-neutral-200 shadow object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 16 }}
                    />
                  </a>
                  <div className="text-center">
                    <h3 className="text-lg md:text-xl font-bold text-neutral-900 mt-2 font-space group-hover:text-black transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm md:text-base text-neutral-500 font-medium mb-2">
                      {member.role}
                    </p>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-neutral-700 font-semibold hover:underline text-xs md:text-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 10.268h-3v-4.604c0-1.099-.021-2.513-1.531-2.513-1.531 0-1.767 1.197-1.767 2.434v4.683h-3v-9h2.881v1.229h.041c.401-.761 1.379-1.563 2.841-1.563 3.041 0 3.601 2.002 3.601 4.604v4.73z" />
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}