import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import useUserStore from "../stores/useUserStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get the setUser action from the store
  const setUser = useUserStore((state) => state.setUser);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await authAPI.login(formData);
      toast.success('Logged in successfully!');
      
      // Call the setUser action from the store with the user data
      setUser(response.data.user);
      
      navigate('/');
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      if (err.data?.errors) {
        const newErrors = {};
        err.data.errors.forEach((e) => {
          newErrors[e.path] = e.msg;
        });
        setErrors(newErrors);
        toast.error("Please fix the errors below.");
      } else {
        setErrors({ form: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4 md:p-6 bg-gradient-to-br from-background via-card to-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--hash-purple))_0%,transparent_50%),radial-gradient(circle_at_75%_75%,hsl(var(--hash-blue))_0%,transparent_50%)] opacity-5"></div>
      
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border shadow-2xl shadow-hash-purple/10 relative z-10">
        <CardHeader className="text-center space-y-3 md:space-y-4">
          {/* Logo */}
          <div className="mx-auto w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="/hash-logo.jpg" 
              alt="Hash Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold text-foreground font-space">Welcome Back</CardTitle>
          <CardDescription className="text-xs md:text-sm text-muted-foreground px-2">Sign in to your HASH account to continue your style journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {errors.form && (
              <div className="p-3 md:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-xs md:text-sm">{errors.form}</p>
              </div>
            )}
            <div className="space-y-2">
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className={`h-10 md:h-12 text-sm md:text-base ${errors.email ? "border-destructive focus:ring-destructive" : "border-border focus:ring-hash-purple"}`}
              />
              {errors.email && <p className="text-destructive text-xs md:text-sm">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`h-10 md:h-12 text-sm md:text-base ${errors.password ? "border-destructive focus:ring-destructive" : "border-border focus:ring-hash-purple"}`}
              />
              {errors.password && <p className="text-destructive text-xs md:text-sm">{errors.password}</p>}
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs md:text-sm text-hash-purple hover:text-hash-blue transition-colors font-medium">
                Forgot Password?
              </Link>
            </div>
            <Button 
              type="submit" 
              className="w-full h-10 md:h-12 text-sm md:text-base bg-gradient-to-r from-hash-purple via-hash-blue to-hash-pink hover:shadow-lg hover:shadow-hash-purple/25 transition-all duration-300 hover:scale-[1.02] font-semibold font-space" 
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-hash-purple hover:text-hash-blue transition-colors">
                Create Account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}