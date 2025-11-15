import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Frown, Wind, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/lib/translations";
import { toast } from "sonner";

const Result = () => {
  const navigate = useNavigate();
  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState<number | null>(null);
  const [babyAgeMonths, setBabyAgeMonths] = useState<number>(0);
  const t = useTranslation();

  useEffect(() => {
    const birthDateStr = localStorage.getItem('babyBirthDate');
    if (birthDateStr) {
      const birthDate = new Date(birthDateStr);
      const today = new Date();
      const months = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
      setBabyAgeMonths(Math.max(0, months));
    }
  }, []);

  const results = [
    { 
      icon: Moon, 
      label: t.sleepy, 
      value: 78,
      quickTip: babyAgeMonths < 3 ? "자주 재우고 안정적인 환경을 만들어주세요" : 
                babyAgeMonths < 12 ? "낮잠 시간을 일정하게 유지하세요" :
                "규칙적인 수면 패턴을 만들어주세요"
    },
    { 
      icon: Frown, 
      label: t.uncomfortable, 
      value: 45,
      quickTip: babyAgeMonths < 6 ? "기저귀를 확인하고 배를 따뜻하게 해주세요" :
                "불편한 부분이 없는지 옷과 주변을 확인하세요"
    },
    { 
      icon: Wind, 
      label: t.uncomfortable, 
      value: 22,
      quickTip: "트림을 시키거나 배를 부드럽게 마사지해주세요"
    },
  ].slice(0, 3);

  const topResult = results[0];

  const getAgeBasedSolutions = (label: string) => {
    if (label === t.sleepy) {
      if (babyAgeMonths < 3) {
        return [
          "자주 재워주세요 (2-3시간마다)",
          "조용하고 어두운 환경을 만들어주세요",
          "스와들링(포대기)을 시도해보세요",
        ];
      } else if (babyAgeMonths < 12) {
        return [
          "낮잠 루틴을 일정하게 유지하세요",
          "졸음 신호를 빠르게 알아채세요",
          "백색소음을 활용해보세요",
        ];
      } else {
        return [
          "규칙적인 수면 스케줄을 만드세요",
          "잠자기 전 조용한 활동을 하세요",
          "낮잠은 오후 3시 이전에 마무리하세요",
        ];
      }
    } else if (label === t.uncomfortable) {
      if (babyAgeMonths < 6) {
        return [
          "기저귀를 확인하고 교체하세요",
          "배를 따뜻하게 해주세요",
          "부드럽게 안아주고 흔들어주세요",
        ];
      } else {
        return [
          "옷이 끼거나 불편하지 않은지 확인하세요",
          "실내 온도와 습도를 적절하게 유지하세요",
          "피부 발진이나 자극이 없는지 확인하세요",
        ];
      }
    } else if (label === t.hungry) {
      if (babyAgeMonths < 6) {
        return [
          "2-3시간마다 수유하세요",
          "충분한 양을 먹었는지 확인하세요",
          "트림을 꼭 시켜주세요",
        ];
      } else {
        return [
          "이유식 시간을 규칙적으로 유지하세요",
          "간식을 적절히 제공하세요",
          "물을 충분히 제공하세요",
        ];
      }
    }
    return ["대처 방법을 준비 중입니다."];
  };

  const handleCorrectAnswer = (correct: boolean) => {
    if (correct) {
      setIsConfirmed(true);
      toast.success(t.saved);
    } else {
      setShowCorrectionDialog(true);
    }
  };

  const handleOptionSelect = (result: typeof results[0]) => {
    setIsConfirmed(true);
    setShowCorrectionDialog(false);
    toast.success(t.saved);
  };

  const getColorClass = (value: number) => {
    if (value > 40) {
      return "text-primary";
    }
    return "text-muted-foreground";
  };

  const getProgressColor = (value: number) => {
    if (value > 40) {
      return "bg-primary";
    }
    return "bg-muted";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-center bg-background border-b border-border px-4">
        <button
          onClick={() => navigate("/")}
          className="absolute left-4 p-2"
        >
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">{t.analysisResult}</h1>
      </header>

      <main className="flex-1 pb-24 px-6 py-8">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-2">{t.analysisResult}</p>
          <h2 className="text-3xl font-bold text-foreground mb-4">{topResult.label}</h2>
          <p className="text-sm text-muted-foreground mb-6">{topResult.quickTip}</p>
          
          <div className="w-48 h-48 mx-auto rounded-full bg-primary/10 flex items-center justify-center glow-effect mb-6">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
              <topResult.icon className="h-16 w-16 text-primary-foreground" strokeWidth={1.5} />
            </div>
          </div>

          {!isConfirmed && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">{t.isThisCorrect}</p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => handleCorrectAnswer(true)}
                  className="gap-2"
                  variant="default"
                >
                  <Check className="h-4 w-4" />
                  {t.yes}
                </Button>
                <Button
                  onClick={() => handleCorrectAnswer(false)}
                  className="gap-2"
                  variant="outline"
                >
                  <X className="h-4 w-4" />
                  {t.no}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-8">
          {results.map((result, index) => (
            <Card 
              key={index} 
              className="glass-effect p-5 border-0 cursor-pointer transition-all hover:bg-accent/5"
              onClick={() => setSelectedResultIndex(selectedResultIndex === index ? null : index)}
            >
              <div className="flex items-center gap-4 mb-3">
                <result.icon 
                  className={`h-8 w-8 ${getColorClass(result.value)}`} 
                  strokeWidth={1.5} 
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{result.label}</span>
                    <span className={`text-lg font-bold ${getColorClass(result.value)}`}>
                      {result.value}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${getProgressColor(result.value)}`}
                      style={{ width: `${result.value}%` }}
                    />
                  </div>
                </div>
              </div>

              {selectedResultIndex === index && (
                <div className="mt-4 pt-4 border-t border-border space-y-3 animate-in slide-in-from-top-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {t.solutionMethods}
                    {babyAgeMonths > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ({babyAgeMonths}{t.months})
                      </span>
                    )}
                  </h3>
                  <ul className="space-y-2">
                    {getAgeBasedSolutions(result.label).map((solution, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />

      <Dialog open={showCorrectionDialog} onOpenChange={setShowCorrectionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.selectCorrectOption}</DialogTitle>
            <DialogDescription className="text-left space-y-3 pt-4">
              {results.map((result, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => handleOptionSelect(result)}
                >
                  <result.icon className="h-5 w-5" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{result.label}</div>
                    <div className="text-xs text-muted-foreground">{result.value}%</div>
                  </div>
                </Button>
              ))}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Result;
