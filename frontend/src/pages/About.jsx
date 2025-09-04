import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { Users, Award, Globe, Heart } from "lucide-react";

export default function About() {
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

  const features = [
    {
      icon: Users,
      title: "Student First",
      description: "Every decision we make is centered around serving the student community and college culture."
    },
    {
      icon: Award,
      title: "Quality Assurance", 
      description: "We ensure every product meets high standards while keeping prices affordable for students."
    },
    {
      icon: Globe,
      title: "Campus to Country",
      description: "Starting from NITK campus, now delivering quality merchandise across India."
    },
    {
      icon: Heart,
      title: "Passion for Design",
      description: "Our student team creates unique designs that capture the essence of college life and youth culture."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
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
            <p className="text-gray-300 text-sm tracking-[0.15em] uppercase mb-8">About Our Story</p>
            <h2 className="text-3xl md:text-4xl font-light mb-4">Redefining Fashion Commerce</h2>
            <p className="text-gray-400">Building the future of premium online shopping</p>
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
        {/* Story Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-semibold text-black mb-6">Our Story</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Founded in 2023, Hash began as a passion project by four first-year students at NITK Surathkal - 
                    Hrishab, Ankit, Sutirth, and Himanshu. What started as a simple idea to create cool merchandise 
                    for college events has grown into a thriving student-run clothing brand.
                  </p>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Now led by Ankit and Sutirth (both 3rd-year students), Hash has become the go-to brand for college 
                    merchandise, partnering with various clubs for their t-shirts and major college festivals like 
                    Incident (cultural fest) and Engineer (technical fest).
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    While we primarily serve NITK students, we've expanded to deliver our unique designs across India 
                    through postal services. Our mission is to create affordable, quality clothing that represents 
                    the spirit of student life and creativity.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-50 rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
                    <p className="text-gray-700 leading-relaxed">
                      To provide high-quality, affordable clothing and merchandise that celebrates student life, 
                      creativity, and college spirit while building a sustainable student-run business that 
                      inspires other young entrepreneurs.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Values Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-black mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Hash
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-black mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold text-black mb-4">Our Team</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Meet the student entrepreneurs behind Hash
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">Ankit</h3>
                  <p className="text-gray-600 mb-2">Co-Founder & Operations</p>
                  <p className="text-gray-500 text-sm">
                    3rd Year student at NITK, handling business operations and club partnerships.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">Sutirth</h3>
                  <p className="text-gray-600 mb-2">Co-Founder & Design</p>
                  <p className="text-gray-500 text-sm">
                    3rd Year student at NITK, leading design and creative direction for all products.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">Praveen</h3>
                  <p className="text-gray-600 mb-2">Web Developer & Tech</p>
                  <p className="text-gray-500 text-sm">
                    Manages the website, online presence, and technical aspects of the business.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div variants={itemVariants}>
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-black mb-4">Get in Touch</h2>
                <p className="text-gray-600">
                  We'd love to hear from you. Reach out to our team anytime.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Location</h3>
                  <p className="text-gray-700">NITK Surathkal Campus</p>
                  <p className="text-gray-700">Surathkal, Karnataka 575025</p>
                  <p className="text-gray-700">India</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Contact</h3>
                  <p className="text-gray-700">Ankit: +91 9460262940</p>
                  <p className="text-gray-700">Sutirth: +91 9740452365</p>
                  <p className="text-gray-700">Email: (Coming soon)</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Business</h3>
                  <p className="text-gray-700">Student-Run Enterprise</p>
                  <p className="text-gray-700">Founded: 2023</p>
                  <p className="text-gray-700">Delivery: All India via Post</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Section */}
        <motion.div 
          className="mt-16 text-center py-8 border-t border-gray-200"
          variants={itemVariants}
        >
          <p className="text-gray-500 text-sm">
            © 2024 Hash - Student-Run Clothing Brand. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
