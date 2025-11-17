import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useTranslation } from "@/lib/translations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Period = "today" | "week" | "month";

interface AudioAnalysis {
  id: string;
  duration: number;
  rms_avg: number;
  rms_max: number;
  spectral_centroid_mean: number;
  spectral_rolloff_mean: number;
  zcr_mean: number;
  mfcc_mean: number[];
  energy_avg: number;
  created_at: string;
}

const Statistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");
  const [analyses, setAnalyses] = useState<AudioAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    fetchAnalyses();
  }, [selectedPeriod]);

  const fetchAnalyses = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      let startDate = new Date();

      if (selectedPeriod === "today") {
        startDate.setHours(0, 0, 0, 0);
      } else if (selectedPeriod === "week") {
        startDate.setDate(now.getDate() - 7);
      } else {
        startDate.setMonth(now.getMonth() - 1);
      }

      const { data, error } = await supabase
        .from('audio_analyses')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match AudioAnalysis interface
      const transformedData: AudioAnalysis[] = (data || []).map(item => ({
        id: item.id,
        duration: item.duration,
        rms_avg: item.rms_avg,
        rms_max: item.rms_max,
        spectral_centroid_mean: item.spectral_centroid_mean,
        spectral_rolloff_mean: item.spectral_rolloff_mean,
        zcr_mean: item.zcr_mean,
        mfcc_mean: Array.isArray(item.mfcc_mean) ? item.mfcc_mean as number[] : [],
        energy_avg: item.energy_avg,
        created_at: item.created_at
      }));
      
      setAnalyses(transformedData);
    } catch (error) {
      toast.error("데이터를 불러올 수 없습니다");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}분 ${secs}초`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-center bg-background border-b border-border px-4">
        <h1 className="text-lg font-bold text-foreground">{t.cryHistory}</h1>
      </header>

      <main className="flex-1 pb-24 px-6 py-6">
        <div className="flex gap-2 p-1 rounded-full bg-muted mb-8">
          {(["today", "week", "month"] as Period[]).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedPeriod === period
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {period === "today" && t.today}
              {period === "week" && t.thisWeek}
              {period === "month" && t.thisMonth}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-base font-semibold text-foreground mb-4">분석 통계</h2>
          <Card className="glass-effect border-0 p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted-foreground">총 분석 횟수</p>
                  <p className="text-3xl font-bold text-foreground">{analyses.length}</p>
                  <p className="text-xs text-muted-foreground">회</p>
                </div>
              </div>
            </div>

            {analyses.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">평균 강도</span>
                  <span className="text-sm font-semibold text-foreground">
                    {(analyses.reduce((sum, a) => sum + a.rms_avg, 0) / analyses.length * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">평균 녹음 시간</span>
                  <span className="text-sm font-semibold text-foreground">
                    {(analyses.reduce((sum, a) => sum + a.duration, 0) / analyses.length).toFixed(1)}초
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">평균 에너지</span>
                  <span className="text-sm font-semibold text-foreground">
                    {(analyses.reduce((sum, a) => sum + a.energy_avg, 0) / analyses.length).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">최근 분석 기록</h2>
          {loading ? (
            <Card className="glass-effect border-0 p-6 text-center">
              <p className="text-muted-foreground">로딩 중...</p>
            </Card>
          ) : analyses.length === 0 ? (
            <Card className="glass-effect border-0 p-6 text-center">
              <p className="text-muted-foreground">분석 기록이 없습니다</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {analyses.map((analysis) => (
                <Card key={analysis.id} className="glass-effect border-0 p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{formatTime(analysis.created_at)}</p>
                      <p className="text-sm text-muted-foreground">
                        강도: {(analysis.rms_avg * 100).toFixed(1)}% | 에너지: {analysis.energy_avg.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{formatDuration(analysis.duration)}</p>
                      <p className="text-xs text-muted-foreground">{analysis.spectral_centroid_mean.toFixed(0)} Hz</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Statistics;
