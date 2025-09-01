import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import OTPModal from "../components/OTPModal";
import useUserStore from "../stores/useUserStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { AlertCircle } from "lucide-react";

export default function Register() {
  const { setUser } = useUserStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  }

  function getPasswordStrength(password) {
    if (password.length < 6) return { strength: 0, text: "Too short", color: "bg-red-500" };
    if (password.length < 8) return { strength: 1, text: "Weak", color: "bg-orange-500" };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 2, text: "Medium", color: "bg-yellow-500" };
    return { strength: 3, text: "Strong", color: "bg-green-500" };
  }

  function validateForm() {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    
    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await authAPI.register(form);
      
      toast.success(response.message || 'OTP sent to your email!');
      // Store the token and navigate to the OTP verification page
      navigate('/verify-otp', { state: { registrationToken: response.data.registrationToken } });

    } catch (error) {
      if (error.status === 400 && error.data?.errors) {
        // Handle validation errors from the backend
        const newErrors = {};
        error.data.errors.forEach(err => {
          newErrors[err.path] = err.msg;
        });
        setErrors(newErrors);
        toast.error('Please fix the errors in the form.');
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleVerifyOTP(otp) {
    // Placeholder OTP verification
    setOtpVerified(true);
    setShowOTP(false);
    setUser({ 
      name: form.name, 
      email: form.email, 
      phone: form.phone,
      avatar: `https://placehold.co/100x100/64748b/fff?text=${form.name.split(' ').map(n => n[0]).join('')}`
    });
    window.location.href = "/";
  }

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4 md:p-6 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--hash-purple))_0%,transparent_50%),radial-gradient(circle_at_80%_20%,hsl(var(--hash-blue))_0%,transparent_50%),radial-gradient(circle_at_40%_40%,hsl(var(--hash-pink))_0%,transparent_50%)] opacity-5"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          {/* Logo */}
          <div className="mx-auto mb-3 md:mb-4 w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="/hash-logo.jpg" 
              alt="Hash Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-space">Join HASH</h1>
          <p className="text-sm md:text-base text-muted-foreground">Start your style journey with us</p>
        </div>

        <Card className="bg-card/80 backdrop-blur-xl border border-border shadow-2xl shadow-hash-purple/10">
          <CardHeader className="space-y-1 pb-4 md:pb-6">
            <CardTitle className="text-xl md:text-2xl font-semibold text-center text-foreground font-space">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-xs md:text-sm text-muted-foreground">
              Enter your details to get started with HASH.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className={`h-10 md:h-12 ${errors.name ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-hash-purple'}`}
                />
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className={`h-12 ${errors.email ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-hash-purple'}`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className={`h-12 ${errors.phone ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-hash-purple'}`}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    className={`h-12 pr-12 ${errors.password ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-hash-purple'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {form.password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength + 1) * 25}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{passwordStrength.text}</span>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`h-12 ${errors.confirmPassword ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-hash-purple'}`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-hash-purple border-border rounded focus:ring-hash-purple"
                  required
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <a href="/terms" className="text-hash-purple underline hover:text-hash-blue transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-hash-purple underline hover:text-hash-blue transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-hash-purple via-hash-blue to-hash-purple hover:from-hash-blue hover:via-hash-purple hover:to-hash-blue transition-all duration-300 shadow-lg hover:shadow-xl shadow-hash-purple/25" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-6 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a href="/login" className="font-semibold text-hash-purple hover:text-hash-blue underline underline-offset-2 transition-colors">
                  Sign in
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to receive marketing emails from us.
          </p>
        </div>
      </div>

      <OTPModal 
        open={showOTP} 
        onClose={() => setShowOTP(false)} 
        onVerify={handleVerifyOTP} 
      />
    </div>
  );
}