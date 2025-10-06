import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Enter Details for Polo/Varsity Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Name (Optional)"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
            />
          </div>
          <div className="mb-4">
            <Input
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Your Designation"
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Batch"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              placeholder="Your Batch"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Add to Cart
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PoloVarsityForm;