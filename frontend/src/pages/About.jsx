import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { Users, Award, Globe, Heart } from "lucide-react";
import AboutImageSlider from "../components/common/AboutImageSlider";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const coreTeamMembers = [
  {
    name: "Sutirth",
    role: "Founder",
    linkedin: "https://linkedin.com/in/sutirth-naik-689818297",
    img: "https://media.licdn.com/dms/image/v2/D5603AQEVtTiWrnT9vg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718231799800?e=2147483647&v=beta&t=uKTyC4gipnxNS9zFAbIp0tZ9JpeI7ffUCgADYCKFBUk",
  },
  {
    name: "Ankit",
    role: "Co-Founder",
    linkedin: "https://linkedin.com/in/ankit-sharma-3aba76325",
    img: "https://media.licdn.com/dms/image/v2/D4E03AQGxCkV1cum3SQ/profile-displayphoto-shrink_400_400/B4EZYcdlfAG0Ag-/0/1744234243489?e=1761782400&v=beta&t=HH0k257p9tyoGzdwxPeAe3pwFrSPr95AoSgwOBeN6OU",
  },
  {
    name: "Prajwal ",
    role: "Web Developer",
    linkedin: "https://linkedin.com/in/prajwal-ambekar-21b955286",
    img: "https://media.licdn.com/dms/image/v2/D5603AQHJ_hxqLwGEpQ/profile-displayphoto-scale_200_200/B56ZkoOLZTJoAY-/0/1757316431860?e=2147483647&v=beta&t=SHCBwBurG2RjmIu3to6SWCkStjqCglA8bARyxDCCOQ4",
  },
  {
    name: "Artharva",
    role: "Video Editor",
    linkedin: "https://linkedin.com/in/atharva-muthal-508187291",
    img: "https://placehold.co/120x120/f8fafc/222?text=AR",
  },
  {
    name: "Nikhil",
    role: "Media Head",
    linkedin: "https://linkedin.com/in/nikhil-ranganekar-a63b88221",
    img: "https://media.licdn.com/dms/image/v2/D5603AQHMNxlpWPBHuw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1708161089934?e=1761782400&v=beta&t=mdCF9caWRbJRgRLp_kZJCHKoajnPACNihIiI72wLtF4",
  },
];

