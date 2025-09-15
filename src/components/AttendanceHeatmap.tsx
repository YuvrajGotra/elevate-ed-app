import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Download } from "lucide-react";
import { useState } from "react";

const AttendanceHeatmap = () => {
  const [selectedMonth, setSelectedMonth] = useState("november");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Generate sample heatmap data for the last 30 days
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const attendanceRate = Math.random() * 100;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      data.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        attendanceRate: isWeekend ? 0 : attendanceRate,
        isWeekend,
        present: isWeekend ? 0 : Math.floor((attendanceRate / 100) * 45),
        total: isWeekend ? 0 : 45
      });
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();

  const getIntensityColor = (rate: number) => {
    if (rate === 0) return "bg-muted";
    if (rate < 25) return "bg-destructive/20";
    if (rate < 50) return "bg-warning/30";
    if (rate < 75) return "bg-warning/60";
    if (rate < 90) return "bg-success/60";
    return "bg-success";
  };

  const getIntensityLabel = (rate: number) => {
    if (rate === 0) return "No Class";
    if (rate < 25) return "Very Low";
    if (rate < 50) return "Low";
    if (rate < 75) return "Average";
    if (rate < 90) return "Good";
    return "Excellent";
  };

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Organize data by weeks
  const organizeByWeeks = () => {
    const weeks = [];
    let currentWeek = [];
    
    heatmapData.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay();
      const mondayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday=0 to Monday=0
      
      if (index === 0) {
        // Fill empty days for the first week
        for (let i = 0; i < mondayIndex; i++) {
          currentWeek.push(null);
        }
      }
      
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Add remaining days
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const weeks = organizeByWeeks();

  // Calculate summary stats
  const totalClasses = heatmapData.filter(d => !d.isWeekend).length;
  const averageAttendance = heatmapData
    .filter(d => !d.isWeekend)
    .reduce((sum, d) => sum + d.attendanceRate, 0) / totalClasses;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Attendance Heat Map
              </CardTitle>
              <CardDescription>
                Visual representation of daily attendance patterns
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="november">November</SelectItem>
                  <SelectItem value="december">December</SelectItem>
                  <SelectItem value="january">January</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Heatmap */}
        <Card className="lg:col-span-3 bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-lg">Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Week day labels */}
              <div className="grid grid-cols-8 gap-1">
                <div></div> {/* Empty corner */}
                {weekdays.map(day => (
                  <div key={day} className="text-xs font-medium text-muted-foreground text-center py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-8 gap-1">
                  <div className="text-xs text-muted-foreground flex items-center">
                    W{weekIndex + 1}
                  </div>
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`aspect-square rounded ${
                        day ? getIntensityColor(day.attendanceRate) : 'bg-muted/30'
                      } ${day ? 'cursor-pointer hover:ring-2 hover:ring-primary/50' : ''} 
                      transition-all duration-200 flex items-center justify-center group relative`}
                      title={day ? `${day.date}: ${day.present}/${day.total} (${Math.round(day.attendanceRate)}%)` : ''}
                    >
                      {day && !day.isWeekend && (
                        <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {day.day}
                        </span>
                      )}
                      
                      {/* Tooltip */}
                      {day && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                          <div className="font-medium">{new Date(day.date).toLocaleDateString()}</div>
                          {day.isWeekend ? (
                            <div>Weekend</div>
                          ) : (
                            <>
                              <div>{day.present}/{day.total} students</div>
                              <div>{Math.round(day.attendanceRate)}% attendance</div>
                              <div className="text-muted-foreground">{getIntensityLabel(day.attendanceRate)}</div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Less</span>
                <div className="flex gap-1">
                  {[0, 30, 50, 70, 90].map(rate => (
                    <div
                      key={rate}
                      className={`w-3 h-3 rounded ${getIntensityColor(rate === 0 ? 0 : rate + 5)}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">More</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="space-y-6">
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Average Attendance</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {Math.round(averageAttendance)}%
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Total Classes</div>
                <div className="text-xl font-semibold">{totalClasses}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Best Day</div>
                <div className="text-sm text-success">
                  {heatmapData
                    .filter(d => !d.isWeekend)
                    .sort((a, b) => b.attendanceRate - a.attendanceRate)[0]?.attendanceRate.toFixed(0)}% attendance
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Lowest Day</div>
                <div className="text-sm text-warning">
                  {heatmapData
                    .filter(d => !d.isWeekend)
                    .sort((a, b) => a.attendanceRate - b.attendanceRate)[0]?.attendanceRate.toFixed(0)}% attendance
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-lg">Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-success/10 rounded-lg">
                <div className="font-medium text-success">Good Performance</div>
                <div className="text-muted-foreground">
                  Overall attendance is above 80%
                </div>
              </div>
              
              <div className="p-3 bg-warning/10 rounded-lg">
                <div className="font-medium text-warning">Friday Pattern</div>
                <div className="text-muted-foreground">
                  Lower attendance on Fridays
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeatmap;