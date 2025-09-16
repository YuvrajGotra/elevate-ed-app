import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Calendar, BookOpen, Target, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const handleQRScan = () => {
    setIsScanning(true);
    // Simulate scanning daily QR code
    setTimeout(() => {
      setIsScanning(false);
      const today = new Date().toDateString();
      toast({
        title: "Daily Attendance Marked!",
        description: `Your attendance for ${today} has been successfully recorded.`,
      });
    }, 2000);
  };

  const handleManualEntry = () => {
    const attendanceCode = prompt("Enter today's attendance code:");
    if (attendanceCode) {
      const today = new Date().toDateString();
      toast({
        title: "Attendance Marked!",
        description: `Manual attendance for ${today} recorded with code: ${attendanceCode}`,
      });
    }
  };

  const studentData = {
    name: "Priya Sharma",
    rollNo: "21BCE045",
    class: "B.Tech 2nd Year",
    section: "Section A",
    todayAttendance: 5,
    totalClasses: 6,
    overallAttendance: 87.5
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-success text-success-foreground p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-success-foreground/80">Welcome back, {studentData.name}!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Today's Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {studentData.todayAttendance}/{studentData.totalClasses}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Overall Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{studentData.overallAttendance}%</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Next Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">Database Systems</div>
              <div className="text-sm text-muted-foreground">2:00 PM</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-success" />
                Daily Attendance
              </CardTitle>
              <CardDescription>Scan today's QR code or enter attendance code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleQRScan}
                className="w-full bg-success shadow-success"
                disabled={isScanning}
              >
                <Camera className="h-4 w-4 mr-2" />
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

          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { subject: "Computer Networks", time: "09:00 AM", status: "Present" },
                  { subject: "Operating Systems", time: "11:00 AM", status: "Present" },
                  { subject: "Database Systems", time: "02:00 PM", status: "Upcoming" },
                ].map((cls, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded bg-muted/50">
                    <div>
                      <p className="font-medium">{cls.subject}</p>
                      <p className="text-sm text-muted-foreground">{cls.time}</p>
                    </div>
                    <Badge variant={cls.status === "Present" ? "default" : "secondary"}>
                      {cls.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;