import { useState } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function AddressForm({ onSave, initial = {} }) {
  const [address, setAddress] = useState(initial);

  function handleChange(e) {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(address);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        name="line1"
        placeholder="Address Line 1"
        value={address.line1 || ''}
        onChange={handleChange}
        required
      />
      <Input
        name="city"
        placeholder="City"
        value={address.city || ''}
        onChange={handleChange}
        required
      />
      <Input
        name="state"
        placeholder="State"
        value={address.state || ''}
        onChange={handleChange}
        required
      />
      <Input
        name="zip"
        placeholder="ZIP Code"
        value={address.zip || ''}
        onChange={handleChange}
        required
      />
      <Button className="w-full" type="submit">
        Save Address
      </Button>
    </form>
  );
} 