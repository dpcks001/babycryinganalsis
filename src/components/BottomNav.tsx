import { Home, BarChart3, Settings } from "lucide-react";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 nav-glass-effect">
      <div className="flex h-20 items-center justify-around px-4">
        <NavLink
          to="/"
          className="flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl transition-all"
          activeClassName="bg-white/60 shadow-lg"
        >
          <Home className="h-6 w-6 transition-colors" />
          <span className="text-xs font-medium transition-colors">홈</span>
        </NavLink>

        <NavLink
          to="/statistics"
          className="flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl transition-all"
          activeClassName="bg-white/60 shadow-lg"
        >
          <BarChart3 className="h-6 w-6 transition-colors" />
          <span className="text-xs font-medium transition-colors">통계</span>
        </NavLink>

        <NavLink
          to="/settings"
          className="flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl transition-all"
          activeClassName="bg-white/60 shadow-lg"
        >
          <Settings className="h-6 w-6 transition-colors" />
          <span className="text-xs font-medium transition-colors">설정</span>
        </NavLink>
      </div>
    </nav>
  );
};
