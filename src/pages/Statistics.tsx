import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Utensils, Moon, Baby, Frown, Wind } from "lucide-react";
import { useTranslation } from "@/lib/translations";

type Period = "today" | "week" | "month";

const Statistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");
  const t = useTranslation();

  const cryData = {
    today: [
      { icon: Utensils, reason: t.hungry, time: "오후 2:30", duration: "5분 30초", bgColor: "bg-blue-50" },
      { icon: Moon, reason: t.sleepy, time: "오후 1:15", duration: "10분 12초", bgColor: "bg-purple-50" },
    ],
    week: [
      { icon: Utensils, reason: t.hungry, time: "오후 2:30", duration: "5분 30초", bgColor: "bg-blue-50" },
      { icon: Moon, reason: t.sleepy, time: "오후 1:15", duration: "10분 12초", bgColor: "bg-purple-50" },
      { icon: Baby, reason: t.uncomfortable, time: "오전 11:40", duration: "2분 5초", bgColor: "bg-yellow-50" },
    ],
    month: [
      { icon: Utensils, reason: t.hungry, time: "오후 2:30", duration: "5분 30초", bgColor: "bg-blue-50" },
      { icon: Moon, reason: t.sleepy, time: "오후 1:15", duration: "10분 12초", bgColor: "bg-purple-50" },
      { icon: Baby, reason: t.uncomfortable, time: "오전 11:40", duration: "2분 5초", bgColor: "bg-yellow-50" },
      { icon: Frown, reason: t.uncomfortable, time: "오전 9:20", duration: "8분 15초", bgColor: "bg-red-50" },
      { icon: Wind, reason: t.pain, time: "오전 7:00", duration: "15분 20초", bgColor: "bg-green-50" },
    ],
  };

  const weekDays = ["월", "화", "수", "목", "금", "토", "일"];

  const currentData = cryData[selectedPeriod];
  const totalCries = selectedPeriod === "today" ? 8 : selectedPeriod === "week" ? 15 : 42;

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
          <h2 className="text-base font-semibold text-foreground mb-4">{t.cryTypes}</h2>
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
                  <p className="text-xs text-muted-foreground">{t.totalCries}</p>
                  <p className="text-2xl font-bold text-foreground">{totalCries}{t.times}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                <span className="text-muted-foreground">{t.hungry}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                <span className="text-muted-foreground">{t.sleepy}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                <span className="text-muted-foreground">{t.uncomfortable}</span>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">{t.recentRecords}</h2>
          <div className="space-y-3">
            {currentData.map((item, index) => (
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
