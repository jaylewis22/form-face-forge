import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  User, 
  Trophy, 
  Calendar, 
  Settings, 
  Layers3,
  Shield,
  Plus,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Layers3, label: "Roster", path: "/roster" },
  { icon: Users, label: "Players", path: "/players" },
  { icon: Shield, label: "Teams", path: "/teams" },
  { icon: Plus, label: "Creation Hub", path: "/creation-hub" },
  { icon: Trophy, label: "Leagues", path: "/trophies" },
  { icon: Calendar, label: "Schedule", path: "/schedule" },
  { icon: Database, label: "Database", path: "/database" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-20 bg-sidebar-background border-r border-sidebar-border flex flex-col items-center py-6 z-50">
      <div className="mb-8">
        <Link to="/" className="flex items-center justify-center">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-sm">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
        </Link>
      </div>

      <nav className="flex-1 w-full">
        <ul className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center justify-center w-full py-3 transition-all duration-200 relative group",
                    isActive && "text-primary"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full glow-sm" />
                  )}
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-border">
                    {item.label}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto">
        <Link to="/profile" className="flex items-center justify-center">
          <div className="p-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-all duration-200">
            <User className="w-5 h-5" />
          </div>
        </Link>
      </div>
    </aside>
  );
}