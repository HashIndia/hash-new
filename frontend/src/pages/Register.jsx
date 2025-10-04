import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, setSafariAuthToken } from "../services/api";
import useUserStore from "../utils/useUserStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import OTPModal from "../components/OTPModal";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const setUser = useUserStore((state) => state.setUser);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  }

  function getPasswordStrength(password) {
    if (password.length < 6) return { strength: 0, text: "Too Short", color: "bg-red-500" };
    if (password.length < 8) return { strength: 1, text: "Weak", color: "bg-yellow-500" };
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 2, text: "Medium", color: "bg-orange-500" };
    return { strength: 3, text: "Strong", color: "bg-green-500" };
  }

  function validateForm() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
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
      toast.success("Registration successful! Please verify OTP.");
      if (response.token) {
        setSafariAuthToken(response.token);
      }
      setShowOTP(true);
    } catch (error) {
      if (error.data?.errors) {
        const newErrors = {};
        error.data.errors.forEach((e) => {
          newErrors[e.path] = e.msg;
        });
        setErrors(newErrors);
        toast.error("Please fix the errors below.");
      } else {
        setErrors({ form: error.message || "Registration failed. Please try again." });
        toast.error(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleVerifyOTP(otp) {
    // Implement OTP verification logic here
    setOtpVerified(true);
    setShowOTP(false);
    toast.success("OTP verified! Account created.");
    // Optionally fetch user data and set in store
    setUser({ ...form, verified: true });
    navigate("/");
  }

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex items-center justify-center p-4 md:p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--hash-purple))_0%,transparent_50%),radial-gradient(circle_at_80%_20%,hsl(var(--hash-blue))_0%,transparent_50%),radial-gradient(circle_at_40%_40%,hsl(var(--hash-pink))_0%,transparent_50%)] opacity-5"></div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <div className="mx-auto mb-3 md:mb-4 w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/hash-logo.jpg"
              alt="Hash Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2 font-space">Join HASH</h1>
          <p className="text-sm md:text-base text-neutral-600">Start your style journey with us</p>
        </div>
        <Card className="bg-white border border-neutral-200 shadow-2xl shadow-hash-purple/10">
          <CardHeader className="space-y-1 pb-4 md:pb-6">
            <CardTitle className="text-xl md:text-2xl font-semibold text-center text-neutral-900 font-space">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-xs md:text-sm text-neutral-600">
              Enter your details to get started with HASH.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {errors.form && (
                <div className="p-3 md:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-xs md:text-sm">{errors.form}</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs md:text-sm font-medium text-neutral-700 ">
                  Full Name
                </label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className={`h-10 md:h-12 bg-white text-neutral-900 placeholder-neutral-500 ${errors.name ? 'border-destructive focus:ring-destructive' : 'border-neutral-300 focus:ring-hash-purple'}`}
                />
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 ">
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className={`h-12 bg-white text-neutral-900 placeholder-neutral-500 ${errors.email ? 'border-destructive focus:ring-destructive' : 'border-neutral-300 focus:ring-hash-purple'}`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  className={`h-12 bg-white text-neutral-900 placeholder-neutral-500 ${errors.phone ? 'border-destructive focus:ring-destructive' : 'border-neutral-300 focus:ring-hash-purple'}`}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.phone}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    className={`h-12 pr-12 bg-white text-neutral-900 placeholder-neutral-500 ${errors.password ? 'border-destructive focus:ring-destructive' : 'border-neutral-300 focus:ring-hash-purple'}`}
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">
                  Confirm Password
                </label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`h-12 bg-white text-neutral-900 placeholder-neutral-500 ${errors.confirmPassword ? 'border-destructive focus:ring-destructive' : 'border-neutral-300 focus:ring-hash-purple'}`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-hash-purple border-border rounded focus:ring-hash-purple"
                  required
                />
                <label htmlFor="terms" className="text-sm text-neutral-700">
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
              <Button
                className="w-full h-12 text-base font-semibold bg-hash-purple hover:bg-hash-purple/90 text-white transition-all duration-300 shadow-lg hover:shadow-xl shadow-hash-purple/25"
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