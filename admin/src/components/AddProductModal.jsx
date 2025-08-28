import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { productsAPI, uploadAPI } from '../services/api';
import FileUpload from './FileUpload';
import toast from 'react-hot-toast';

const AddProductModal = ({ isOpen, onClose, onProductAdded, editProduct = null }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sku: '',
    variants: [], // New unified variant system
    sizeChart: {
      hasChart: false,
      chartType: 'clothing',
      measurements: [],
      guidelines: []
    },
    images: []
  });

  const categories = ['clothing', 'accessories', 'shoes', 'bags', 'electronics', 'home', 'beauty', 'sports'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '28', '30', '32', '34', '36', '38', '40', '42', '6', '7', '8', '9', '10', '11', '12', 'ONE_SIZE'];

  // Populate form data when editing
  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        description: editProduct.description || '',
        price: editProduct.price?.toString() || '',
        category: editProduct.category || '',
        stock: editProduct.stock?.toString() || '',
        sku: editProduct.sku || '',
        variants: editProduct.variants || [], // New variants system
        sizeChart: editProduct.sizeChart || {
          hasChart: false,
          chartType: 'clothing',
          measurements: [],
          guidelines: []
        },
        images: editProduct.images?.length > 0 ? [editProduct.images[0].url] : []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        sku: '',
        variants: [], // New variants system
        sizeChart: {
          hasChart: false,
          chartType: 'clothing',
          measurements: [],
          guidelines: []
        },
        images: []
      });
    }
  }, [editProduct, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // New variant management functions
  const handleVariantAdd = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { 
        size: '', 
        color: { name: '', hex: '#000000' }, 
        stock: 0, 
        price: '',
        sku: '' 
      }]
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => {
        if (i === index) {
          if (field === 'color.name' || field === 'color.hex') {
            const colorField = field.split('.')[1];
            return {
              ...variant,
              color: { ...variant.color, [colorField]: value }
            };
          }
          return { ...variant, [field]: value };
        }
        return variant;
      })
    }));
  };

  const handleVariantRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  // Calculate total stock from variants
  const calculateTotalStock = () => {
    console.log('calculateTotalStock called:');
    console.log('formData.variants.length:', formData.variants.length);
    console.log('formData.variants:', formData.variants);
    
    if (formData.variants.length > 0) {
      const total = formData.variants.reduce((total, variant) => {
        const variantStock = parseInt(variant.stock) || 0;
        console.log(`Variant ${variant.size}-${variant.color?.name}: stock = ${variantStock}`);
        return total + variantStock;
      }, 0);
      console.log('Total from variants:', total);
      return total;
    }
    
    const baseStock = parseInt(formData.stock) || 0;
    console.log('Using base stock:', baseStock);
    return baseStock;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started...');
    
    const totalStock = calculateTotalStock();
    console.log('Total stock calculated:', totalStock);
    
    // Validation
    if (!formData.name || !formData.price || !formData.category) {
      const missingFields = [];
      if (!formData.name) missingFields.push('Product Name');
      if (!formData.price) missingFields.push('Price');
      if (!formData.category) missingFields.push('Category');
      
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    // Check if stock is provided either via variants or base stock
    if (totalStock === 0) {
      toast.error('Please add stock either through variants or base stock field');
      return;
    }

    console.log('Validation passed, proceeding with submission...');

    try {
      setLoading(true);
      
      let uploadedFiles = [];
      
      // Upload files if any are selected
      if (selectedFiles.length > 0) {
        setUploading(true);
        try {
          const uploadResponse = await uploadAPI.uploadProductFiles(selectedFiles);
          uploadedFiles = uploadResponse.data.files;
          toast.success(`${uploadedFiles.length} files uploaded successfully`);
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
          toast.error('Failed to upload files');
          setUploading(false);
          setLoading(false);
          return;
        }
        setUploading(false);
      }
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: formData.variants.length > 0 ? calculateTotalStock() : parseInt(formData.stock),
        sku: formData.sku || `SKU-${Date.now()}`,
        // Process variants with proper data types
        variants: formData.variants.map(variant => ({
          size: variant.size,
          color: {
            name: variant.color.name || '',
            hex: variant.color.hex || '#000000'
          },
          stock: parseInt(variant.stock) || 0,
          price: variant.price ? parseFloat(variant.price) : undefined,
          sku: variant.sku || ''
        })),
        images: uploadedFiles.length > 0 
          ? uploadedFiles.map((file, index) => ({
              url: file.url,
              publicId: file.publicId,
              alt: formData.name || '',
              isPrimary: index === 0,
              type: file.type,
              format: file.format
            }))
          : formData.images.length > 0 && formData.images[0] 
            ? [{ url: formData.images[0], alt: formData.name || '', isPrimary: true }]
            : [{ url: 'https://via.placeholder.com/400x500', alt: 'Product image', isPrimary: true }]
      };

      console.log('=== ADMIN PANEL - SENDING DATA ===');
      console.log('Product Data Structure:', JSON.stringify(productData, null, 2));
      console.log('Variants Array:', productData.variants);
      console.log('Variants Length:', productData.variants.length);
      console.log('Individual Variants:');
      productData.variants.forEach((variant, index) => {
        console.log(`Variant ${index}:`, variant);
      });

      let response;
      if (editProduct) {
        // Update existing product
        response = await productsAPI.updateProduct(editProduct._id, productData);
        console.log('Product update response:', response);
        toast.success('Product updated successfully');
      } else {
        // Create new product
        response = await productsAPI.createProduct(productData);
        console.log('Product creation response:', response);
        toast.success('Product added successfully');
      }
      
      if (onProductAdded) {
        onProductAdded(response.data?.product || response.data);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(editProduct ? 'Failed to update product' : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      sku: '',
      variants: [],
      sizeChart: {
        hasChart: false,
        chartType: 'clothing',
        measurements: [],
        guidelines: []
      },
      images: []
    });
    setSelectedFiles([]);
    setUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <Input
                    type="number"
                    value={formData.variants.length > 0 ? calculateTotalStock() : formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="0"
                    required={formData.variants.length === 0}
                    disabled={formData.variants.length > 0}
                    className={formData.variants.length > 0 ? 'bg-gray-100' : ''}
                  />
                  {formData.variants.length > 0 && (
                    <div className="mt-1 text-xs text-blue-600">
                      Stock is automatically calculated from variants: {calculateTotalStock()} units
                    </div>
                  )}
                </div>
              </div>

              {/* New Product Variants System - Size + Color + Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Variants (Size + Color + Stock)
                </label>
                <div className="space-y-3">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 p-3 border border-gray-200 rounded-lg">
                      {/* Size Selection */}
                      <div className="col-span-2">
                        <Select 
                          value={variant.size} 
                          onValueChange={(value) => handleVariantChange(index, 'size', value)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSizes.map(size => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Color Name */}
                      <div className="col-span-3">
                        <Input
                          placeholder="Color name"
                          value={variant.color.name}
                          onChange={(e) => handleVariantChange(index, 'color.name', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      
                      {/* Color Picker */}
                      <div className="col-span-1">
                        <Input
                          type="color"
                          value={variant.color.hex}
                          onChange={(e) => handleVariantChange(index, 'color.hex', e.target.value)}
                          className="w-full h-9 p-1 border border-gray-300 rounded"
                        />
                      </div>
                      
                      {/* Stock */}
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Stock"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                          className="h-9"
                        />
                      </div>
                      
                      {/* Price (optional) */}
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      
                      {/* SKU (optional) */}
                      <div className="col-span-1">
                        <Input
                          placeholder="SKU"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      
                      {/* Remove Button */}
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleVariantRemove(index)}
                          className="text-red-600 hover:text-red-700 w-full h-9"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVariantAdd}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Size-Color-Stock Combination
                  </Button>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-400 mb-1">
                    <div className="col-span-2">Size</div>
                    <div className="col-span-3">Color Name</div>
                    <div className="col-span-1">Hex</div>
                    <div className="col-span-2">Stock</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-1">SKU</div>
                    <div className="col-span-1"></div>
                  </div>
                  Create specific combinations of size and color with individual stock levels. Total stock will be calculated automatically.
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images & Videos
                </label>
                <FileUpload
                  onFilesSelected={setSelectedFiles}
                  maxFiles={6}
                  acceptedTypes={['image/*', 'video/*']}
                />
                {formData.images.length > 0 && formData.images[0] && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">Current image:</p>
                    <p className="text-xs text-blue-600 break-all">{formData.images[0]}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading || uploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {uploading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading files...
                    </div>
                  ) : loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editProduct ? 'Updating...' : 'Adding...'}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      {editProduct ? 'Update Product' : 'Add Product'}
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddProductModal;
