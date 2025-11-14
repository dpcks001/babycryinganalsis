import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Frown, Wind, Utensils, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BottomNav } from "@/components/BottomNav";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Result = () => {
  const navigate = useNavigate();
  const [showSolutionDialog, setShowSolutionDialog] = useState(false);

  const results = [
    { icon: Moon, label: "졸림/과피곤", value: 78 },
    { icon: Frown, label: "짜증/불편", value: 45 },
    { icon: Wind, label: "가스/배앓이", value: 22 },
    { icon: Utensils, label: "배고픔", value: 15 },
    { icon: Baby, label: "기저귀/일반 불편", value: 5 },
  ];

  const topResult = results[0];

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
        <h1 className="text-lg font-bold text-foreground">분석 결과</h1>
      </header>

      <main className="flex-1 pb-24 px-6 py-8">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-2">지금 우는건...</p>
          <h2 className="text-3xl font-bold text-foreground mb-8">{topResult.label}</h2>
          
          <div className="w-48 h-48 mx-auto rounded-full bg-primary/10 flex items-center justify-center glow-effect mb-8">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
              <topResult.icon className="h-16 w-16 text-primary-foreground" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {results.map((result, index) => (
            <Card key={index} className="glass-effect p-5 border-0">
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
            </Card>
          ))}
        </div>

        <p className="text-sm text-center text-muted-foreground mb-6">
          아이콘을 탭하여 상태를 수정할 수 있습니다
        </p>

        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base"
          onClick={() => setShowSolutionDialog(true)}
        >
          대처 방법 확인하기
        </Button>
      </main>

      <BottomNav />

      <Dialog open={showSolutionDialog} onOpenChange={setShowSolutionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <topResult.icon className="h-6 w-6 text-primary" />
              {topResult.label} 대처 방법
            </DialogTitle>
            <DialogDescription className="text-left space-y-4 pt-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">증상</h4>
                <p className="text-sm text-muted-foreground">
                  아기가 눈을 비비거나 하품을 하며 보챕니다. 
                  수면 시간이 다가왔거나 과도한 자극으로 피곤한 상태입니다.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">대처 방법</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• 조용하고 어두운 환경 만들기</li>
                  <li>• 부드럽게 안아서 흔들어주기</li>
                  <li>• 백색소음이나 자장가 틀어주기</li>
                  <li>• 편안한 온도 유지하기</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <Button 
            onClick={() => setShowSolutionDialog(false)}
            className="w-full"
          >
            확인
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Result;
