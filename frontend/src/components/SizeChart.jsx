import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const SizeChart = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product?.sizeChart?.hasChart) return null;

  const { sizeChart } = product;
  const { chartType, measurements = [], guidelines = [] } = sizeChart;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-hash-purple" />
                <h3 className="text-xl font-semibold text-black">
                  Size Chart - {product.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guidelines */}
            {guidelines.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Sizing Guidelines:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  {guidelines.map((guideline, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {guideline}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Visual Size Guide */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 mb-3">Visual Size Guide:</h4>
              <div className="relative bg-white rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                <img 
                  src="https://i.imgur.com/9JS7Yq6.png" 
                  alt="T-Shirt Measurement Guide" 
                  className="w-full object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 text-center">
                  Reference image: Standard T-shirt measurements
                </div>
              </div>
            </div>

            {/* Standard Size Guide */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-black px-4 py-3 text-left font-medium text-black">Size</th>
                    <th className="border border-black px-4 py-3 text-left font-medium text-black">Chest (in)</th>
                    <th className="border border-black px-4 py-3 text-left font-medium text-black">Length (in)</th>
                    <th className="border border-black px-4 py-3 text-left font-medium text-black">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-black px-4 py-3 font-medium text-black">S</td>
                    <td className="border border-black px-4 py-3 text-black">36-38</td>
                    <td className="border border-black px-4 py-3 text-black">27</td>
                    <td className="border border-black px-4 py-3 text-black">17</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-black px-4 py-3 font-medium text-black">M</td>
                    <td className="border border-black px-4 py-3 text-black">38-40</td>
                    <td className="border border-black px-4 py-3 text-black">28</td>
                    <td className="border border-black px-4 py-3 text-black">18</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-black px-4 py-3 font-medium text-black">L</td>
                    <td className="border border-black px-4 py-3 text-black">40-42</td>
                    <td className="border border-black px-4 py-3 text-black">29</td>
                    <td className="border border-black px-4 py-3 text-black">19</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-black px-4 py-3 font-medium text-black">XL</td>
                    <td className="border border-black px-4 py-3 text-black">42-44</td>
                    <td className="border border-black px-4 py-3 text-black">30</td>
                    <td className="border border-black px-4 py-3 text-black">20</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-black px-4 py-3 font-medium text-black">XXL</td>
                    <td className="border border-black px-4 py-3 text-black">44-46</td>
                    <td className="border border-black px-4 py-3 text-black">31</td>
                    <td className="border border-black px-4 py-3 text-black">21</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* How to Measure */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">How to Measure:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape parallel to the ground.
                </div>
                <div>
                  <strong>Length:</strong> Measure from the highest point of the shoulder to the desired length.
                </div>
                <div>
                  <strong>Shoulder:</strong> Measure from one shoulder point to another, across the back.
                </div>
                <div className="md:col-span-2 mt-2 p-3 bg-yellow-50 rounded-lg text-yellow-800 text-xs">
                  <strong>Pro Tip:</strong> If you're between sizes, we recommend going up a size for a more comfortable fit.
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SizeChart;
