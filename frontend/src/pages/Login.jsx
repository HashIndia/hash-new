import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import useUserStore from "../stores/useUserStore";
import { useState } from "react";

export default function Login() {
  const { setUser } = useUserStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  }

  function validateForm() {
    const newErrors = {};
    
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email) && !/^\d{10}$/.test(form.email)) {
      newErrors.email = "Enter a valid email or 10-digit phone number";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      setUser({ 
        name: "John Doe", 
        email: form.email, 
        phone: "+91 9876543210",
        avatar: "https://placehold.co/100x100/64748b/fff?text=JD"
      });
      setIsLoading(false);
      window.location.href = "/";
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your account to continue</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-slate-800">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email/Phone Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email or Phone Number
                </label>
                <Input
                  name="email"
                  type="text"
                  placeholder="Enter your email or phone number"
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

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-slate-600 hover:text-slate-800 underline underline-offset-2 transition-colors"
                >
                  Forgot password?
                </button>
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
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 border-slate-200 hover:bg-slate-50">
                <span className="mr-2">📧</span>
                Google
              </Button>
              <Button variant="outline" className="h-12 border-slate-200 hover:bg-slate-50">
                <span className="mr-2">📱</span>
                Phone
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <a href="/register" className="font-semibold text-slate-800 hover:text-slate-600 underline underline-offset-2 transition-colors">
                  Create account
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            By signing in, you agree to our{" "}
            <a href="/terms" className="underline hover:text-slate-700">Terms</a> and{" "}
            <a href="/privacy" className="underline hover:text-slate-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
} 