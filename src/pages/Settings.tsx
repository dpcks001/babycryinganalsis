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
  Calendar as CalendarIcon,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import { ko, enUS, ja, zhCN, es, fr, de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { toast } from "sonner";

// Get system locale
const getSystemLocale = () => {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('ko')) return ko;
  if (lang.startsWith('ja')) return ja;
  if (lang.startsWith('zh')) return zhCN;
  if (lang.startsWith('es')) return es;
  if (lang.startsWith('fr')) return fr;
  if (lang.startsWith('de')) return de;
  return enUS;
};

const Settings = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const { signOut, user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [cloudSync, setCloudSync] = useState(false);
  const [theme, setTheme] = useState<"system" | "light" | "dark">(() => {
    const saved = localStorage.getItem('theme');
    return (saved as "system" | "light" | "dark") || "system";
  });
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileName, setProfileName] = useState("우리아기");
  const [profileEmail, setProfileEmail] = useState("mybaby@email.com");
  const [babyName, setBabyName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [birthDate, setBirthDate] = useState<Date>(() => {
    const saved = localStorage.getItem('babyBirthDate');
    return saved ? new Date(saved) : undefined;
  });
  const [tempBirthDate, setTempBirthDate] = useState<Date>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const handleBirthDateConfirm = () => {
    if (tempBirthDate) {
      setBirthDate(tempBirthDate);
      localStorage.setItem('babyBirthDate', tempBirthDate.toISOString());
      setIsDatePickerOpen(false);
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
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
        <h1 className="text-lg font-bold text-foreground">{t.settingsTitle}</h1>
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
              {t.accountManagement}
            </button>
          </div>
        </Card>

        <div>
          <h3 className="text-xs font-semibold text-accent mb-3 px-1">{t.notifications}</h3>
          <Card className="glass-effect border-0 divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-accent" />
                <span className="text-foreground">{t.pushNotification}</span>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-accent mb-3 px-1">{t.babyInfo}</h3>
          <Card className="glass-effect border-0 divide-y divide-border">
            <div className="p-4 space-y-3">
              <Label className="text-foreground">{t.babyName}</Label>
              <Input 
                placeholder={t.enterName}
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="p-4 space-y-3">
              <Label className="text-foreground">{t.gender}</Label>
              <div className="flex gap-2">
                <Button
                  variant={gender === "male" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setGender("male")}
                >
                  {t.male}
                </Button>
                <Button
                  variant={gender === "female" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setGender("female")}
                >
                  {t.female}
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <Label className="text-foreground">{t.birthDate}</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "PPP", { locale: getSystemLocale() }) : <span>{t.selectDate}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempBirthDate}
                    onSelect={setTempBirthDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2020-01-01")
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                  <div className="p-3 border-t border-border">
                    <Button 
                      className="w-full"
                      onClick={() => {
                        if (tempBirthDate) {
                          setBirthDate(tempBirthDate);
                          setIsDatePickerOpen(false);
                        }
                      }}
                      disabled={!tempBirthDate}
                    >
                      {t.confirm}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-accent mb-3 px-1">{t.data}</h3>
          <Card className="glass-effect border-0 divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Cloud className="h-5 w-5 text-accent" />
                <span className="text-foreground">{t.cloudSync}</span>
              </div>
              <Switch checked={cloudSync} onCheckedChange={setCloudSync} />
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-accent mb-3 px-1">{t.display}</h3>
          <Card className="glass-effect border-0 p-4">
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("system")}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${
                  theme === "system" ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <SettingsIcon className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-foreground">{t.system}</span>
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${
                  theme === "light" ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                }`}
              >
                <Sun className="h-6 w-6" />
                <span className="text-sm">{t.light}</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${
                  theme === "dark" ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                <Moon className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-foreground">{t.dark}</span>
              </button>
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-accent mb-3 px-1">{t.appInfo}</h3>
          <Card className="glass-effect border-0 divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-accent" />
                <span className="text-foreground">{t.version}</span>
              </div>
              <span className="text-muted-foreground">v1.0.0</span>
            </div>
            <button className="flex items-center justify-between p-4 w-full text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-accent" />
                <span className="text-foreground">{t.termsOfService}</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
            <button className="flex items-center justify-between p-4 w-full text-left hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-accent" />
                <span className="text-foreground">{t.privacyPolicy}</span>
              </div>
              <span className="text-muted-foreground">›</span>
            </button>
          </Card>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-accent mb-3 px-1">계정</h3>
          <Card className="glass-effect border-0 divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-accent" />
                <span className="text-foreground">이메일</span>
              </div>
              <span className="text-muted-foreground text-sm">{user?.email}</span>
            </div>
          </Card>
        </div>

        <Button 
          variant="ghost" 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={async () => {
            await signOut();
            toast.success("로그아웃되었습니다");
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </Button>
      </main>

      <BottomNav />

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.profileDialogTitle}</DialogTitle>
            <DialogDescription>
              {t.profileDialogDescription}
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input 
                id="name" 
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder={t.name}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input 
                id="email" 
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder={t.email}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowProfileDialog(false)}
              className="flex-1"
            >
              {t.cancel}
            </Button>
            <Button 
              onClick={() => setShowProfileDialog(false)}
              className="flex-1"
            >
              {t.save}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
