import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Home = () => {
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();

  const handleRecordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success("녹음이 시작되었습니다");
      
      // 3초 후 분석 페이지로 이동
      setTimeout(() => {
        navigate("/processing");
      }, 3000);
    } else {
      setIsRecording(false);
      toast.info("녹음이 중지되었습니다");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      {/* Header */}
      <header className="flex h-16 items-center justify-center px-4">
        <h1 className="text-xl font-bold text-foreground">BabyCry Analyzer</h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
        <div className="glass-effect rounded-3xl p-8 shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              아기 울음소리 분석
            </h2>
            <p className="text-muted-foreground">
              버튼을 눌러 녹음을 시작하세요
            </p>
          </div>

          {/* Record Button */}
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleRecordToggle}
              className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? "bg-gradient-to-br from-destructive to-destructive/80 animate-heartbeat"
                  : "bg-gradient-to-br from-primary to-secondary hover:scale-105"
              } shadow-2xl`}
            >
              {isRecording ? (
                <MicOff className="h-16 w-16 text-white" />
              ) : (
                <Mic className="h-16 w-16 text-accent" />
              )}
            </button>

            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {isRecording ? "녹음 중..." : "탭하여 녹음"}
              </p>
              {isRecording && (
                <p className="text-sm text-muted-foreground mt-2">
                  분석을 위해 3초 이상 녹음해주세요
                </p>
              )}
            </div>
          </div>

          {/* Recent Analysis */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">
              최근 분석 결과
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50">
                <div>
                  <p className="font-medium text-foreground">배고픔</p>
                  <p className="text-xs text-muted-foreground">2분 전</p>
                </div>
                <span className="text-2xl">🍼</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/50">
                <div>
                  <p className="font-medium text-foreground">졸림</p>
                  <p className="text-xs text-muted-foreground">15분 전</p>
                </div>
                <span className="text-2xl">😴</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
