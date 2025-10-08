import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "framer-motion";

export default function Terms() {
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
    <div className="min-h-screen bg-white">
      {/* Header Section with Hash Branding */}
      <div className="bg-black text-white py-16">
        <motion.div 
          className="container mx-auto px-6 max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-light mb-4">Terms of Service</h1>
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
          <Card className="border border-black bg-white">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-gray max-w-none">
                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-black">1. Acceptance of Terms</h2>
                  <p className="text-black mb-4 leading-relaxed">
                    By accessing and using Hash's website and services, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-black">2. Use License</h2>
                  <p className="text-black mb-4 leading-relaxed">
                    Permission is granted to temporarily download one copy of the materials on Hash's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc pl-6 text-black space-y-2">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-black">3. Product Information</h2>
                  <p className="text-black mb-4 leading-relaxed">
                    We strive to provide accurate product information, including descriptions, pricing, and availability. However:
                  </p>
                  <ul className="list-disc pl-6 text-black space-y-2">
                    <li>Product colors may vary slightly due to monitor settings</li>
                    <li>Prices are subject to change without notice</li>
                    <li>Product availability is not guaranteed</li>
                    <li>We reserve the right to correct any errors in product information</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-black">4. Business Ownership and Operations</h2>
                  <p className="text-black mb-4 leading-relaxed">
                    All Hash Clothing products are owned and operated by Orca Whale INC. This ensures:
                  </p>
                  <ul className="list-disc pl-6 text-black space-y-2">
                    <li>Consistent quality standards across all products</li>
                    <li>Compliance with industry regulations and standards</li>
                    <li>Ethical business practices and operational transparency</li>
                    <li>Quality control and assurance processes</li>
                    <li>Reliable business operations and customer service</li>
                  </ul>
                  <p className="text-black mt-4 leading-relaxed">
                    By purchasing from Hash, you acknowledge that Orca Whale INC is the business entity responsible for all operations and services.
                  </p>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-black">5. Orders and Payment</h2>
                  <p className="text-black mb-4 leading-relaxed">
                    When you place an order with us:
                  </p>
                  <ul className="list-disc pl-6 text-black space-y-2">
                    <li>You agree to provide accurate and complete information</li>
                    <li>Payment must be received before order processing</li>
                    <li>We reserve the right to refuse or cancel orders</li>
                    <li>Order confirmation does not guarantee product availability</li>
                    <li>All payments are processed securely through our payment partners</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-black">6. Shipping and Delivery</h2>
                  <p className="text-black mb-4 leading-relaxed">
                    Our shipping and delivery terms:
                  </p>
                  <ul className="list-disc pl-6 text-black space-y-2">
                    <li>Delivery times are estimates and not guaranteed</li>
                    <li>Risk of loss passes to you upon delivery</li>
                    <li>Shipping costs are calculated at checkout</li>
                    <li>International shipping may incur additional duties and taxes</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-black">7. Returns and Exchanges</h2>
                  <p className="text-black mb-4 leading-relaxed">
                    Our return policy includes:
                  </p>
                  <ul className="list-disc pl-6 text-black space-y-2">
                    <li>Items must be returned within 30 days of delivery</li>
                    <li>Items must be in original condition with tags attached</li>
                    <li>Custom or personalized items cannot be returned</li>
                    <li>Return shipping costs are the responsibility of the customer</li>
                    <li>Refunds will be processed within 5-10 business days</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-black">8. User Accounts</h2>
                  <p className="text-black mb-4 leading-relaxed">
                    When creating an account:
                  </p>
                  <ul className="list-disc pl-6 text-black space-y-2">
                    <li>You are responsible for maintaining account security</li>
                    <li>You must provide accurate and up-to-date information</li>
                    <li>You are responsible for all activities under your account</li>
                    <li>We reserve the right to suspend or terminate accounts</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-black">9. Prohibited Uses</h2>
                  <p className="text-black mb-4 leading-relaxed">
                    You may not use our service:
                  </p>
                  <ul className="list-disc pl-6 text-black space-y-2">
                    <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations or laws</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                  </ul>
                </motion.section>

                <motion.section className="mb-12" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-black">10. Limitation of Liability</h2>
                  <p className="text-black mb-4 leading-relaxed">
                    In no event shall Hash or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Hash's website.
                  </p>
                </motion.section>

                <motion.section className="mb-8" variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-black mb-6 pb-2 border-b border-black">11. Contact Information</h2>
                  <p className="text-black mb-6 leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="bg-white border border-black p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-black mb-4 tracking-wide">HASH</h3>
                    <div className="space-y-2">
                      <p className="text-black"><strong>Business Owner:</strong> Orca Whale INC</p>
                      <p className="text-black">Email: legal@hash.com</p>
                      <p className="text-black">Phone: +91 9876543210</p>
                      <p className="text-black">Address: 123 Fashion Street, Mumbai, India</p>
                    </div>
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
