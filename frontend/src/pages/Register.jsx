import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import OTPModal from "../components/OTPModal";
import useUserStore from "../stores/useUserStore";
import { useState } from "react";

export default function Register() {
  const { setUser } = useUserStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

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
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowOTP(true);
    }, 1000);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h1>
          <p className="text-slate-600">Join us and start your fashion journey</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-slate-800">
              Sign Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className={`h-12 ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-slate-400'}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className={`h-12 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-slate-400'}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className={`h-12 ${errors.phone ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-slate-400'}`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    className={`h-12 pr-12 ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-slate-400'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {form.password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength + 1) * 25}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-600">{passwordStrength.text}</span>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Confirm Password
                </label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`h-12 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-slate-400'}`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the{" "}
                  <a href="/terms" className="text-slate-800 underline hover:text-slate-600">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-slate-800 underline hover:text-slate-600">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                className="w-full h-12 text-base font-semibold bg-slate-800 hover:bg-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl" 
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
            <div className="text-center mt-6 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <a href="/login" className="font-semibold text-slate-800 hover:text-slate-600 underline underline-offset-2 transition-colors">
                  Sign in
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
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