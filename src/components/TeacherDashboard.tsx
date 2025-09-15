import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Users, Calendar, BarChart3, Download, Eye, Plus } from "lucide-react";
import QRCodeGenerator from "./QRCodeGenerator";
import AttendanceHeatmap from "./AttendanceHeatmap";
import AttendanceTable from "./AttendanceTable";

const TeacherDashboard = () => {
  const [selectedClass, setSelectedClass] = useState("btech2-a");
  const [selectedSubject, setSelectedSubject] = useState("computer-networks");
  const [showQRCode, setShowQRCode] = useState(false);

  const classData = {
    totalStudents: 45,
    presentToday: 38,
    absentToday: 7,
    attendanceRate: 84.4
  };

  const recentClasses = [
    { subject: "Computer Networks", time: "09:00 AM", present: 42, total: 45, date: "Today" },
    { subject: "Operating Systems", time: "11:00 AM", present: 40, total: 45, date: "Today" },
    { subject: "Database Systems", time: "02:00 PM", present: 44, total: 45, date: "Yesterday" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
              <p className="text-primary-foreground/80">Welcome back, Prof. Rajesh Kumar</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowQRCode(true)}
                className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Generate QR Code
              </Button>
              <Button variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Class Selection */}
          <div className="flex gap-4 mb-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="btech2-a">B.Tech 2nd Year - Section A</SelectItem>
                <SelectItem value="btech2-b">B.Tech 2nd Year - Section B</SelectItem>
                <SelectItem value="btech3-a">B.Tech 3rd Year - Section A</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="computer-networks">Computer Networks</SelectItem>
                <SelectItem value="operating-systems">Operating Systems</SelectItem>
                <SelectItem value="database-systems">Database Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{classData.totalStudents}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-success/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Present Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{classData.presentToday}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-warning/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Absent Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{classData.absentToday}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{classData.attendanceRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance Records</TabsTrigger>
            <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
            <TabsTrigger value="students">Student Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Classes */}
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Recent Classes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentClasses.map((cls, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{cls.subject}</p>
                          <p className="text-sm text-muted-foreground">{cls.time} • {cls.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={cls.present / cls.total > 0.8 ? "default" : "secondary"}>
                            {cls.present}/{cls.total}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {Math.round((cls.present / cls.total) * 100)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowQRCode(true)}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code for Current Class
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    View Live Attendance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Subject
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceTable />
          </TabsContent>

          <TabsContent value="heatmap">
            <AttendanceHeatmap />
          </TabsContent>

          <TabsContent value="students">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Manage students in your classes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Student management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <QRCodeGenerator
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
          classInfo={`${selectedClass}-${selectedSubject}`}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;