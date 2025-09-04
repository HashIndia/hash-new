import { Card, CardContent } from "../components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Ruler, User, Shirt, PenTool, AlertCircle, CheckCircle } from "lucide-react";

export default function SizeGuide() {
  const [selectedCategory, setSelectedCategory] = useState('men');

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

  const categories = [
    { id: 'men', name: 'Men', icon: User },
    { id: 'women', name: 'Women', icon: User },
    { id: 'kids', name: 'Kids', icon: User }
  ];

  const sizeCharts = {
    men: {
      tops: [
        { size: 'XS', chest: '34-36', waist: '28-30', length: '26' },
        { size: 'S', chest: '36-38', waist: '30-32', length: '27' },
        { size: 'M', chest: '38-40', waist: '32-34', length: '28' },
        { size: 'L', chest: '40-42', waist: '34-36', length: '29' },
        { size: 'XL', chest: '42-44', waist: '36-38', length: '30' },
        { size: '2XL', chest: '44-46', waist: '38-40', length: '31' },
        { size: '3XL', chest: '46-48', waist: '40-42', length: '32' }
      ],
      bottoms: [
        { size: '28', waist: '28', hip: '36', inseam: '32' },
        { size: '30', waist: '30', hip: '38', inseam: '32' },
        { size: '32', waist: '32', hip: '40', inseam: '32' },
        { size: '34', waist: '34', hip: '42', inseam: '32' },
        { size: '36', waist: '36', hip: '44', inseam: '32' },
        { size: '38', waist: '38', hip: '46', inseam: '32' },
        { size: '40', waist: '40', hip: '48', inseam: '32' }
      ]
    },
    women: {
      tops: [
        { size: 'XS', bust: '32-34', waist: '24-26', hip: '34-36', length: '24' },
        { size: 'S', bust: '34-36', waist: '26-28', hip: '36-38', length: '25' },
        { size: 'M', bust: '36-38', waist: '28-30', hip: '38-40', length: '26' },
        { size: 'L', bust: '38-40', waist: '30-32', hip: '40-42', length: '27' },
        { size: 'XL', bust: '40-42', waist: '32-34', hip: '42-44', length: '28' },
        { size: '2XL', bust: '42-44', waist: '34-36', hip: '44-46', length: '29' },
        { size: '3XL', bust: '44-46', waist: '36-38', hip: '46-48', length: '30' }
      ],
      bottoms: [
        { size: 'XS', waist: '24-26', hip: '34-36', inseam: '30' },
        { size: 'S', waist: '26-28', hip: '36-38', inseam: '30' },
        { size: 'M', waist: '28-30', hip: '38-40', inseam: '30' },
        { size: 'L', waist: '30-32', hip: '40-42', inseam: '30' },
        { size: 'XL', waist: '32-34', hip: '42-44', inseam: '30' },
        { size: '2XL', waist: '34-36', hip: '44-46', inseam: '30' },
        { size: '3XL', waist: '36-38', hip: '46-48', inseam: '30' }
      ]
    },
    kids: {
      tops: [
        { size: '2-3Y', chest: '20-21', height: '35-38' },
        { size: '4-5Y', chest: '22-23', height: '39-42' },
        { size: '6-7Y', chest: '24-25', height: '43-46' },
        { size: '8-9Y', chest: '26-27', height: '47-50' },
        { size: '10-11Y', chest: '28-29', height: '51-54' },
        { size: '12-13Y', chest: '30-31', height: '55-58' }
      ],
      bottoms: [
        { size: '2-3Y', waist: '19-20', height: '35-38' },
        { size: '4-5Y', waist: '21-22', height: '39-42' },
        { size: '6-7Y', waist: '23-24', height: '43-46' },
        { size: '8-9Y', waist: '25-26', height: '47-50' },
        { size: '10-11Y', waist: '27-28', height: '51-54' },
        { size: '12-13Y', waist: '29-30', height: '55-58' }
      ]
    }
  };

  const measurementTips = [
    {
      icon: Ruler,
      title: "Use a Measuring Tape",
      description: "Use a soft measuring tape for accurate measurements. If you don't have one, use a string and measure it against a ruler."
    },
    {
      icon: User,
      title: "Measure Over Undergarments",
      description: "For the most accurate fit, measure over your undergarments or form-fitting clothes."
    },
    {
      icon: Shirt,
      title: "Stand Naturally",
      description: "Stand in a natural, relaxed position. Don't hold your breath or pull the tape too tight."
    },
    {
      icon: PenTool,
      title: "Write It Down",
      description: "Record your measurements and refer to our size charts for each product category."
    }
  ];

  const fitTips = [
    "If you're between sizes, we recommend sizing up for a more comfortable fit",
    "Check the product description for specific fit information (slim, regular, oversized)",
    "Different brands may have slight variations in sizing",
    "Consider the fabric - stretchy materials may fit differently than rigid ones",
    "When in doubt, contact our customer support for personalized sizing advice"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
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
            <p className="text-gray-300 text-sm tracking-[0.15em] uppercase mb-8">Fit Guide</p>
            <h2 className="text-3xl md:text-4xl font-light mb-4">Size Guide</h2>
            <p className="text-gray-400">Find your perfect fit with our detailed sizing charts</p>
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
        {/* How to Measure */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">How to Measure</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {measurementTips.map((tip, index) => (
              <Card key={index} className="border border-border shadow-sm text-center">
                <CardContent className="p-6">
                  <tip.icon className="w-12 h-12 text-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-3">{tip.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Category Selection */}
        <motion.div variants={itemVariants} className="mb-12">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-center">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-black text-white'
                          : 'text-gray-600 hover:text-foreground'
                      }`}
                    >
                      <category.icon className="w-5 h-5 mr-2" />
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Size Charts */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tops Size Chart */}
            <Card className="border border-border shadow-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Tops
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-foreground font-semibold">Size</th>
                        {Object.keys(sizeCharts[selectedCategory].tops[0]).slice(1).map(key => (
                          <th key={key} className="text-center py-3 px-2 text-foreground font-semibold capitalize">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sizeCharts[selectedCategory].tops.map((size, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 px-2 font-medium text-foreground">{size.size}</td>
                          {Object.values(size).slice(1).map((value, i) => (
                            <td key={i} className="py-3 px-2 text-center text-muted-foreground">{value}"</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Bottoms Size Chart */}
            <Card className="border border-border shadow-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Bottoms
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-foreground font-semibold">Size</th>
                        {Object.keys(sizeCharts[selectedCategory].bottoms[0]).slice(1).map(key => (
                          <th key={key} className="text-center py-3 px-2 text-foreground font-semibold capitalize">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sizeCharts[selectedCategory].bottoms.map((size, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 px-2 font-medium text-foreground">{size.size}</td>
                          {Object.values(size).slice(1).map((value, i) => (
                            <td key={i} className="py-3 px-2 text-center text-muted-foreground">{value}"</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Fit Tips */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-border shadow-sm bg-muted">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6 text-center flex items-center justify-center">
                <AlertCircle className="w-6 h-6 mr-2" />
                Fit Tips & Guidelines
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Sizing Guidelines</h4>
                  <ul className="space-y-3">
                    {fitTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">Measurement Points</h4>
                  <div className="space-y-3 text-muted-foreground">
                    <p><strong>Chest/Bust:</strong> Measure around the fullest part</p>
                    <p><strong>Waist:</strong> Measure around the narrowest part</p>
                    <p><strong>Hip:</strong> Measure around the fullest part of hips</p>
                    <p><strong>Inseam:</strong> Measure from crotch to ankle</p>
                    <p><strong>Length:</strong> Measure from shoulder to hem</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Size Conversion Chart */}
        <motion.div variants={itemVariants} className="mb-16">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">International Size Conversion</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-foreground font-semibold">India</th>
                      <th className="text-center py-3 px-4 text-foreground font-semibold">US</th>
                      <th className="text-center py-3 px-4 text-foreground font-semibold">UK</th>
                      <th className="text-center py-3 px-4 text-foreground font-semibold">EU</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium text-foreground">XS</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">XS</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">6</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">32</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium text-foreground">S</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">S</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">8</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">34</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium text-foreground">M</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">M</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">10</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">36</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium text-foreground">L</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">L</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">12</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">38</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 font-medium text-foreground">XL</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">XL</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">14</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">40</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Support */}
        <motion.div variants={itemVariants}>
          <Card className="border border-border shadow-sm">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-foreground mb-4">Need Help with Sizing?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our customer support team is here to help you find the perfect fit. 
                Contact us for personalized sizing recommendations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => window.open('https://wa.me/919876543210')}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Support
                </button>
                <button 
                  onClick={() => window.open('mailto:support@hash.com')}
                  className="border border-black text-foreground hover:bg-black hover:text-white px-6 py-3 rounded-lg flex items-center transition-colors"
                >
                  Email Support
                </button>
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
