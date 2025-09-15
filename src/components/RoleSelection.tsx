import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    // Navigate to respective login page
    navigate(`/auth/login?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary-glow/20 rounded-full">
              <BookOpen className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Smart Curriculum & Attendance
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Revolutionizing education with automated attendance tracking and personalized learning experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Teacher Card */}
          <Card className="group hover:shadow-primary transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 bg-gradient-card">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Users className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-primary">Teacher</CardTitle>
              <CardDescription className="text-lg">
                Manage classes, track attendance, and monitor student progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <QrCode className="h-5 w-5 text-primary" />
                  <span>Generate QR codes for attendance</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>View real-time attendance data</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Manage student activities</span>
                </div>
              </div>
              <Button 
                variant="default" 
                size="lg" 
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary"
                onClick={() => handleRoleSelect('teacher')}
              >
                Continue as Teacher
              </Button>
            </CardContent>
          </Card>

          {/* Student Card */}
          <Card className="group hover:shadow-success transition-all duration-300 cursor-pointer border-2 hover:border-success/50 bg-gradient-card">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-success/10 rounded-full group-hover:bg-success/20 transition-colors">
                  <GraduationCap className="h-12 w-12 text-success" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-success">Student</CardTitle>
              <CardDescription className="text-lg">
                Mark attendance, access personalized activities, and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <QrCode className="h-5 w-5 text-success" />
                  <span>Scan QR codes for attendance</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <BookOpen className="h-5 w-5 text-success" />
                  <span>Access personalized tasks</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <GraduationCap className="h-5 w-5 text-success" />
                  <span>Track academic progress</span>
                </div>
              </div>
              <Button 
                variant="default" 
                size="lg" 
                className="w-full mt-6 bg-success hover:bg-success/90 text-success-foreground shadow-success"
                onClick={() => handleRoleSelect('student')}
              >
                Continue as Student
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-primary-foreground/60">
            Powered by Punjab Department of Higher Education
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;