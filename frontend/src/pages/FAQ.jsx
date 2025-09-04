import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});

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

  const faqCategories = [
    {
      category: "Orders & Shipping",
      faqs: [
        {
          question: "How can I track my order?",
          answer: "Once your order is confirmed, we'll send you updates via WhatsApp and email. For campus deliveries, you'll get a notification when we're on our way. For postal deliveries, we'll provide tracking information once the package is handed over to India Post."
        },
        {
          question: "What are your shipping options?",
          answer: "We offer Campus Delivery (1-2 days, free within NITK), Local Delivery (2-4 days, ₹50 in Mangalore area), India Post (5-10 days, ₹100-200), and Express Courier (2-5 days, ₹150-300) for faster delivery across India."
        },
        {
          question: "Can I change or cancel my order?",
          answer: "Orders can be modified or cancelled within 2 hours of placement as we're a small team and process orders manually. After this time, the order goes into processing. Please contact us immediately on WhatsApp if you need to make changes."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to most countries worldwide. International shipping costs vary by destination and are calculated at checkout. Delivery times are typically 7-14 business days."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for all items in original condition with tags attached. Items must be unworn, unused, and in original packaging. Custom or personalized items cannot be returned."
        },
        {
          question: "How do I return an item?",
          answer: "For campus returns, drop the item at our collection point with the original packaging. For outside NITK, ship to our provided address (shipping charges apply). Once verified, refunds are processed within 3-7 business days."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 3-7 business days after we receive and verify your returned item. The refund will be credited to your original payment method. Bank processing may take an additional 1-2 days."
        },
        {
          question: "Can I exchange an item instead of returning it?",
          answer: "Yes, we offer size and color exchanges for the same product, subject to availability. For campus students, exchanges can be done at our collection point. The process typically takes 2-3 days."
        }
      ]
    },
    {
      category: "Payment & Pricing",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept UPI payments, credit/debit cards, and net banking. All payments are processed securely through Razorpay. For campus deliveries, we also accept cash on delivery."
        },
        {
          question: "Is it safe to pay on your website?",
          answer: "Yes, absolutely. We use industry-standard SSL encryption and secure payment processing through Razorpay. Your payment information is never stored on our servers and is processed securely."
        },
        {
          question: "Do you offer discounts for bulk orders?",
          answer: "Yes, we offer special discounts for college societies, clubs, and bulk orders (10+ items). Contact us directly on WhatsApp to discuss pricing and custom requirements."
        },
        {
          question: "Can I pay cash on delivery?",
          answer: "Cash on delivery is available for campus deliveries within NITK Surathkal. For all other locations, online payment is required at the time of order placement."
        }
      ]
    },
    {
      category: "Account & Profile",
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click on 'Sign Up' in the top right corner, enter your email and phone number, and verify your account with the OTP sent to your mobile. As a student business, we also offer easy registration with your college email ID for faster campus deliveries."
        },
        {
          question: "I forgot my password. How can I reset it?",
          answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a reset link. You can also contact us directly on WhatsApp for immediate assistance."
        },
        {
          question: "How do I update my profile information?",
          answer: "Log into your account and go to the 'Profile' section. You can update your personal information, addresses, and preferences. For campus addresses, we can help you set up hostel-specific delivery details."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account by contacting us directly on WhatsApp or email. Please note that this action is permanent and cannot be undone. Order history and data will be permanently removed."
        }
      ]
    },
    {
      category: "Products & Sizing",
      faqs: [
        {
          question: "How do I find the right size?",
          answer: "Check our detailed Size Guide available on each product page. We provide measurements in both inches and centimeters. If you're between sizes, we recommend sizing up. You can also contact us on WhatsApp for sizing advice based on your measurements."
        },
        {
          question: "Are the product colors accurate?",
          answer: "We strive to display accurate colors, but they may vary slightly due to monitor settings and lighting. If you're not satisfied with the color, you can return the item within 30 days."
        },
        {
          question: "How do I care for my products?",
          answer: "Care instructions are provided on each product page and on the garment labels. We recommend following the specific care instructions to maintain the quality and longevity of your items."
        },
        {
          question: "Do you have products for all body types?",
          answer: "Yes, we offer a diverse range of sizes and fits to accommodate different body types. Our inclusive sizing ranges from XS to 5XL for most products, with detailed fit information available."
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-hash-dark via-background to-card text-foreground py-16 border-b border-border">
        <motion.div 
          className="container mx-auto px-6 max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-light tracking-[0.2em] mb-4">HASH</h1>
            <p className="text-muted-foreground text-sm tracking-[0.15em] uppercase mb-8">Help Center</p>
            <h2 className="text-3xl md:text-4xl font-light mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Find quick answers to common questions</p>
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
        {/* Search Bar */}
        <motion.div variants={itemVariants} className="mb-12">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Categories */}
        <motion.div variants={itemVariants} className="space-y-8">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="border border-border shadow-sm">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">{category.category}</h2>
                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const key = `${categoryIndex}-${faqIndex}`;
                      const isOpen = openItems[key];
                      
                      return (
                        <div key={faqIndex} className="border border-border rounded-lg">
                          <button
                            onClick={() => toggleItem(categoryIndex, faqIndex)}
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-card transition-colors"
                          >
                            <span className="text-lg font-medium text-foreground pr-4">{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4">
                              <p className="text-foreground leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border border-border shadow-sm">
              <CardContent className="p-8 text-center">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any FAQs matching your search. Try different keywords or browse all categories.
                </p>
                <Button 
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="border-black text-foreground hover:bg-black hover:text-white"
                >
                  Show All FAQs
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Contact Support */}
        <motion.div variants={itemVariants} className="mt-16">
          <Card className="border border-border shadow-sm bg-card">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-16 h-16 text-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">Still Need Help?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our customer support team is here to help you 24/7.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild
                  className="bg-black hover:bg-muted"
                >
                  <Link to="/contact">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('tel:+919876543210')}
                  className="border-black text-foreground hover:bg-black hover:text-white"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('mailto:support@hash.com')}
                  className="border-black text-foreground hover:bg-black hover:text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Us
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
