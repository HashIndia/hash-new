import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Package, RotateCcw, Truck, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Returns() {
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

  const returnSteps = [
    {
      icon: Package,
      title: "Initiate Return",
      description: "Log into your account and select the item you want to return from your order history."
    },
    {
      icon: RotateCcw,
      title: "Package Items",
      description: "Pack the item securely in original packaging with all tags and accessories included."
    },
    {
      icon: Truck,
      title: "Return Method",
      description: "For campus: Drop at our collection point. Outside NITK: Ship to our address (shipping charges apply)."
    },
    {
      icon: CreditCard,
      title: "Get Refund",
      description: "Once verified by our team, your refund will be processed within 3-7 business days."
    }
  ];

  const eligibleItems = [
    { icon: CheckCircle, text: "Items with original tags and packaging", eligible: true },
    { icon: CheckCircle, text: "Unworn, unused products", eligible: true },
    { icon: CheckCircle, text: "Items returned within 30 days", eligible: true },
    { icon: CheckCircle, text: "Products in original condition", eligible: true },
  ];

  const ineligibleItems = [
    { icon: XCircle, text: "Custom or personalized items", eligible: false },
    { icon: XCircle, text: "Undergarments and intimate wear", eligible: false },
    { icon: XCircle, text: "Items damaged by customer", eligible: false },
    { icon: XCircle, text: "Products without original packaging", eligible: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-black text-white py-16">
        <motion.div 
          className="container mx-auto px-6 max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-light tracking-[0.2em] mb-4">HASH</h1>
            <p className="text-gray-300 text-sm tracking-[0.15em] uppercase mb-8">Customer Care</p>
            <h2 className="text-3xl md:text-4xl font-light mb-4">Returns & Refunds</h2>
            <p className="text-gray-400">Easy returns, hassle-free refunds</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Content Section */}
      <motion.div 
        className="container mx-auto py-16 px-6 max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Quick Info */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-border shadow-sm bg-gradient-to-r from-gray-50 to-white">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <Clock className="w-12 h-12 text-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">30-Day Returns</h3>
                  <p className="text-gray-600">Return items within 30 days of delivery</p>
                </div>
                <div>
                  <Truck className="w-12 h-12 text-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Campus Collection</h3>
                  <p className="text-gray-600">Easy returns at our NITK collection point</p>
                </div>
                <div>
                  <CreditCard className="w-12 h-12 text-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Quick Refunds</h3>
                  <p className="text-gray-600">Refunds processed within 3-7 business days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Return Process */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">How to Return</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((step, index) => (
              <Card key={index} className="border border-border shadow-sm text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Return Policy Details */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-semibold text-foreground mb-8">Return Policy Details</h2>
              
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Eligible Items */}
                <div>
                  <h3 className="text-xl font-semibold text-green-700 mb-6 flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Eligible for Return
                  </h3>
                  <div className="space-y-4">
                    {eligibleItems.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <item.icon className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ineligible Items */}
                <div>
                  <h3 className="text-xl font-semibold text-red-700 mb-6 flex items-center">
                    <XCircle className="w-6 h-6 mr-2" />
                    Not Eligible for Return
                  </h3>
                  <div className="space-y-4">
                    {ineligibleItems.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <item.icon className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Terms */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-semibold text-foreground mb-8">Terms & Conditions</h2>
              
              <div className="prose prose-gray max-w-none">
                <div className="grid lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Return Timeline</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Items must be returned within 30 days of delivery</li>
                      <li>• Return window starts from the date of delivery</li>
                      <li>• Late returns may not be accepted</li>
                      <li>• Return requests must be initiated through your account</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">Condition Requirements</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Items must be unworn and unused</li>
                      <li>• Original tags and labels must be attached</li>
                      <li>• Items must be in original packaging</li>
                      <li>• All accessories and components must be included</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Refund Process</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Refunds processed to original payment method</li>
                      <li>• Processing time: 5-10 business days</li>
                      <li>• Bank processing may take additional 2-3 days</li>
                      <li>• Refund confirmation sent via email</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">Exchange Policy</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Size exchanges available for same product</li>
                      <li>• Color exchanges subject to availability</li>
                      <li>• Exchange shipping costs covered by Hash</li>
                      <li>• Exchange processed within 3-5 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Special Cases */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-border shadow-sm bg-muted">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Special Circumstances</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Damaged Items</h3>
                  <p className="text-muted-foreground mb-4">
                    If you receive a damaged item, please contact us immediately with photos. 
                    We'll arrange a replacement or full refund at no cost to you.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Wrong Item Delivered</h3>
                  <p className="text-muted-foreground mb-4">
                    If you receive the wrong item, we'll arrange immediate pickup and send 
                    the correct item or process a full refund as per your preference.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Defective Products</h3>
                  <p className="text-muted-foreground mb-4">
                    Manufacturing defects are covered under our quality guarantee. 
                    Contact support within 30 days for a free replacement or refund.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Bulk Orders</h3>
                  <p className="text-muted-foreground mb-4">
                    Special return terms may apply for bulk orders. Please contact our 
                    customer service team for specific bulk return policies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Support */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Need Help with a Return?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our customer support team is here to help you with any return-related questions. 
                We're committed to making the return process as smooth as possible.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  className="bg-black hover:bg-gray-800"
                >
                  <Link to="/contact">
                    Contact Support
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  asChild
                  className="border-black text-foreground hover:bg-black hover:text-white"
                >
                  <Link to="/orders">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    View My Orders
                  </Link>
                </Button>
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
