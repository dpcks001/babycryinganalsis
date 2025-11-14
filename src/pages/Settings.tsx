import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Check, 
  Bell, 
  Volume2, 
  Cloud, 
  Trash2,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Info,
  FileText,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [cloudSync, setCloudSync] = useState(false);
  const [theme, setTheme] = useState<"system" | "light" | "dark">("light");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-center bg-background border-b border-border px-4">
        <button
          onClick={() => navigate("/")}
          className="absolute left-4 p-2"
        >
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">설정</h1>
        <button className="absolute right-4 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
          <Check className="h-5 w-5 text-white" />
        </button>
      </header>

      <main className="flex-1 pb-24 px-6 py-6 space-y-6">
        <Card className="glass-effect border-0 p-6 bg-primary/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
              👶
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">우리아기</h2>
              <p className="text-sm text-muted-foreground">mybaby@email.com</p>
            </div>
            <button className="text-sm text-accent font-medium">계정 관리</button>
          </div>
        </Card>

        <div>
          <h3 className="text-xs font-semibold text-accent mb-3 px-1">알림</h3>
          <Card className="glass-effect border-0 divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-accent" />
                <span className="text-foreground">푸시 알림</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <button className="flex items-center justify-between p-4 w-full text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-accent" />
                <span className="text-foreground">소리 및 진동</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
          </Card>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-accent mb-3 px-1">데이터</h3>
          <Card className="glass-effect border-0 divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Cloud className="h-5 w-5 text-accent" />
                <span className="text-foreground">클라우드에 데이터 저장</span>
              </div>
              <Switch checked={cloudSync} onCheckedChange={setCloudSync} />
            </div>
            <button className="flex items-center justify-between p-4 w-full text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-accent" />
                <span className="text-foreground">캐시 지우기</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
          </Card>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-accent mb-3 px-1">화면</h3>
          <Card className="glass-effect border-0 p-4">
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("system")}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${
                  theme === "system" ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <SettingsIcon className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-foreground">시스템</span>
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${
                  theme === "light" ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                }`}
              >
                <Sun className="h-6 w-6" />
                <span className="text-sm">화이트</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${
                  theme === "dark" ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <Moon className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-foreground">다크</span>
              </button>
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-accent mb-3 px-1">일반</h3>
          <Card className="glass-effect border-0 divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-accent" />
                <span className="text-foreground">앱 버전</span>
              </div>
              <span className="text-muted-foreground">v1.0.0</span>
            </div>
            <button className="flex items-center justify-between p-4 w-full text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-accent" />
                <span className="text-foreground">서비스 이용약관</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
            <button className="flex items-center justify-between p-4 w-full text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-accent" />
                <span className="text-foreground">개인정보 처리방침</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
          </Card>
        </div>

        <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
          로그아웃
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;
