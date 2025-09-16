import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Calendar, QrCode, TrendingUp, Clock, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AttendanceTable from "./AttendanceTable";
import AttendanceHeatmap from "./AttendanceHeatmap";
import QRCodeGenerator from "./QRCodeGenerator";

const TeacherDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth/login?role=teacher');
        return;
      }

      // Load teacher profile
      const { data: teacherProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError || !teacherProfile || teacherProfile.role !== 'teacher') {
        toast({
          title: "Access Denied",
          description: "You must be a teacher to access this dashboard.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setProfile(teacherProfile);

      // Load teacher's classes
      const { data: teacherClasses, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', teacherProfile.id);

      if (!classesError && teacherClasses) {
        setClasses(teacherClasses);
      }

      // Load attendance statistics
      if (teacherClasses && teacherClasses.length > 0) {
        const classIds = teacherClasses.map(c => c.id);
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('status, date')
          .in('class_id', classIds);

        if (attendanceData) {
          const today = new Date().toISOString().split('T')[0];
          const todayAttendance = attendanceData.filter(a => a.date === today);
          const totalStudents = attendanceData.length;
          const presentToday = todayAttendance.filter(a => a.status === 'present').length;
          
          setAttendanceStats({
            totalStudents,
            presentToday,
            attendanceRate: totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0
          });
        }
      }
    };

    checkAuthAndLoadData();
  }, [navigate, toast]);

  const handleGenerateQR = () => {
    setShowQRGenerator(true);
    toast({
      title: "QR Code Generated",
      description: "Students can now scan the QR code to mark their attendance.",
    });
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    }
  };

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {profile.name}</h1>
            <p className="text-muted-foreground mt-1">
              {profile.department} • Employee ID: {profile.employee_id}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "attendance" ? "default" : "outline"}
            onClick={() => setActiveTab("attendance")}
          >
            Attendance Table
          </Button>
          <Button
            variant={activeTab === "heatmap" ? "default" : "outline"}
            onClick={() => setActiveTab("heatmap")}
          >
            Attendance Heatmap
          </Button>
        </div>

        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{classes.length}</div>
                  <p className="text-xs text-muted-foreground">Active courses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{attendanceStats?.totalStudents || 0}</div>
                  <p className="text-xs text-muted-foreground">Enrolled students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{attendanceStats?.attendanceRate || 0}%</div>
                  <p className="text-xs text-muted-foreground">Overall attendance rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classes.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No classes found. Please add classes to get started.</p>
                    ) : (
                      classes.map((classItem) => (
                        <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{classItem.subject}</h3>
                              <p className="text-sm text-muted-foreground">
                                {classItem.schedule_time} • {classItem.room_number} • Class {classItem.name}-{classItem.section}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={handleGenerateQR}
                            >
                              <QrCode className="h-4 w-4 mr-2" />
                              Generate QR
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleGenerateQR}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("attendance")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Attendance Records
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("heatmap")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View Attendance Heatmap
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === "attendance" && <AttendanceTable />}
        {activeTab === "heatmap" && <AttendanceHeatmap />}

        {showQRGenerator && (
          <QRCodeGenerator
            isOpen={showQRGenerator}
            onClose={() => setShowQRGenerator(false)}
            classInfo="Sample Class"
          />
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;