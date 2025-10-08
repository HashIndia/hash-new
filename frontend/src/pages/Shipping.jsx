import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { Truck, Clock, Globe, Shield, Package, MapPin, CreditCard, CheckCircle } from "lucide-react";

export default function Shipping() {
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

  const shippingOptions = [
    {
      icon: MapPin,
      title: "Campus Delivery",
      time: "1-2 Days",
      cost: "Free",
      description: "Direct delivery within NITK Surathkal campus"
    },
    {
      icon: Truck,
      title: "Local Delivery",
      time: "2-4 Business Days",
      cost: "₹50",
      description: "Delivery within Mangalore and surrounding areas"
    },
    {
      icon: Package,
      title: "India Post",
      time: "5-10 Business Days",
      cost: "₹100-200",
      description: "Reliable delivery across India via postal service"
    },
    {
      icon: Clock,
      title: "Express Courier",
      time: "2-5 Business Days",
      cost: "₹150-300",
      description: "Faster delivery for urgent orders"
    }
  ];

  const zones = [
    {
      zone: "NITK Campus",
      cities: "All hostels, academic blocks, and residential areas",
      standard: "1-2 days",
      express: "Same day"
    },
    {
      zone: "Mangalore Region",
      cities: "Mangalore, Udupi, Manipal, Surathkal",
      standard: "2-4 days",
      express: "1-2 days"
    },
    {
      zone: "Karnataka State",
      cities: "Bangalore, Mysore, Hubli, Belgaum, other Karnataka cities",
      standard: "5-8 days",
      express: "3-5 days"
    },
    {
      zone: "Pan India",
      cities: "All major cities and towns across India",
      standard: "7-10 days",
      express: "5-7 days"
    }
  ];

  const trackingSteps = [
    { step: "Order Confirmed", description: "Your order has been received by our team" },
    { step: "Processing", description: "We're preparing your order for shipment" },
    { step: "Shipped", description: "Your package has been handed over to our delivery partner" },
    { step: "Delivered", description: "Your package has been successfully delivered" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white text-black border-b border-black py-16">
        <motion.div 
          className="container mx-auto px-6 max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl md:text-4xl font-light mb-4">Shipping & Delivery</h1>
            <p className="text-black">Fast, reliable delivery to your doorstep</p>
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
        {/* Shipping Options */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-semibold text-black mb-8 text-center">Shipping Options</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shippingOptions.map((option, index) => (
              <Card key={index} className="border border-black shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <option.icon className="w-12 h-12 text-black mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">{option.title}</h3>
                  <p className="text-hash-purple font-medium mb-2">{option.time}</p>
                  <p className="text-black font-medium mb-3">{option.cost}</p>
                  <p className="text-black text-sm">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Delivery Zones */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-black shadow-sm">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-semibold text-black mb-8 text-center">Delivery Zones & Timeline</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-black">
                      <th className="text-left py-4 px-4 text-black font-semibold">Delivery Zone</th>
                      <th className="text-left py-4 px-4 text-black font-semibold">Locations</th>
                      <th className="text-center py-4 px-4 text-black font-semibold">Standard</th>
                      <th className="text-center py-4 px-4 text-black font-semibold">Express</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((zone, index) => (
                      <tr key={index} className="border-b border-black">
                        <td className="py-4 px-4 font-medium text-black">{zone.zone}</td>
                        <td className="py-4 px-4 text-black">{zone.cities}</td>
                        <td className="py-4 px-4 text-center text-green-600 font-medium">{zone.standard}</td>
                        <td className="py-4 px-4 text-center text-blue-600 font-medium">{zone.express}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shipping Costs */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Domestic Shipping */}
            <Card className="border border-black shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <MapPin className="w-6 h-6 text-black mr-3" />
                  <h3 className="text-2xl font-semibold text-black">Domestic Shipping</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-black">
                    <span className="text-black">Orders below ₹999</span>
                    <span className="font-medium text-black">₹99</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-black">
                    <span className="text-black">Orders ₹999 & above</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-black">
                    <span className="text-black">Express Shipping</span>
                    <span className="font-medium text-black">₹199</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-black">Same Day Delivery</span>
                    <span className="font-medium text-black">₹399</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* International Shipping */}
            <Card className="border border-black shadow-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Globe className="w-6 h-6 text-black mr-3" />
                  <h3 className="text-2xl font-semibold text-black">International Shipping</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-black">
                    <span className="text-black">Asia Pacific</span>
                    <span className="font-medium text-black">₹1,999</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-black">
                    <span className="text-black">Europe & UK</span>
                    <span className="font-medium text-black">₹2,499</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-black">
                    <span className="text-black">North America</span>
                    <span className="font-medium text-black">₹2,999</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-black">Other Countries</span>
                    <span className="font-medium text-black">₹3,499</span>
                  </div>
                </div>
                <p className="text-sm text-black mt-4">
                  * Customs duties and taxes are additional and paid by recipient
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Order Tracking */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-black shadow-sm">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-semibold text-black mb-8 text-center">Order Tracking</h2>
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-4 gap-6">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-hash-dark via-background to-card text-black border-b border-black rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-lg font-semibold">{index + 1}</span>
                        </div>
                        {index < trackingSteps.length - 1 && (
                          <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gray-300 transform translate-x-6"></div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-black mb-2">{step.step}</h3>
                      <p className="text-black text-sm">{step.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-6 bg-white rounded-lg">
                  <p className="text-black text-center">
                    Track your order anytime by logging into your account or using the tracking link sent to your email.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Important Information */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-black shadow-sm bg-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-black mb-6">Important Shipping Information</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Packaging & Handling
                  </h3>
                  <ul className="space-y-2 text-black">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      All items are carefully packaged to prevent damage
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      Eco-friendly packaging materials used
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      Fragile items receive extra protection
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      Discreet packaging for privacy
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment & Processing
                  </h3>
                  <ul className="space-y-2 text-black">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      Orders processed within 24 hours of payment
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      Payment verification may cause delays
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      Custom orders have longer processing times
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      Weekend orders processed on next business day
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Special Services */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-black shadow-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-black mb-6">Special Delivery Services</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border border-black rounded-lg">
                  <Shield className="w-10 h-10 text-black mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-black mb-2">Signature Required</h3>
                  <p className="text-black text-sm">
                    For high-value orders, signature confirmation required for delivery
                  </p>
                </div>
                <div className="text-center p-4 border border-black rounded-lg">
                  <Clock className="w-10 h-10 text-black mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-black mb-2">Scheduled Delivery</h3>
                  <p className="text-black text-sm">
                    Choose your preferred delivery date and time slot (premium service)
                  </p>
                </div>
                <div className="text-center p-4 border border-black rounded-lg">
                  <Package className="w-10 h-10 text-black mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-black mb-2">Gift Wrapping</h3>
                  <p className="text-black text-sm">
                    Professional gift wrapping service available for special occasions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
