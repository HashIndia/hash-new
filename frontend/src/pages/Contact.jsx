import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      info: "Coming Soon",
      description: "We're setting up official email",
      action: "#"
    },
    {
      icon: Phone,
      title: "Call Ankit",
      info: "+91 9460262940",
      description: "Operations & Partnerships",
      action: "tel:+919460262940"
    },
    {
      icon: Phone,
      title: "Call Sutirth", 
      info: "+91 9740452365",
      description: "Design & Creative",
      action: "tel:+919740452365"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "NITK Surathkal Campus",
      description: "Karnataka 575025, India",
      action: "#"
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white text-black py-16 border-b border-black">
        <motion.div 
          className="container mx-auto px-6 max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-light mb-4">Contact Us</h1>
            <p className="text-black">We're here to help! Reach out to us anytime</p>
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
        {/* Contact Information Cards */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border border-black shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6 text-center">
                  <info.icon className="w-12 h-12 text-black mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">{info.title}</h3>
                  <p className="text-black font-medium mb-1">{info.info}</p>
                  <p className="text-black text-sm">{info.description}</p>
                  {info.action !== "#" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => window.open(info.action)}
                    >
                      Contact
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Contact Form and FAQ */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <Card className="border border-black shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <MessageCircle className="w-6 h-6 text-black mr-3" />
                  <h2 className="text-2xl font-semibold text-black">Send us a Message</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this regarding?"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      required
                      className="w-full"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-hash-purple hover:bg-hash-purple/90 text-white font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div variants={itemVariants}>
            <Card className="border border-black shadow-sm bg-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-black mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-black mb-2">How can I place an order?</h3>
                    <p className="text-black">
                      Browse our collection, add items to cart, and checkout. We primarily serve NITK students 
                      but also deliver across India via postal services.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black mb-2">Do you make custom club merchandise?</h3>
                    <p className="text-black">
                      Yes! We partner with college clubs and events for custom t-shirts and merchandise. 
                      Contact Ankit for club partnership inquiries.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black mb-2">How long does delivery take?</h3>
                    <p className="text-black">
                      For NITK campus: 1-2 days. For other locations in India: 5-7 business days via post. 
                      Delivery times may vary based on location.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black mb-2">What payment methods do you accept?</h3>
                    <p className="text-black">
                      We accept online payments through our website, UPI, and other digital payment methods. 
                      Cash on delivery available for campus orders.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black mb-2">Can I return/exchange items?</h3>
                    <p className="text-black">
                      Yes, we have a student-friendly return policy. Items can be returned within 7 days 
                      if unworn and in original condition. Campus returns are especially easy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Support */}
        <motion.div variants={itemVariants} className="mt-16">
          <Card className="border border-black shadow-sm bg-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold text-black mb-4">Need Immediate Help?</h2>
              <p className="text-black mb-6 max-w-2xl mx-auto">
                Our customer support team is available 24/7 to assist you with any questions or concerns. 
                We're committed to providing you with the best possible shopping experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.open('tel:+919876543210')}
                  className="border border-black text-black hover:bg-white"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('mailto:support@hash.com')}
                  className="border border-black text-black hover:bg-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Business Information */}
        <motion.div variants={itemVariants} className="mt-16">
          <Card className="border border-black shadow-sm bg-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-black mb-6 text-center">Business Information</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black mb-4">Company Details</h3>
                  <div className="space-y-2 text-black">
                    <p><strong className="text-black">Business Name:</strong> Hash Clothing</p>
                    <p><strong className="text-black">Business Owner:</strong> Orca Whale INC</p>
                    <p><strong className="text-black">Type:</strong> Registered Enterprise</p>
                    <p><strong className="text-black">Founded:</strong> 2023</p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black mb-4">Location</h3>
                  <div className="space-y-2 text-black">
                    <p><strong className="text-black">Base:</strong> NITK Surathkal Campus</p>
                    <p><strong className="text-black">City:</strong> Surathkal, Karnataka</p>
                    <p><strong className="text-black">Postal Code:</strong> 575025</p>
                    <p><strong className="text-black">Country:</strong> India</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
