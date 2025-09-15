import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

const AuthLayout = ({ children, title, subtitle, showBackButton = true }: AuthLayoutProps) => {
  const navigate = useNavigate();

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6 relative">
      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-6 right-6 bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20"
        onClick={toggleTheme}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary-foreground" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary-foreground" />
      </Button>

      {/* Back Button */}
      {showBackButton && (
        <Button
          variant="outline"
          size="sm"
          className="absolute top-6 left-6 bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}

      <Card className="w-full max-w-md bg-gradient-card border-primary-foreground/20 shadow-glow">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;