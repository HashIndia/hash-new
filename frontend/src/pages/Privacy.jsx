import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "framer-motion";

export default function Privacy() {
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
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section with Hash Branding */}
      <div className="bg-black text-white py-16">
        <motion.div 
          className="container mx-auto px-6 max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-light tracking-[0.2em] mb-4">HASH</h1>
            <p className="text-gray-300 text-sm tracking-[0.15em] uppercase mb-8">Premium E-commerce</p>
            <h2 className="text-3xl md:text-4xl font-light mb-4">Privacy Policy</h2>
            <p className="text-gray-400">Last updated: January 2024</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Content Section */}
      <motion.div 
        className="container mx-auto py-16 px-6 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="border border-border shadow-sm bg-card">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-gray max-w-none">
                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">1. Information We Collect</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Personal information (name, email address, phone number)</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely by our payment partners)</li>
                    <li>Order history and preferences</li>
                    <li>Communication preferences</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Process and fulfill your orders</li>
                    <li>Send you order confirmations and shipping updates</li>
                    <li>Provide customer support</li>
                    <li>Personalize your shopping experience</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Improve our products and services</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">3. Information Sharing</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties except as described below:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Service providers who assist us in operating our website and conducting business</li>
                    <li>Payment processors for secure transaction processing</li>
                    <li>Shipping companies to deliver your orders</li>
                    <li>When required by law or to protect our rights</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">4. Data Security</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure servers and databases</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information on a need-to-know basis</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">5. Your Rights</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Access and review your personal information</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Delete your account and personal information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Export your data in a portable format</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">6. Cookies and Tracking</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
                  </p>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">7. Children's Privacy</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                  </p>
                </motion.section>

                <motion.section className="mb-8" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">8. Contact Us</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-4 tracking-wide">HASH</h3>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Email: privacy@hash.com</p>
                      <p className="text-muted-foreground">Phone: +91 9876543210</p>
                      <p className="text-muted-foreground">Address: 123 Fashion Street, Mumbai, India</p>
                    </div>
                  </div>
                </motion.section>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Section */}
        <motion.div 
          className="mt-16 text-center py-8 border-t border-border"
          variants={itemVariants}
        >
          <p className="text-muted-foreground text-sm">
            © 2024 Hash - Premium E-commerce Platform. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 