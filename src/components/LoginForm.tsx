import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "./AuthLayout";

const LoginForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const role = searchParams.get('role') || 'student';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${role}!`,
      });

      // Navigate to appropriate dashboard
      if (role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleIcon = role === 'teacher' ? Users : GraduationCap;
  const RoleIcon = roleIcon;
  const roleColor = role === 'teacher' ? 'text-primary' : 'text-success';
  const roleColorBg = role === 'teacher' ? 'bg-primary' : 'bg-success';

  return (
    <AuthLayout
      title={`${role === 'teacher' ? 'Teacher' : 'Student'} Login`}
      subtitle={`Sign in to access your ${role} dashboard`}
    >
      <div className="flex justify-center mb-6">
        <div className={`p-3 ${roleColorBg}/10 rounded-full`}>
          <RoleIcon className={`h-8 w-8 ${roleColor}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          className={`w-full ${roleColorBg} hover:${roleColorBg}/90 shadow-${role === 'teacher' ? 'primary' : 'success'}`}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button
            variant="link"
            className={`p-0 h-auto ${roleColor} hover:${roleColor}/80`}
            onClick={() => navigate(`/auth/signup?role=${role}`)}
          >
            Sign up here
          </Button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;