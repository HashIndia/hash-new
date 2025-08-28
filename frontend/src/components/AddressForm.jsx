import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddressForm({ onSubmit, onCancel, initialData = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'home',
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    line1: initialData?.line1 || '',
    line2: initialData?.line2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    pincode: initialData?.pincode || '',
    landmark: initialData?.landmark || '',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.line1.trim()) newErrors.line1 = 'Address line 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm border border-border shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-hash-purple via-hash-blue to-hash-purple text-white rounded-t-lg">
          <CardTitle className="font-space">{initialData ? 'Edit Address' : 'Add New Address'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Address Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 bg-background border border-border rounded-md text-foreground focus:border-hash-purple focus:outline-none"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Full Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={errors.name ? 'border-destructive' : 'border-border focus:border-hash-purple'}
                />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Phone Number</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={errors.phone ? 'border-destructive' : 'border-border focus:border-hash-purple'}
              />
              {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Address Line 1</label>
              <Input
                name="line1"
                value={formData.line1}
                onChange={handleChange}
                placeholder="House/Flat number, Building name"
                className={errors.line1 ? 'border-destructive' : 'border-border focus:border-hash-purple'}
              />
              {errors.line1 && <p className="text-destructive text-sm mt-1">{errors.line1}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Address Line 2 (Optional)</label>
              <Input
                name="line2"
                value={formData.line2}
                onChange={handleChange}
                placeholder="Street, Area, Colony"
                className="border-border focus:border-hash-purple"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">City</label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className={errors.city ? 'border-destructive' : 'border-border focus:border-hash-purple'}
                />
                {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">State</label>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className={errors.state ? 'border-destructive' : 'border-border focus:border-hash-purple'}
                />
                {errors.state && <p className="text-destructive text-sm mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Pincode</label>
                <Input
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  className={errors.pincode ? 'border-destructive' : 'border-border focus:border-hash-purple'}
                />
                {errors.pincode && <p className="text-destructive text-sm mt-1">{errors.pincode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Landmark (Optional)</label>
              <Input
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Near landmark"
                className="border-border focus:border-hash-purple"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="flex-1 bg-gradient-to-r from-hash-purple via-hash-blue to-hash-purple hover:from-hash-blue hover:via-hash-purple hover:to-hash-blue text-white shadow-lg shadow-hash-purple/25"
              >
                {isLoading ? 'Saving...' : (initialData ? 'Update Address' : 'Save Address')}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="border-border hover:bg-accent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}