import { useState, useEffect } from "react";
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
  Shield,
  Camera,
  Calendar as CalendarIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [cloudSync, setCloudSync] = useState(false);
  const [theme, setTheme] = useState<"system" | "light" | "dark">("light");
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileName, setProfileName] = useState("우리아기");
  const [profileEmail, setProfileEmail] = useState("mybaby@email.com");
  const [babyName, setBabyName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [birthDate, setBirthDate] = useState<Date>();

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemTheme) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-center bg-background border-b border-border px-4">
        <h1 className="text-lg font-bold text-foreground">설정</h1>
      </header>

      <main className="flex-1 pb-24 px-6 py-6 space-y-6">
        <Card className="glass-effect border-0 p-6 bg-primary/10">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
              👶
              <button 
                onClick={() => setShowProfileDialog(true)}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Camera className="h-3 w-3 text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{profileName}</h2>
              <p className="text-sm text-muted-foreground">{profileEmail}</p>
            </div>
            <button 
              onClick={() => setShowProfileDialog(true)}
              className="text-sm text-accent font-medium"
            >
              계정 관리
            </button>
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
          </Card>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-accent mb-3 px-1">아기 정보</h3>
          <Card className="glass-effect border-0 divide-y divide-border">
            <div className="p-4 space-y-3">
              <Label className="text-foreground">아기 이름</Label>
              <Input 
                placeholder="이름을 입력하세요" 
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="p-4 space-y-3">
              <Label className="text-foreground">성별</Label>
              <div className="flex gap-2">
                <Button
                  variant={gender === "male" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setGender("male")}
                >
                  남자
                </Button>
                <Button
                  variant={gender === "female" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setGender("female")}
                >
                  여자
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <Label className="text-foreground">생년월일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "PPP", { locale: ko }) : <span>날짜를 선택하세요</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2020-01-01")
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
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

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>프로필 수정</DialogTitle>
            <DialogDescription>
              아기의 프로필 정보를 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl">
                👶
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Camera className="h-4 w-4 text-primary-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">프로필 사진 변경</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input 
                id="name" 
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="아기 이름"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input 
                id="email" 
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="이메일 주소"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowProfileDialog(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button 
              onClick={() => setShowProfileDialog(false)}
              className="flex-1"
            >
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
