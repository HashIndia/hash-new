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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
      <motion.div 
        className="container mx-auto py-12 px-6 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600">Last updated: January 2024</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm border border-border">
            <CardContent className="p-8">
              <div className="prose prose-slate max-w-none">
                <motion.section className="mb-8" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
                  <p className="text-slate-600 mb-4">
                    We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Personal information (name, email address, phone number)</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely by our payment partners)</li>
                    <li>Order history and preferences</li>
                    <li>Communication preferences</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-8" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
                  <p className="text-slate-600 mb-4">
                    We use the information we collect to provide, maintain, and improve our services:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Process and fulfill your orders</li>
                    <li>Send you order confirmations and shipping updates</li>
                    <li>Provide customer support</li>
                    <li>Personalize your shopping experience</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Improve our products and services</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-8" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Information Sharing</h2>
                  <p className="text-slate-600 mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties except as described below:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Service providers who assist us in operating our website and conducting business</li>
                    <li>Payment processors for secure transaction processing</li>
                    <li>Shipping companies to deliver your orders</li>
                    <li>When required by law or to protect our rights</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-8" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Security</h2>
                  <p className="text-slate-600 mb-4">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure servers and databases</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information on a need-to-know basis</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-8" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Your Rights</h2>
                  <p className="text-slate-600 mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc pl-6 text-slate-600 space-y-2">
                    <li>Access and review your personal information</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Delete your account and personal information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Export your data in a portable format</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-8" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Cookies and Tracking</h2>
                  <p className="text-slate-600 mb-4">
                    We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
                  </p>
                </motion.section>

                <motion.section className="mb-8" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Children's Privacy</h2>
                  <p className="text-slate-600 mb-4">
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                  </p>
                </motion.section>

                <motion.section className="mb-8" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Contact Us</h2>
                  <p className="text-slate-600 mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700 font-medium">Hash Clothing</p>
                    <p className="text-slate-600">Email: privacy@hashclothing.com</p>
                    <p className="text-slate-600">Phone: +91 9876543210</p>
                    <p className="text-slate-600">Address: 123 Fashion Street, Mumbai, India</p>
                  </div>
                </motion.section>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
} 