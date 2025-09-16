import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Link2, Timer, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: string;
}

const QRCodeGenerator = ({ isOpen, onClose, classInfo }: QRCodeGeneratorProps) => {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [qrData, setQrData] = useState("");
  const [attendanceLink, setAttendanceLink] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Generate daily unique QR data and link
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const dailyId = `${today}-${Math.random().toString(36).substr(2, 6)}`;
      const qrContent = `DAILY_ATTENDANCE:${classInfo}:${dailyId}:${today}`;
      const link = `https://attendance-app.punjab.gov.in/daily/${dailyId}`;
      
      setQrData(qrContent);
      setAttendanceLink(link);
      setTimeLeft(300);
      setAttendanceCount(0);

      // Simulate real-time attendance updates
      const attendanceInterval = setInterval(() => {
        setAttendanceCount(prev => {
          const newCount = prev + Math.floor(Math.random() * 3);
          return Math.min(newCount, 45); // Max 45 students
        });
      }, 2000);

      // Timer countdown
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            clearInterval(attendanceInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        clearInterval(attendanceInterval);
      };
    }
  }, [isOpen, classInfo]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  // Generate QR Code SVG (simplified)
  const generateQRCodeSVG = (data: string) => {
    // This is a simplified representation. In a real app, you'd use a QR code library
    return (
      <div className="w-64 h-64 bg-foreground flex items-center justify-center rounded-lg">
        <div className="text-background text-center p-4">
          <div className="grid grid-cols-8 gap-1 mb-4">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-background' : 'bg-foreground'}`}
              />
            ))}
          </div>
          <p className="text-xs">QR Code</p>
          <p className="text-xs">Attendance</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Attendance QR Code - {classInfo}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <Card className="bg-gradient-card">
            <CardHeader>
            <CardTitle className="text-center">Daily QR Code - {new Date().toDateString()}</CardTitle>
              <div className="flex justify-center items-center gap-4">
                <Badge variant={timeLeft > 60 ? "default" : "destructive"}>
                  <Timer className="h-3 w-3 mr-1" />
                  {formatTime(timeLeft)}
                </Badge>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {attendanceCount} marked today
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              {generateQRCodeSVG(qrData)}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(qrData, "QR Code Data")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy QR Data
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Save QR
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Methods */}
          <div className="space-y-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-success" />
                  Alternative Attendance Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Daily attendance link for {new Date().toDateString()}:
                </p>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-mono break-all">{attendanceLink}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => copyToClipboard(attendanceLink, "Attendance Link")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>Live Attendance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Students Marked:</span>
                    <span className="font-semibold">{attendanceCount}/45</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-success h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(attendanceCount / 45) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Attendance Rate: {Math.round((attendanceCount / 45) * 100)}%</span>
                    <span>Time Left: {formatTime(timeLeft)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="text-sm space-y-2 text-muted-foreground">
                  <li>1. Generate new QR code daily for attendance</li>
                  <li>2. Display QR code on classroom screen</li>
                  <li>3. Students scan daily to mark their attendance</li>
                  <li>4. Alternative: Share the daily attendance link</li>
                  <li>5. QR code valid for today only</li>
                  <li>6. View real-time attendance updates</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            className="bg-primary shadow-primary"
            onClick={() => window.location.reload()}
          >
            Generate New Daily QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;