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
          question: "What if my order doesn't arrive?",
          answer: "If your order doesn't arrive within the expected timeframe, please contact us immediately. For campus deliveries, we'll personally ensure delivery. For postal services, we'll help track the package and provide a replacement if needed."
        }
      ]
    },
    {
      category: "Products & Sizing",
      faqs: [
        {
          question: "How do I choose the right size?",
          answer: "Check our detailed size guide which includes measurements for chest, waist, and length. Since we're students, we understand the importance of a good fit - you can also message us your measurements and we'll recommend the best size."
        },
        {
          question: "What materials do you use?",
          answer: "We use high-quality cotton blends for t-shirts and hoodies, ensuring comfort and durability. All materials are sourced from reliable suppliers and are suitable for the campus environment and daily wear."
        },
        {
          question: "Can I see products before buying?",
          answer: "Absolutely! Since we're on campus, you can visit us to see and feel the products before ordering. We also share detailed photos and videos on our WhatsApp group."
        },
        {
          question: "Do you take custom orders?",
          answer: "Yes! We specialize in custom merchandise for clubs, events, and personal designs. Minimum quantity varies based on the design complexity. Contact us with your requirements for a quote."
        }
      ]
    },
    {
      category: "Payment & Pricing",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept UPI, bank transfers, and cash (for campus deliveries). Online payments are processed securely through Razorpay. We also accept payment on delivery for campus orders."
        },
        {
          question: "Are there any hidden charges?",
          answer: "No hidden charges! The price you see includes everything except shipping (which is clearly mentioned). For campus deliveries, shipping is free. For other locations, shipping costs are transparent."
        },
        {
          question: "Do you offer student discounts?",
          answer: "Being students ourselves, we keep our prices student-friendly! We also offer bulk discounts for club orders and special pricing during college fests and events."
        }
      ]
    },
    {
      category: "Returns & Exchanges",
      faqs: [
        {
          question: "What's your return policy?",
          answer: "We offer easy returns within 7 days of delivery. Products should be unworn and in original condition. Since we're on campus, returns are hassle-free - just contact us on WhatsApp."
        },
        {
          question: "How do exchanges work?",
          answer: "Exchanges for size or design issues are processed within 3-5 days. For campus students, we can arrange immediate exchanges. For other locations, we'll coordinate via courier."
        },
        {
          question: "Who pays for return shipping?",
          answer: "For quality issues or our mistakes, we cover return shipping. For size exchanges or change of mind, customer bears the return shipping cost. Campus returns are always free."
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, faqIndex) => {
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
          <Card className="border border-border shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg bg-background border-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Categories */}
        <motion.div variants={itemVariants} className="space-y-8">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="border border-border shadow-sm bg-card">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">{category.category}</h2>
                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const isOpen = openItems[`${categoryIndex}-${faqIndex}`];
                      return (
                        <div key={faqIndex} className="border border-border rounded-lg bg-background">
                          <button
                            onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-card transition-colors"
                          >
                            <span className="font-medium text-foreground pr-4">{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4 border-t border-border">
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
            <Card className="border border-border shadow-sm bg-card">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try searching with different keywords or browse our categories below.
                </p>
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="border-border text-foreground hover:bg-card"
                >
                  Clear search
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Contact Section */}
        <motion.div variants={itemVariants} className="mt-16">
          <Card className="border border-border shadow-sm bg-card">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-hash-purple mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">Still need help?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our student team is here to help! 
                Contact us directly and we'll get back to you quickly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button
                    className="bg-hash-purple hover:bg-hash-purple/90 text-white font-semibold px-8 py-3"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-card"
                  onClick={() => window.open('https://wa.me/+919876543210', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 text-center py-8 border-t border-border"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-hash-purple" />
            <span className="text-foreground font-medium">Hash Student Support</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Questions answered by real NITK students who understand your needs
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
