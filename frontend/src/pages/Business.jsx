import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { Building, MapPin, Phone, Mail, Globe, FileText, Shield, Award } from "lucide-react";

export default function Business() {
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

  const businessDetails = [
    {
      icon: Building,
      title: "Business Information",
      details: [
        { label: "Business Name", value: "Hash Clothing" },
        { label: "Business Type", value: "Student-Run Enterprise" },
        { label: "Industry", value: "Custom Apparel & Merchandise" },
        { label: "Founded", value: "2023" },
        { label: "Founders", value: "4 NITK Students" }
      ]
    },
    {
      icon: FileText,
      title: "Business Details",
      details: [
        { label: "Current Status", value: "Unregistered Student Business" },
        { label: "Primary Market", value: "NITK Surathkal Campus" },
        { label: "Secondary Market", value: "India (via Post)" },
        { label: "Specialization", value: "Club Merchandise & Custom Apparel" },
        { label: "Operating Since", value: "2023" }
      ]
    },
    {
      icon: MapPin,
      title: "Location & Delivery",
      details: [
        { label: "Base Location", value: "NITK Surathkal Campus" },
        { label: "City", value: "Surathkal" },
        { label: "State", value: "Karnataka" },
        { label: "Postal Code", value: "575025" },
        { label: "Delivery Area", value: "All India via Post" }
      ]
    },
    {
      icon: Phone,
      title: "Contact Information",
      details: [
        { label: "Ankit (Operations)", value: "+91 9460262940" },
        { label: "Sutirth (Design)", value: "+91 9740452365" },
        { label: "Email", value: "Coming Soon" },
        { label: "Website", value: "hash-store.com" },
        { label: "Support", value: "WhatsApp/Call" }
      ]
    }
  ];

  const licenses = [
    {
      icon: Shield,
      title: "Student Enterprise",
      number: "Unregistered",
      authority: "NITK Surathkal Campus",
      validity: "Active since 2023"
    },
    {
      icon: FileText,
      title: "Business Plan",
      number: "Growth-Oriented",
      authority: "Student Entrepreneurship",
      validity: "Expanding operations"
    },
    {
      icon: Award,
      title: "Quality Commitment",
      number: "Student-Verified",
      authority: "Peer Reviews & Feedback",
      validity: "Continuous improvement"
    }
  ];

  const bankDetails = [
    { label: "Payment Methods", value: "UPI, Online Payments" },
    { label: "Campus Payments", value: "Cash on Delivery Available" },
    { label: "Online Platform", value: "Razorpay Integration" },
    { label: "Student Discounts", value: "Special Campus Rates" },
    { label: "Bulk Orders", value: "Club Partnership Rates" },
    { label: "Refund Policy", value: "7-Day Return for Students" }
  ];

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
            <p className="text-muted-foreground text-sm tracking-[0.15em] uppercase mb-8">Business Information</p>
            <h2 className="text-3xl md:text-4xl font-light mb-4">Company Details</h2>
            <p className="text-muted-foreground">Comprehensive business information and compliance details</p>
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
        {/* Business Information Grid */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {businessDetails.map((section, index) => (
              <Card key={index} className="border border-border shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <section.icon className="w-6 h-6 text-foreground mr-3" />
                    <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {section.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                        <span className="text-muted-foreground font-medium">{detail.label}:</span>
                        <span className="text-foreground">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Licenses and Certifications */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">Business Status & Commitments</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {licenses.map((license, index) => (
              <Card key={index} className="border border-border shadow-sm">
                <CardContent className="p-6 text-center">
                  <license.icon className="w-12 h-12 text-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-3">{license.title}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-foreground">
                      <strong>License No:</strong> {license.number}
                    </p>
                    <p className="text-foreground">
                      <strong>Authority:</strong> {license.authority}
                    </p>
                    <p className="text-green-600 font-medium">{license.validity}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Bank Information */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Building className="w-6 h-6 text-foreground mr-3" />
                <h3 className="text-2xl font-semibold text-foreground">Payment & Business Information</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {bankDetails.map((detail, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground font-medium">{detail.label}:</span>
                    <span className="text-foreground font-mono">{detail.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Business Model & Operations */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Business Model & Operations</h3>
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Business Activities</h4>
                  <ul className="space-y-2 text-foreground">
                    <li>• Custom t-shirt design and printing for college clubs</li>
                    <li>• Official merchandise for college festivals (Incident, Engineer)</li>
                    <li>• Original clothing designs and apparel</li>
                    <li>• Student-friendly pricing and bulk orders</li>
                    <li>• Campus delivery and nationwide shipping</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Operational Details</h4>
                  <ul className="space-y-2 text-foreground">
                    <li>• Student-run operations with quality focus</li>
                    <li>• Campus delivery within 1-2 days</li>
                    <li>• India-wide delivery via postal services</li>
                    <li>• Direct student feedback and quality assurance</li>
                    <li>• Secure online payment processing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance & Security */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-border shadow-sm bg-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Compliance & Security</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Data Protection</h4>
                  <ul className="space-y-2 text-foreground">
                    <li>• GDPR compliant data handling</li>
                    <li>• SSL encryption for all transactions</li>
                    <li>• PCI DSS compliant payment processing</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Customer privacy protection measures</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Financial Compliance</h4>
                  <ul className="space-y-2 text-foreground">
                    <li>• RBI guidelines compliance</li>
                    <li>• Anti-money laundering (AML) policies</li>
                    <li>• Know Your Customer (KYC) procedures</li>
                    <li>• Regular financial audits</li>
                    <li>• Tax compliance and reporting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact for Business Inquiries */}
        <motion.div variants={itemVariants}>
          <Card className="border border-border shadow-sm">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-foreground mb-4">Business Inquiries</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                For partnerships, vendor inquiries, or business collaborations, please reach out to our business development team.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Mail className="w-8 h-8 text-foreground mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Business Development</h4>
                  <p className="text-muted-foreground">business@hash.com</p>
                </div>
                <div className="text-center">
                  <Phone className="w-8 h-8 text-foreground mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Partnership Inquiries</h4>
                  <p className="text-muted-foreground">+91 9876543210</p>
                </div>
                <div className="text-center">
                  <Globe className="w-8 h-8 text-foreground mx-auto mb-2" />
                  <h4 className="font-semibold text-foreground mb-1">Media & Press</h4>
                  <p className="text-muted-foreground">press@hash.com</p>
                </div>
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
            © 2024 Hash Private Limited. All rights reserved. | CIN: U74999MH2024PTC123456
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