export default function About() {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation after page loads
    if (location.hash === '#core-team') {
      const element = document.getElementById('core-team');
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

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
      <SEO 
        title="About HASH India - Premium Fashion Brand Story"
        description="Learn about HASH India's journey in premium fashion. Discover our commitment to quality, style, and innovation in men's and women's clothing. Founded with passion for fashion excellence."
        keywords="HASH India about, fashion brand story, premium clothing brand, fashion company India, HASH India history, quality fashion, brand values"
        url="https://hashindia.com/about"
        canonicalUrl="https://hashindia.com/about"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About HASH India",
          "description": "Learn about HASH India's journey in premium fashion and our commitment to quality.",
          "url": "https://hashindia.com/about",
          "mainEntity": {
            "@type": "Organization",
            "name": "HASH India",
            "description": "Premium fashion brand committed to quality, style, and innovation",
            "foundingDate": "2020",
            "areaServed": "India"
          }
        }}
      />
      {/* Header Section */}
      <div className="bg-black text-white py-16">
        <motion.div 
          className="container mx-auto px-6 max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-light mb-4">About Us</h1>
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
        {/* Story Section with Image Slider */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-black bg-white">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-semibold text-black mb-6">Our Story</h2>
                  <p className="text-black mb-6 leading-relaxed">
                    Founded in 2023, Hash began as a passion project by four first-year students at NITK Surathkal - 
                    Hrishab, Ankit, Sutirth, and Himanshu. What started as a simple idea to create cool merchandise 
                    for college events has grown into a thriving student-run clothing brand.
                  </p>
                  <p className="text-black mb-6 leading-relaxed">
                    Now led by Ankit and Sutirth (both 3rd-year students), Hash has become the go-to brand for college 
                    merchandise, partnering with various clubs for their t-shirts and major college festivals like 
                    Incident (cultural fest) and Engineer (technical fest).
                  </p>
                  <p className="text-black leading-relaxed">
                    While we primarily serve NITK students, we've expanded to deliver our unique designs across India 
                    through postal services. Our mission is to create affordable, quality clothing that represents 
                    the spirit of student life and creativity.
                  </p>
                  <div className="mt-8 pt-8 border-t border-black">
                    <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
                    <p className="text-black leading-relaxed mb-4">
                      To provide high-quality, affordable clothing and merchandise that celebrates student life, 
                      creativity, and college spirit while building a sustainable student-run business that 
                      inspires other young entrepreneurs.
                    </p>
                    <div className="text-sm text-black">
                      <strong className="text-black">Owned & Operated by:</strong> Orca Whale INC
                    </div>
                    <div className="text-xs text-black mt-1">
                      Registered business entity for Hash brand operations
                    </div>
                  </div>
                </div>
                <div className="h-[600px]">
                  <AboutImageSlider />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>        {/* Values Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-black mb-4">Our Values</h2>
            <p className="text-black max-w-2xl mx-auto">
              The principles that guide everything we do at Hash
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 border border-black bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-black mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-black leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 font-space">
              Our <span className="text-black/80">Core Team</span>
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
              Meet the student entrepreneurs behind Hash
            </p>
          </div>

          {/* First Row - Core Leaders */}
          <div className="grid grid-cols-2 gap-4 sm:gap-4 md:gap-8 mb-6 sm:mb-8 justify-center max-w-4xl mx-auto">
            {coreTeamMembers.slice(0, 2).map((member, idx) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.06, boxShadow: "0 18px 35px rgba(0,0,0,0.12)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="relative overflow-hidden flex flex-col items-center bg-neutral-50 border border-neutral-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow hover:shadow-xl hover:border-black/20 transition-all duration-300 group h-full"
              >
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-4"
                >
                  <motion.img
                    src={member.img}
                    alt={member.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-neutral-200 shadow object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 16 }}
                  />
                </a>
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-bold text-neutral-900 mt-2 font-space group-hover:text-black transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm md:text-base text-neutral-500 font-medium mb-2">
                    {member.role}
                  </p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-neutral-700 font-semibold hover:underline text-xs md:text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 10.268h-3v-4.604c0-1.099-.021-2.513-1.531-2.513-1.531 0-1.767 1.197-1.767 2.434v4.683h-3v-9h2.881v1.229h.041c.401-.761 1.379-1.563 2.841-1.563 3.041 0 3.601 2.002 3.601 4.604v4.73z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Second Row - Team Members */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 justify-center max-w-6xl mx-auto">
            {coreTeamMembers.slice(2).map((member, idx) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.06, boxShadow: "0 18px 35px rgba(0,0,0,0.12)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="relative overflow-hidden flex flex-col items-center bg-neutral-50 border border-neutral-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow hover:shadow-xl hover:border-black/20 transition-all duration-300 group h-full"
              >
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-4"
                >
                  <motion.img
                    src={member.img}
                    alt={member.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-neutral-200 shadow object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 16 }}
                  />
                </a>
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-bold text-neutral-900 mt-2 font-space group-hover:text-black transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm md:text-base text-neutral-500 font-medium mb-2">
                    {member.role}
                  </p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-neutral-700 font-semibold hover:underline text-xs md:text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 10.268h-3v-4.604c0-1.099-.021-2.513-1.531-2.513-1.531 0-1.767 1.197-1.767 2.434v4.683h-3v-9h2.881v1.229h.041c.401-.761 1.379-1.563 2.841-1.563 3.041 0 3.601 2.002 3.601 4.604v4.73z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Our Family Section */}
        <motion.div variants={itemVariants} className="mb-16 overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 font-space">
              Our <span className="text-black/80">Family</span>
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto">
              Meet our amazing customers who make us who we are
            </p>
          </div>

          <motion.div
            initial={{ x: "100%" }}
            animate={{ 
              x: "-100%",
              transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            className="flex gap-8"
          >
            {[...Array(2)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex gap-8 min-w-max">
                <motion.div
                  className="relative overflow-hidden flex flex-col items-center bg-neutral-50 border border-neutral-100 rounded-2xl p-6 shadow hover:shadow-xl hover:border-black/20 transition-all duration-300 group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200"
                    alt="John Doe"
                    className="w-24 h-24 rounded-full border-4 border-neutral-200 shadow object-cover mb-4"
                  />
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">John Doe</h3>
                  <p className="text-neutral-500 text-sm mb-4">Loyal Customer</p>
                  <p className="text-neutral-600 italic text-center max-w-xs">
                    "Hash has been my go-to brand for college wear. The quality and designs are unmatched!"
                  </p>
                </motion.div>

                <motion.div
                  className="relative overflow-hidden flex flex-col items-center bg-neutral-50 border border-neutral-100 rounded-2xl p-6 shadow hover:shadow-xl hover:border-black/20 transition-all duration-300 group"
                >
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200"
                    alt="Jane Smith"
                    className="w-24 h-24 rounded-full border-4 border-neutral-200 shadow object-cover mb-4"
                  />
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Jane Smith</h3>
                  <p className="text-neutral-500 text-sm mb-4">Brand Ambassador</p>
                  <p className="text-neutral-600 italic text-center max-w-xs">
                    "Being part of the Hash family has been an amazing journey. Their passion for fashion is inspiring!"
                  </p>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Contact Information */}
        <motion.div variants={itemVariants}>
          <Card className="border border-black bg-white">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold text-black mb-4">Get in Touch</h2>
                <p className="text-black">
                  We'd love to hear from you. Reach out to our team anytime.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Location</h3>
                  <p className="text-black">NITK Surathkal Campus</p>
                  <p className="text-black">Surathkal, Karnataka 575025</p>
                  <p className="text-black">India</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Contact</h3>
                  <p className="text-black">Ankit: +91 9460262940</p>
                  <p className="text-black">Sutirth: +91 9740452365</p>
                  <p className="text-black">Email: (Coming soon)</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Business</h3>
                  <p className="text-black">Orca Whale INC</p>
                  <p className="text-black">Registered Enterprise</p>
                  <p className="text-black">Founded: 2023</p>
                  <p className="text-black">Delivery: All India via Post</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
