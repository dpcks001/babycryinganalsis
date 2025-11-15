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
import { useTranslation } from "@/lib/translations";

const Result = () => {
  const navigate = useNavigate();
  const [showSolutionDialog, setShowSolutionDialog] = useState(false);
  const t = useTranslation();

  const results = [
    { icon: Moon, label: t.sleepy, value: 78 },
    { icon: Frown, label: t.uncomfortable, value: 45 },
    { icon: Wind, label: t.uncomfortable, value: 22 },
    { icon: Utensils, label: t.hungry, value: 15 },
    { icon: Baby, label: t.uncomfortable, value: 5 },
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
        <h1 className="text-lg font-bold text-foreground">{t.analysisResult}</h1>
      </header>

      <main className="flex-1 pb-24 px-6 py-8">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-2">{t.analysisResult}</p>
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
          {t.checkSolution}
        </Button>
      </main>

      <BottomNav />

      <Dialog open={showSolutionDialog} onOpenChange={setShowSolutionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <topResult.icon className="h-6 w-6 text-primary" />
              {topResult.label} {t.solutionDialogDescription}
            </DialogTitle>
            <DialogDescription className="text-left space-y-4 pt-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {topResult.label === t.sleepy && t.sleepySolution}
                  {topResult.label === t.hungry && t.hungrySolution}
                  {topResult.label === t.uncomfortable && t.uncomfortableSolution}
                  {topResult.label === t.pain && t.painSolution}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <Button 
            onClick={() => setShowSolutionDialog(false)}
            className="w-full"
          >
            {t.close}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Result;
