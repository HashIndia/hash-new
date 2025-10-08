import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, User, GraduationCap, Calendar } from 'lucide-react';

const PoloVarsityForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    batch: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200 text-black p-6 relative">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors text-black"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold mb-2 text-black">Personalization Details</h2>
          <p className="text-neutral-600 text-sm">Add your details for custom printing</p>
        </div>

        {/* Form */}
        <div className="p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-4 h-4 text-black" />
                  <label className="text-sm font-medium text-black">
                    Name (Optional)
                  </label>
                </div>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="border-neutral-300 focus:border-black focus:ring-black rounded-xl text-black bg-white"
                />
              </div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="w-4 h-4 text-black" />
                  <label className="text-sm font-medium text-black">
                    Designation <span className="text-red-500">*</span>
                  </label>
                </div>
                <Input
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g., President, Captain, Member"
                  className="border-neutral-300 focus:border-black focus:ring-black rounded-xl text-black bg-white"
                  required
                />
              </div>
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-4 h-4 text-black" />
                  <label className="text-sm font-medium text-black">
                    Batch <span className="text-red-500">*</span>
                  </label>
                </div>
                <Input
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="e.g., 2024, Batch of 2023"
                  className="border-neutral-300 focus:border-black focus:ring-black rounded-xl text-black bg-white"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1 border-neutral-300 text-black hover:bg-neutral-50 bg-white rounded-xl py-3"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-black text-white hover:bg-neutral-800 rounded-xl py-3 font-semibold"
              >
                Add to Cart
              </Button>
            </div>
          </form>
        </div>
        
        {/* Footer note */}
        <div className="bg-neutral-50 p-4 border-t border-neutral-200">
          <p className="text-xs text-black text-center">
            Custom printing may take 2-3 additional business days
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoloVarsityForm;