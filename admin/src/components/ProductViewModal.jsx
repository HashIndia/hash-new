import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Tag, Layers, Star, Eye, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const ProductViewModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const stockStatus = getStockStatus(product.stock || 0);

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
          className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Images Section - Smaller column */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Product Media ({product.images?.length || 0})
                </h3>
                
                {product.images && product.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative group">
                        {image.type === 'video' ? (
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <video
                              src={image.url || image}
                              controls
                              className="w-full h-full object-cover"
                              poster={`${image.url || image}?resource_type=video&format=jpg`}
                            >
                              Your browser does not support the video tag.
                            </video>
                            <div className="absolute top-1 left-1">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                <Video className="w-2 h-2 mr-1" />
                                Video
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                            <img
                              src={image.url || image}
                              alt={`${product.name} - ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Found';
                              }}
                            />
                            {image.isPrimary && (
                              <div className="absolute top-1 left-1">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  <Star className="w-2 h-2 mr-1" />
                                  Primary
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No images available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Details - Larger column */}
              <div className="lg:col-span-3 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${stockStatus.color}`}>
                      {stockStatus.label}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800 capitalize">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Pricing</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">₹{product.price}</p>
                  </Card>

                  <Card className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4" />
                      <h3 className="font-semibold text-sm">Stock</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{product.stock || 0}</p>
                    <p className="text-xs text-gray-500">units available</p>
                  </Card>
                </div>

                {product.description && (
                  <Card className="p-3">
                    <h3 className="font-semibold text-sm mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
                  </Card>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="font-medium text-gray-700 text-sm">SKU:</span>
                    <span className="text-gray-900 font-mono text-sm">{product.sku}</span>
                  </div>
                  
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="font-medium text-gray-700 text-sm">Available Sizes:</span>
                      <div className="flex gap-1">
                        {product.sizes.map((size, index) => (
                          <span key={index} className="px-1.5 py-0.5 text-xs border rounded">{size}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="font-medium text-gray-700 text-sm">Created:</span>
                    <span className="text-gray-900 text-sm">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-1.5">
                    <span className="font-medium text-gray-700 text-sm">Last Updated:</span>
                    <span className="text-gray-900 text-sm">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductViewModal;
