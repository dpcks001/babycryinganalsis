import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AudioWaveform } from "lucide-react";
import { Button } from "@/components/ui/button";

const Processing = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const timer = setTimeout(() => {
      navigate("/result");
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="text-center space-y-12 max-w-md w-full">
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10" />
          <div className="relative w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <AudioWaveform className="h-20 w-20 text-primary-foreground animate-pulse" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            분석 중입니다...
          </h1>
        </div>

        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-4 text-left">
          <p className="text-sm text-muted-foreground">
            잠시만 기다려주세요.
          </p>
          <p className="text-sm text-muted-foreground">
            AI가 우는 이유를 꼼꼼히 살피는 중이에요.
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={handleCancel}
          className="w-full"
        >
          분석 취소
        </Button>
      </div>
    </div>
  );
};

export default Processing;
