import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import useUserStore from '../stores/useUserStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useUserStore((state) => state.setUser);
  
  // Use a state variable for the token to allow it to be updated on resend
  const [registrationToken, setRegistrationToken] = useState(location.state?.registrationToken);

  if (!registrationToken) {
    // Redirect if no token is present
    navigate('/register');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authAPI.verifyOTP({ registrationToken, otp });
      setUser(response.data.user);
      toast.success('Account verified successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const response = await authAPI.resendOTP(registrationToken);
      // Update the token with the new one from the backend
      setRegistrationToken(response.data.registrationToken);
      toast.success(response.message || 'A new OTP has been sent.');
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Account</CardTitle>
          <CardDescription>Enter the 4-digit code sent to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={4}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Account'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={handleResendOTP} disabled={isResending}>
              {isResending ? 'Sending...' : "Didn't receive the code? Resend"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
