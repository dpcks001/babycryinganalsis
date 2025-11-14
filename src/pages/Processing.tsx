import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Processing = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    // Navigate to result after 3 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 px-6">
      <div className="text-center space-y-8 max-w-md w-full">
        {/* Animated Icon */}
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20 animate-ping" />
          <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-spin-slow">
            <Loader2 className="h-20 w-20 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            아기 울음소리 분석 중
          </h1>
          <p className="text-lg text-muted-foreground">
            잠시만 기다려주세요...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          {progress}% 완료
        </p>
      </div>
    </div>
  );
};

export default Processing;
