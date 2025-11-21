import { useState, useRef } from "react";
import { Mic } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "@/lib/translations";
import { AudioRecorder } from "@/utils/audioAnalysis";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { audioAnalysisSchema } from "@/lib/audioValidation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Home = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const navigate = useNavigate();
  const t = useTranslation();
  const { user } = useAuth();
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopRecordingAndAnalyze = async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    try {
      setIsRecording(false);
      setRecordingTime(0);
      toast.info("분석 중...");
      navigate("/processing");

      const audioBlob = await recorderRef.current!.stopRecording();
      const result = await recorderRef.current!.analyzeAudio(audioBlob);
      
      if (!user) {
        toast.error("로그인이 필요합니다");
        navigate("/auth");
        return;
      }

      // Validate audio analysis data
      const dataToInsert = {
        duration: result.duration,
        rms_avg: result.rms_avg,
        rms_max: result.rms_max,
        spectral_centroid_mean: result.spectral_centroid_mean,
        spectral_rolloff_mean: result.spectral_rolloff_mean,
        zcr_mean: result.zcr_mean,
        mfcc_mean: result.mfcc_mean,
        energy_avg: result.energy_avg,
        user_id: user.id
      };

      const validationResult = audioAnalysisSchema.safeParse(dataToInsert);
      if (!validationResult.success) {
        toast.error("분석 데이터 검증 실패");
        navigate("/");
        return;
      }

      // Save to database
      const { data, error } = await supabase
        .from('audio_analyses')
        .insert({
          duration: validationResult.data.duration,
          rms_avg: validationResult.data.rms_avg,
          rms_max: validationResult.data.rms_max,
          spectral_centroid_mean: validationResult.data.spectral_centroid_mean,
          spectral_rolloff_mean: validationResult.data.spectral_rolloff_mean,
          zcr_mean: validationResult.data.zcr_mean,
          mfcc_mean: validationResult.data.mfcc_mean,
          energy_avg: validationResult.data.energy_avg,
          user_id: validationResult.data.user_id
        })
        .select()
        .single();

      if (error) {
        toast.error("분석 결과 저장 실패");
      } else {
        localStorage.setItem('audioAnalysisResult', JSON.stringify(data));
      }
      
      setAnalysisResult(result);
      setShowResultDialog(true);
      
      setTimeout(() => {
        navigate("/result");
      }, 2000);
    } catch (error) {
      toast.error("분석 중 오류가 발생했습니다");
      navigate("/");
    }
  };

  const handleRecordToggle = async () => {
    if (!isRecording) {
      try {
        if (!recorderRef.current) {
          recorderRef.current = new AudioRecorder();
        }
        
        const granted = await recorderRef.current.requestPermission();
        if (!granted) {
          toast.error("마이크 권한이 필요합니다");
          return;
        }

        await recorderRef.current.startRecording();
        setIsRecording(true);
        setRecordingTime(0);
        toast.success("녹음 시작 (10초)");

        // 1초마다 타이머 업데이트
        recordingTimerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);

        // 10초 후 자동 중지
        timerRef.current = setTimeout(() => {
          stopRecordingAndAnalyze();
        }, 10000);
      } catch (error) {
        toast.error("녹음을 시작할 수 없습니다");
      }
    } else {
      stopRecordingAndAnalyze();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-center px-4">
        <h1 className="text-xl font-bold text-foreground">{t.appTitle}</h1>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-24">
        <div className="text-center mb-12">
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
          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-foreground animate-pulse">
              녹음 중...
            </p>
            <p className="text-2xl font-bold text-primary mt-2">
              {recordingTime} / 10초
            </p>
          </div>
        )}

        {!isRecording && (
          <button
            onClick={() => navigate("/result")}
            className="mt-8 px-6 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
          >
            테스트: 결과 화면 보기
          </button>
        )}
      </main>

      <BottomNav />

      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>분석 결과</DialogTitle>
            <DialogDescription>
              울음소리 분석이 완료되었습니다
            </DialogDescription>
          </DialogHeader>
          {analysisResult && (
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">녹음 시간:</div>
                <div>{analysisResult.duration.toFixed(2)}초</div>
                
                <div className="font-medium">평균 강도:</div>
                <div>{(analysisResult.rms_avg * 100).toFixed(2)}%</div>
                
                <div className="font-medium">최대 강도:</div>
                <div>{(analysisResult.rms_max * 100).toFixed(2)}%</div>
                
                <div className="font-medium">평균 에너지:</div>
                <div>{analysisResult.energy_avg.toFixed(2)}</div>
                
                <div className="font-medium">스펙트럼 중심:</div>
                <div>{analysisResult.spectral_centroid_mean.toFixed(0)} Hz</div>
                
                <div className="font-medium">영교차율:</div>
                <div>{analysisResult.zcr_mean.toFixed(4)}</div>
              </div>
              <div className="mt-4 text-muted-foreground">
                분석 시간: {new Date(analysisResult.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
