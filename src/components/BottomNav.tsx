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
          activeClassName="text-accent"
        >
          <Home className="h-6 w-6 transition-colors" />
          <span className="text-xs font-medium transition-colors">홈</span>
        </NavLink>

        <NavLink
          to="/statistics"
          className="flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl transition-all"
          activeClassName="text-accent"
        >
          <BarChart3 className="h-6 w-6 transition-colors" />
          <span className="text-xs font-medium transition-colors">히스토리</span>
        </NavLink>

        <NavLink
          to="/settings"
          className="flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl transition-all"
          activeClassName="text-accent"
        >
          <Settings className="h-6 w-6 transition-colors" />
          <span className="text-xs font-medium transition-colors">설정</span>
        </NavLink>
      </div>
    </nav>
  );
};
