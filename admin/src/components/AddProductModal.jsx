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
    sizeVariants: [],
    colors: [],
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
        sizeVariants: editProduct.sizeVariants || [],
        colors: editProduct.colors || [],
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
        sizeVariants: [],
        colors: [],
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

  const handleSizeVariantAdd = () => {
    setFormData(prev => ({
      ...prev,
      sizeVariants: [...prev.sizeVariants, { size: '', stock: 0, price: '' }]
    }));
  };

  const handleSizeVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sizeVariants: prev.sizeVariants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const handleSizeVariantRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      sizeVariants: prev.sizeVariants.filter((_, i) => i !== index)
    }));
  };

  const handleColorAdd = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: '', hex: '#000000', images: [] }]
    }));
  };

  const handleColorChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }));
  };

  const handleColorRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes?.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...(prev.sizes || []), size]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

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
        stock: parseInt(formData.stock),
        sku: formData.sku || `SKU-${Date.now()}`,
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
      sizeVariants: [],
      colors: [],
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
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size Variants with Stock
                </label>
                <div className="space-y-3">
                  {formData.sizeVariants.map((variant, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <Select 
                        value={variant.size} 
                        onValueChange={(value) => handleSizeVariantChange(index, 'size', value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSizes.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Input
                        type="number"
                        placeholder="Stock"
                        value={variant.stock}
                        onChange={(e) => handleSizeVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                      
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Price (optional)"
                        value={variant.price}
                        onChange={(e) => handleSizeVariantChange(index, 'price', e.target.value)}
                        className="w-32"
                      />
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleSizeVariantRemove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSizeVariantAdd}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Size Variant
                  </Button>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  Add different sizes with individual stock quantities. Leave price empty to use base price.
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Variants
                </label>
                <div className="space-y-3">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <Input
                        placeholder="Color name"
                        value={color.name}
                        onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                        className="flex-1"
                      />
                      
                      <Input
                        type="color"
                        value={color.hex}
                        onChange={(e) => handleColorChange(index, 'hex', e.target.value)}
                        className="w-16"
                      />
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleColorRemove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleColorAdd}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Color Variant
                  </Button>
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
