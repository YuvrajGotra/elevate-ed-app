import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Filter, Calendar, CheckCircle, XCircle } from "lucide-react";

const AttendanceTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("today");

  // Sample student data
  const generateStudentData = () => {
    const students = [];
    const names = [
      "Aarav Sharma", "Vivaan Singh", "Aditya Kumar", "Vihaan Gupta", "Arjun Patel",
      "Sai Reddy", "Arnav Jain", "Atharv Agarwal", "Krishna Yadav", "Ishaan Verma",
      "Ananya Singh", "Aisha Sharma", "Priya Patel", "Rhea Gupta", "Kavya Kumar",
      "Diya Jain", "Aarohi Reddy", "Myra Agarwal", "Kiara Yadav", "Saanvi Verma",
      "Aryan Singh", "Vihan Sharma", "Rudra Patel", "Aarush Gupta", "Shivansh Kumar",
      "Ayaan Jain", "Reyansh Reddy", "Darsh Agarwal", "Viaan Yadav", "Atharva Verma",
      "Avani Singh", "Shanaya Sharma", "Ira Patel", "Mishka Gupta", "Tvisha Kumar",
      "Navya Jain", "Aadhya Reddy", "Zara Agarwal", "Mira Yadav", "Sara Verma",
      "Kabir Singh", "Arush Sharma", "Veer Patel", "Daksh Gupta", "Kian Kumar"
    ];
    
    names.forEach((name, index) => {
      const rollNo = `21BCE${(index + 1).toString().padStart(3, '0')}`;
      const isPresent = Math.random() > 0.15; // 85% attendance rate
      const presentDays = Math.floor(Math.random() * 20) + 15; // 15-35 days
      const totalDays = 35;
      
      students.push({
        id: index + 1,
        name,
        rollNo,
        class: "B.Tech 2nd Year",
        section: "Section A",
        status: isPresent ? "Present" : "Absent",
        presentDays,
        totalDays,
        attendanceRate: Math.round((presentDays / totalDays) * 100),
        lastSeen: isPresent ? "09:15 AM" : "Yesterday",
        email: `${name.toLowerCase().replace(' ', '.')}@student.punjab.edu.in`
      });
    });
    
    return students;
  };

  const [studentsData] = useState(generateStudentData());

  // Filter students based on search and filters
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "present" && student.status === "Present") ||
                         (filterStatus === "absent" && student.status === "Absent");
    
    return matchesSearch && matchesStatus;
  });

  const presentCount = filteredStudents.filter(s => s.status === "Present").length;
  const absentCount = filteredStudents.filter(s => s.status === "Absent").length;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Attendance Records
              </CardTitle>
              <CardDescription>
                Detailed view of student attendance for today's classes
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="present">Present Only</SelectItem>
                <SelectItem value="absent">Absent Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Present</span>
            </div>
            <div className="text-2xl font-bold text-success mt-2">{presentCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Absent</span>
            </div>
            <div className="text-2xl font-bold text-warning mt-2">{absentCount}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">Attendance Rate</div>
            <div className="text-2xl font-bold text-primary mt-2">
              {Math.round((presentCount / filteredStudents.length) * 100)}%
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border-secondary/20">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground">Total Students</div>
            <div className="text-2xl font-bold text-secondary mt-2">{filteredStudents.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Roll No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class & Section</TableHead>
                  <TableHead className="text-center">Today's Status</TableHead>
                  <TableHead className="text-center">Attendance Rate</TableHead>
                  <TableHead className="text-center">Present/Total</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{student.rollNo}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{student.class}</div>
                        <div className="text-muted-foreground">{student.section}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={student.status === "Present" ? "default" : "destructive"}
                        className={student.status === "Present" ? "bg-success" : ""}
                      >
                        <CheckCircle className={`h-3 w-3 mr-1 ${
                          student.status === "Present" ? "" : "hidden"
                        }`} />
                        <XCircle className={`h-3 w-3 mr-1 ${
                          student.status === "Absent" ? "" : "hidden"
                        }`} />
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className={`font-semibold ${
                          student.attendanceRate >= 80 ? 'text-success' :
                          student.attendanceRate >= 60 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {student.attendanceRate}%
                        </span>
                        <div className="w-16 bg-muted rounded-full h-1 mt-1">
                          <div
                            className={`h-1 rounded-full ${
                              student.attendanceRate >= 80 ? 'bg-success' :
                              student.attendanceRate >= 60 ? 'bg-warning' : 'bg-destructive'
                            }`}
                            style={{ width: `${student.attendanceRate}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm">
                        {student.presentDays}/{student.totalDays}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {student.lastSeen}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No students found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTable;