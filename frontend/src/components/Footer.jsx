import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowUp,
  Heart,
  Globe,
  Shield,
  Truck,
  CreditCard,
  Check
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    setIsScrolling(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsScrolling(false), 1000);
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:bg-blue-50 hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:bg-blue-50 hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-pink-50 hover:text-pink-600' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:bg-red-50 hover:text-red-600' },
  ];

  const footerLinks = {
    'Quick Links': [
      { name: 'Shop', href: '/shop', description: 'Browse our collection' },
      { name: 'New Arrivals', href: '/shop?category=new', description: 'Latest trends' },
      { name: 'Best Sellers', href: '/shop?category=bestsellers', description: 'Popular items' },
      { name: 'Sale', href: '/shop?category=sale', description: 'Great deals' },
    ],
    'Customer Care': [
      { name: 'Contact Us', href: '/contact', description: '24/7 support' },
      { name: 'FAQ', href: '/faq', description: 'Quick answers' },
      { name: 'Size Guide', href: '/size-guide', description: 'Find your fit' },
      { name: 'Shipping Info', href: '/shipping', description: 'Delivery details' },
    ],
    'Company': [
      { name: 'About Us', href: '/about', description: 'Our story' },
      { name: 'Careers', href: '/careers', description: 'Join our team' },
      { name: 'Press', href: '/press', description: 'Media kit' },
      { name: 'Sustainability', href: '/sustainability', description: 'Our commitment' },
    ],
    'Legal': [
      { name: 'Privacy Policy', href: '/privacy', description: 'Your data protection' },
      { name: 'Terms of Service', href: '/terms', description: 'Service agreement' },
      { name: 'Return Policy', href: '/returns', description: 'Easy returns' },
      { name: 'Cookie Policy', href: '/cookies', description: 'Cookie usage' },
    ],
  };

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
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="avatar avatar-lg bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-110 transition-transform">
                <span className="text-xl font-bold">#</span>
              </div>
              <h3 className="text-3xl font-bold gradient-text">HASH</h3>
            </Link>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              Define your style story with premium fashion that speaks your language. 
              Bold, modern, and uniquely you.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              {[
                { icon: Mail, text: 'hello@hash.com', color: 'text-blue-400' },
                { icon: Phone, text: '+91 98765 43210', color: 'text-green-400' },
                { icon: MapPin, text: 'Mumbai, India', color: 'text-purple-400' }
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-10 h-10 ${contact.color} bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <contact.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{contact.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center transition-all group ${social.color} border border-white/20 hover:border-white/40`}
                  aria-label={social.name}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={itemVariants}>
              <h4 className="font-bold text-xl text-white mb-6 gradient-text">{category}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group block"
                    >
                      <div className="text-gray-300 hover:text-white transition-colors">
                        <div className="font-medium group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 mt-1">
                          {link.description}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-12 mt-16"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold text-white mb-4">Stay in the Loop</h4>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Be the first to know about new arrivals, exclusive offers, and fashion tips. 
              Join our community of style enthusiasts!
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-4 max-w-md mx-auto">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all text-white placeholder:text-gray-400 backdrop-blur-sm"
                  required
                />
              </div>
              <motion.button 
                type="submit"
                className="btn-gradient px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  <>
                    <Check className="w-5 h-5" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Subscribe
                  </>
                )}
              </motion.button>
            </form>
            {isSubscribed && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-400 mt-4 font-medium"
              >
                Thank you for subscribing! 🎉
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-8 mt-12 flex flex-col lg:flex-row justify-between items-center gap-6"
        >
          <div className="text-gray-400 text-center lg:text-left">
            <p className="mb-2">© 2024 Hash. All rights reserved.</p>
            <p className="flex items-center justify-center lg:justify-start gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> in India
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {['VISA', 'MC', 'UPI', 'AMEX'].map((payment) => (
                <motion.div
                  key={payment}
                  className="w-12 h-8 bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold text-gray-300 border border-white/20"
                  whileHover={{ scale: 1.1 }}
                >
                  {payment}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50 group"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <ArrowUp className={`w-6 h-6 text-white transition-transform ${isScrolling ? 'animate-bounce' : 'group-hover:-translate-y-1'}`} />
      </motion.button>
    </footer>
  );
} 