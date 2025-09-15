import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Users, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "./AuthLayout";

const SignupForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const role = searchParams.get('role') || 'student';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    class: '',
    section: '',
    department: '',
    employeeId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate signup process
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Account Created Successfully",
        description: `Welcome to Smart Attendance, ${formData.name}!`,
      });

      // Navigate to login
      navigate(`/auth/login?role=${role}`);
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Please try again later.",
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
      title={`${role === 'teacher' ? 'Teacher' : 'Student'} Signup`}
      subtitle={`Create your ${role} account`}
    >
      <div className="flex justify-center mb-6">
        <div className={`p-3 ${roleColorBg}/10 rounded-full`}>
          <RoleIcon className={`h-8 w-8 ${roleColor}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

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

        {role === 'student' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={formData.class} onValueChange={(value) => handleSelectChange('class', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10th</SelectItem>
                  <SelectItem value="11">11th</SelectItem>
                  <SelectItem value="12">12th</SelectItem>
                  <SelectItem value="btech1">B.Tech 1st Year</SelectItem>
                  <SelectItem value="btech2">B.Tech 2nd Year</SelectItem>
                  <SelectItem value="btech3">B.Tech 3rd Year</SelectItem>
                  <SelectItem value="btech4">B.Tech 4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select value={formData.section} onValueChange={(value) => handleSelectChange('section', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                  <SelectItem value="D">Section D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {role === 'teacher' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleSelectChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse">Computer Science</SelectItem>
                  <SelectItem value="ece">Electronics</SelectItem>
                  <SelectItem value="me">Mechanical</SelectItem>
                  <SelectItem value="ce">Civil</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                name="employeeId"
                placeholder="Enter employee ID"
                value={formData.employeeId}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <Button
          type="submit"
          className={`w-full ${roleColorBg} hover:${roleColorBg}/90 shadow-${role === 'teacher' ? 'primary' : 'success'}`}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className={`p-0 h-auto ${roleColor} hover:${roleColor}/80`}
            onClick={() => navigate(`/auth/login?role=${role}`)}
          >
            Sign in here
          </Button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupForm;