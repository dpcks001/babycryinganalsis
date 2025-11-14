import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Bell, Volume2, Baby, Info } from "lucide-react";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [sensitivity, setSensitivity] = useState([70]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-center bg-white/70 backdrop-blur-xl px-4">
        <h1 className="text-xl font-bold text-foreground">설정</h1>
      </header>

      <main className="flex-1 pb-24 px-4 py-6 space-y-6">
        {/* Notification Settings */}
        <Card className="glass-effect border-0 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">알림 설정</h2>
              <p className="text-sm text-muted-foreground">분석 결과 알림 받기</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground">푸시 알림</span>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </Card>

        {/* Sound Settings */}
        <Card className="glass-effect border-0 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Volume2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">소리 설정</h2>
              <p className="text-sm text-muted-foreground">알림음 켜기/끄기</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground">알림음</span>
            <Switch checked={sound} onCheckedChange={setSound} />
          </div>
        </Card>

        {/* Sensitivity Settings */}
        <Card className="glass-effect border-0 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Baby className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">민감도 설정</h2>
              <p className="text-sm text-muted-foreground">울음 감지 민감도 조절</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">낮음</span>
              <span className="text-sm text-muted-foreground">높음</span>
            </div>
            <Slider
              value={sensitivity}
              onValueChange={setSensitivity}
              max={100}
              step={10}
              className="w-full"
            />
            <p className="text-center text-sm font-semibold text-accent">
              {sensitivity[0]}%
            </p>
          </div>
        </Card>

        {/* App Info */}
        <Card className="glass-effect border-0 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Info className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">앱 정보</h2>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">버전</span>
              <span className="text-foreground font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">개발자</span>
              <span className="text-foreground font-medium">BabyCry Team</span>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;
