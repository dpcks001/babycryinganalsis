import { useState } from "react";
import { Mic } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "@/lib/translations";

const Home = () => {
  const [isRecording, setIsRecording] = useState(false);
  const navigate = useNavigate();
  const t = useTranslation();

  const handleRecordToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success(t.recordButton);
      
      setTimeout(() => {
        navigate("/processing");
      }, 3000);
    } else {
      setIsRecording(false);
      toast.info(t.cancel);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-center px-4">
        <h1 className="text-xl font-bold text-foreground">{t.appTitle}</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            {t.recentAnalysis}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.noRecentData}
          </p>
        </div>

        <button
          onClick={handleRecordToggle}
          className={`relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording
              ? "bg-primary/20 animate-pulse"
              : "bg-primary/10 hover:bg-primary/20 glow-effect"
          }`}
        >
          <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all ${
            isRecording ? "bg-primary/30" : "bg-primary/20"
          }`}>
            <Mic className="h-20 w-20 text-primary-foreground" strokeWidth={1.5} />
          </div>
        </button>

        {isRecording && (
          <p className="mt-8 text-lg font-medium text-foreground animate-pulse">
            {t.analyzing}
          </p>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
