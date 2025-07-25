import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function OTPModal({ open, onClose, onVerify }) {
  const [otp, setOtp] = useState('');
  if (!open) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          maxLength={4}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
          className="text-center text-xl mb-4"
        />
        <Button className="w-full" onClick={() => onVerify(otp)}>
          Verify
        </Button>
        <Button variant="ghost" className="w-full mt-2 text-zinc-500" onClick={onClose}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
} 