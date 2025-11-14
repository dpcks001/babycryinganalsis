import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

type Period = "today" | "week" | "month";

const Statistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("today");

  const cryData = [
    { id: 1, reason: "배고픔", emoji: "🍼", time: "오전 10:30", count: 3 },
    { id: 2, reason: "졸림", emoji: "😴", time: "오후 2:15", count: 2 },
    { id: 3, reason: "불편함", emoji: "😣", time: "오후 4:45", count: 1 },
    { id: 4, reason: "배고픔", emoji: "🍼", time: "오후 6:20", count: 2 },
  ];

  const stats = {
    today: { total: 8, most: "배고픔", avgDuration: "2분 30초" },
    week: { total: 45, most: "졸림", avgDuration: "2분 15초" },
    month: { total: 180, most: "배고픔", avgDuration: "2분 45초" },
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-center bg-white/70 backdrop-blur-xl px-4">
        <h1 className="text-xl font-bold text-foreground">우리아기 울음기록</h1>
      </header>

      <main className="flex-1 pb-24 px-4 py-6">
        {/* Period Filter */}
        <div className="flex gap-2 p-1 rounded-full bg-muted/50 backdrop-blur-xl mb-6">
          {(["today", "week", "month"] as Period[]).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedPeriod === period
                  ? "bg-gradient-to-r from-primary/80 to-secondary/80 text-white shadow-lg"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {period === "today" && "오늘"}
              {period === "week" && "이번 주"}
              {period === "month" && "이번 달"}
            </button>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="glass-effect p-4 text-center border-0">
            <p className="text-2xl font-bold text-foreground">{stats[selectedPeriod].total}</p>
            <p className="text-xs text-muted-foreground mt-1">총 횟수</p>
          </Card>
          <Card className="glass-effect p-4 text-center border-0">
            <p className="text-2xl font-bold text-foreground">{stats[selectedPeriod].most}</p>
            <p className="text-xs text-muted-foreground mt-1">가장 많은 원인</p>
          </Card>
          <Card className="glass-effect p-4 text-center border-0">
            <p className="text-sm font-bold text-foreground">{stats[selectedPeriod].avgDuration}</p>
            <p className="text-xs text-muted-foreground mt-1">평균 시간</p>
          </Card>
        </div>

        {/* Cry History */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground mb-4">울음 기록</h2>
          {cryData.map((item) => (
            <Card key={item.id} className="glass-effect border-0 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{item.emoji}</span>
                  <div>
                    <p className="font-semibold text-foreground">{item.reason}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-accent">{item.count}회</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Statistics;
