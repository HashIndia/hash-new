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
          <Card className="p-6 bg-background">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-hash-purple" />
                <h3 className="text-xl font-semibold text-foreground">
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

            {/* Size Chart Table */}
            {measurements.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-4 py-3 text-left font-medium text-foreground">
                        Size
                      </th>
                      {chartType === 'clothing' && (
                        <>
                          <th className="border border-border px-4 py-3 text-left font-medium text-foreground">
                            Chest (cm)
                          </th>
                          <th className="border border-border px-4 py-3 text-left font-medium text-foreground">
                            Waist (cm)
                          </th>
                          <th className="border border-border px-4 py-3 text-left font-medium text-foreground">
                            Hips (cm)
                          </th>
                          <th className="border border-border px-4 py-3 text-left font-medium text-foreground">
                            Length (cm)
                          </th>
                          <th className="border border-border px-4 py-3 text-left font-medium text-foreground">
                            Shoulders (cm)
                          </th>
                          <th className="border border-border px-4 py-3 text-left font-medium text-foreground">
                            Sleeves (cm)
                          </th>
                        </>
                      )}
                      {chartType === 'shoes' && (
                        <>
                          <th className="border border-border px-4 py-3 text-left font-medium text-foreground">
                            Length (cm)
                          </th>
                          <th className="border border-border px-4 py-3 text-left font-medium text-foreground">
                            Width (cm)
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map((measurement, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                        <td className="border border-border px-4 py-3 font-medium text-foreground">
                          {measurement.size}
                        </td>
                        {chartType === 'clothing' && (
                          <>
                            <td className="border border-border px-4 py-3 text-muted-foreground">
                              {measurement.chest || '-'}
                            </td>
                            <td className="border border-border px-4 py-3 text-muted-foreground">
                              {measurement.waist || '-'}
                            </td>
                            <td className="border border-border px-4 py-3 text-muted-foreground">
                              {measurement.hips || '-'}
                            </td>
                            <td className="border border-border px-4 py-3 text-muted-foreground">
                              {measurement.length || '-'}
                            </td>
                            <td className="border border-border px-4 py-3 text-muted-foreground">
                              {measurement.shoulders || '-'}
                            </td>
                            <td className="border border-border px-4 py-3 text-muted-foreground">
                              {measurement.sleeves || '-'}
                            </td>
                          </>
                        )}
                        {chartType === 'shoes' && (
                          <>
                            <td className="border border-border px-4 py-3 text-muted-foreground">
                              {measurement.length || '-'}
                            </td>
                            <td className="border border-border px-4 py-3 text-muted-foreground">
                              {measurement.width || '-'}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* How to Measure */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">How to Measure:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                {chartType === 'clothing' && (
                  <>
                    <div>
                      <strong>Chest:</strong> Measure around the fullest part of your chest
                    </div>
                    <div>
                      <strong>Waist:</strong> Measure around your natural waistline
                    </div>
                    <div>
                      <strong>Hips:</strong> Measure around the fullest part of your hips
                    </div>
                    <div>
                      <strong>Length:</strong> Measure from shoulder to hem
                    </div>
                    <div>
                      <strong>Shoulders:</strong> Measure from shoulder seam to shoulder seam
                    </div>
                    <div>
                      <strong>Sleeves:</strong> Measure from shoulder to cuff
                    </div>
                  </>
                )}
                {chartType === 'shoes' && (
                  <>
                    <div>
                      <strong>Length:</strong> Measure from heel to longest toe
                    </div>
                    <div>
                      <strong>Width:</strong> Measure across the widest part of your foot
                    </div>
                  </>
                )}
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
