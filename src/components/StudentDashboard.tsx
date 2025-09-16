import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Calendar, TrendingUp, Clock, LogOut, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const StudentDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth/login?role=student');
        return;
      }

      // Load student profile
      const { data: studentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError || !studentProfile || studentProfile.role !== 'student') {
        toast({
          title: "Access Denied",
          description: "You must be a student to access this dashboard.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setProfile(studentProfile);

      // Load student's classes
      const { data: studentClasses, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .eq('name', studentProfile.class)
        .eq('section', studentProfile.section);

      if (!classesError && studentClasses) {
        setClasses(studentClasses);
      }

      // Load attendance statistics
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentProfile.id);

      if (attendanceData) {
        const totalClasses = attendanceData.length;
        const attendedClasses = attendanceData.filter(a => a.status === 'present').length;
        const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
        
        setAttendanceStats({
          totalClasses,
          attendedClasses,
          attendancePercentage
        });
      }
    };

    checkAuthAndLoadData();
  }, [navigate, toast]);

  const handleQRScan = async () => {
    setIsScanning(true);
    
    // Simulate QR scanning process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsScanning(false);
    toast({
      title: "Attendance Marked",
      description: "Your attendance has been successfully recorded for today.",
    });
  };

  const handleManualEntry = () => {
    const attendanceCode = prompt("Enter the attendance code provided by your teacher:");
    if (attendanceCode) {
      toast({
        title: "Attendance Code Entered",
        description: `Code "${attendanceCode}" has been submitted for verification.`,
      });
    }
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
            <h1 className="text-3xl font-bold text-foreground">Welcome, {profile.name}</h1>
            <p className="text-muted-foreground mt-1">
              Roll Number: {profile.roll_number} • Class: {profile.class}-{profile.section}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats?.attendancePercentage || 0}%</div>
              <p className="text-xs text-muted-foreground">
                {attendanceStats?.attendedClasses || 0} out of {attendanceStats?.totalClasses || 0} classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Class</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {classes.length > 0 ? classes[0].schedule_time : 'No classes'}
              </div>
              <p className="text-xs text-muted-foreground">
                {classes.length > 0 ? `${classes[0].subject} - Room ${classes[0].room_number}` : 'No classes scheduled'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                Mark Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleQRScan}
                className="w-full"
                disabled={isScanning}
              >
                <Scan className="h-4 w-4 mr-2" />
                {isScanning ? "Scanning..." : "Scan Today's QR Code"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleManualEntry}
              >
                Enter Attendance Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No classes scheduled for today</p>
                ) : (
                  classes.map((classItem, index) => (
                    <div key={classItem.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{classItem.subject}</p>
                        <p className="text-sm text-muted-foreground">{classItem.schedule_time} • Room {classItem.room_number}</p>
                      </div>
                      <Badge variant="secondary">
                        Upcoming
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;