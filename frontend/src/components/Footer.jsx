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
  ArrowUp,
  Heart
} from 'lucide-react';

export default function Footer() {
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToTop = () => {
    setIsScrolling(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsScrolling(false), 1000);
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:bg-hash-blue/10 hover:text-hash-blue' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:bg-hash-blue/10 hover:text-hash-blue' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-hash-pink/10 hover:text-hash-pink' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:bg-hash-orange/10 hover:text-hash-orange' },
  ];

  const footerLinks = {
    'Quick Links': [
      { name: 'About Us', href: '/about', description: 'Our story' },
      { name: 'Shop', href: '/shop', description: 'Browse our collection' },
      { name: 'New Arrivals', href: '/shop?category=new', description: 'Latest trends' },
      { name: 'Best Sellers', href: '/shop?category=bestsellers', description: 'Popular items' },
      { name: 'Sale', href: '/shop?category=sale', description: 'Great deals' },
    ],
    'Support': [
      { name: 'Contact Us', href: '/contact', description: '24/7 support' },
      { name: 'FAQ', href: '/faq', description: 'Quick answers' },
      { name: 'Size Guide', href: '/size-guide', description: 'Find your fit' },
      { name: 'Shipping Info', href: '/shipping', description: 'Delivery details' },
    ],
    'Legal': [
      { name: 'Privacy Policy', href: '/privacy', description: 'Your data protection' },
      { name: 'Terms of Service', href: '/terms', description: 'Service agreement' },
      { name: 'Return Policy', href: '/returns', description: 'Easy returns' },
      { name: 'Business Info', href: '/business', description: 'Company details' },
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
    <footer className="bg-background text-foreground mt-auto relative overflow-hidden border-t border-border">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--hash-purple))_0%,transparent_50%),radial-gradient(circle_at_80%_20%,hsl(var(--hash-blue))_0%,transparent_50%)] opacity-5"></div>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                <img 
                  src="/hash-logo.jpg" 
                  alt="Hash Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <img 
                src="/hash-logo-text.jpg" 
                alt="Hash" 
                className="h-10 object-contain"
              />
            </Link>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
              Define your style story with premium fashion that speaks your language. 
              Bold, modern, and uniquely you.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`w-12 h-12 bg-card/50 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all group ${social.color} border border-border hover:border-hash-purple/50`}
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
              <h4 className="font-bold text-xl text-foreground mb-6 font-space">{category}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group block"
                    >
                      <div className="text-muted-foreground hover:text-foreground transition-colors">
                        <div className="font-medium group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </div>
                        <div className="text-sm text-muted-foreground/70 group-hover:text-muted-foreground mt-1">
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

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-t border-border pt-8 mt-12 flex flex-col lg:flex-row justify-between items-center gap-6"
        >
          <div className="text-muted-foreground text-center lg:text-left">
            <p className="mb-2">© 2024 Hash. All rights reserved.</p>
            <p className="flex items-center justify-center lg:justify-start gap-2">
              Made with <Heart className="w-4 h-4 text-hash-pink animate-pulse" /> by{' '}
              <a 
                href="https://www.linkedin.com/in/praveen-yadav-b29380282/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-hash-purple hover:text-hash-blue transition-colors font-medium underline underline-offset-2"
              >
                Praveen
              </a>
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {['VISA', 'MC', 'UPI', 'AMEX'].map((payment) => (
                <motion.div
                  key={payment}
                  className="w-12 h-8 bg-card/50 backdrop-blur-sm rounded-lg flex items-center justify-center text-xs font-bold text-muted-foreground border border-border"
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
        className="fixed bottom-8 right-8 w-14 h-14 bg-hash-purple rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50 group"
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