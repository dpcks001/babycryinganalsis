import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Utensils, Moon, Baby } from "lucide-react";

type Period = "today" | "week" | "month";

const Statistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");

  const cryData = [
    { icon: Utensils, reason: "배고파서 울었어요", time: "오후 2:30", duration: "5분 30초 동안 울었어요", bgColor: "bg-blue-50" },
    { icon: Moon, reason: "잠이 와서 칭얼거렸어요", time: "오후 1:15", duration: "10분 12초 동안 울었어요", bgColor: "bg-purple-50" },
    { icon: Baby, reason: "기저귀가 불편해요", time: "오전 11:40", duration: "2분 5초 동안 울었어요", bgColor: "bg-yellow-50" },
  ];

  const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-center bg-background border-b border-border px-4">
        <h1 className="text-lg font-bold text-foreground">우리아기 울음기록</h1>
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
              {period === "today" && "오늘"}
              {period === "week" && "이번주"}
              {period === "month" && "이번달"}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-base font-semibold text-foreground mb-4">울음 종류</h2>
          <Card className="glass-effect border-0 p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="12" 
                    strokeDasharray="75 251" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="12" 
                    strokeDasharray="63 251" strokeDashoffset="-75" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--chart-3))" strokeWidth="12" 
                    strokeDasharray="63 251" strokeDashoffset="-138" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted-foreground">총 울음</p>
                  <p className="text-2xl font-bold text-foreground">15회</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                <span className="text-muted-foreground">배고픔</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                <span className="text-muted-foreground">졸음</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                <span className="text-muted-foreground">불편함</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-base font-semibold text-foreground mb-4">주간 울음 시간</h2>
          <Card className="glass-effect border-0 p-6">
            <div className="flex items-end justify-between h-40 gap-2">
              {weekDays.map((day, index) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 w-full flex items-end">
                    <div 
                      className="w-full bg-primary/30 rounded-t-lg transition-all"
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">최근 울음 기록</h2>
          <div className="space-y-3">
            {cryData.map((item, index) => (
              <Card key={index} className={`glass-effect border-0 p-4 ${item.bgColor}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-1">{item.reason}</p>
                    <p className="text-xs text-muted-foreground">{item.duration}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Statistics;
