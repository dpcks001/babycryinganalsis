import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Frown, Wind, Utensils, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BottomNav } from "@/components/BottomNav";

const Result = () => {
  const navigate = useNavigate();

  const results = [
    { icon: Moon, label: "졸림/과피곤", value: 78, color: "bg-primary" },
    { icon: Frown, label: "짜증/불편", value: 45, color: "bg-secondary" },
    { icon: Wind, label: "가스/배앓이", value: 22, color: "bg-muted-foreground" },
    { icon: Utensils, label: "배고픔", value: 15, color: "bg-muted-foreground" },
    { icon: Baby, label: "기저귀/일반 불편", value: 5, color: "bg-muted-foreground" },
  ];

  const topResult = results[0];

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
                <result.icon className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{result.label}</span>
                    <span className="text-lg font-bold text-accent">{result.value}%</span>
                  </div>
                  <Progress value={result.value} className="h-2" />
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
          onClick={() => navigate("/")}
        >
          대처 방법 확인하기
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Result;
