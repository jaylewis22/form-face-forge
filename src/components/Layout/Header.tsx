import { Search, Bell, User, Trophy, Users, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "success" | "warning" | "info" | "error";
  icon: React.ElementType;
  read: boolean;
}

export function Header() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Match Result",
      description: "Manchester United won 3-1 against Liverpool",
      time: "2 hours ago",
      type: "success",
      icon: Trophy,
      read: false,
    },
    {
      id: "2",
      title: "Player Update",
      description: "John Smith has recovered from injury",
      time: "5 hours ago",
      type: "info",
      icon: Users,
      read: false,
    },
    {
      id: "3",
      title: "Upcoming Match",
      description: "Next match scheduled for tomorrow at 3:00 PM",
      time: "1 day ago",
      type: "warning",
      icon: Calendar,
      read: true,
    },
    {
      id: "4",
      title: "Squad Alert",
      description: "Low squad depth in midfield position",
      time: "2 days ago",
      type: "error",
      icon: AlertCircle,
      read: true,
    },
    {
      id: "5",
      title: "Transfer Complete",
      description: "Successfully signed new striker",
      time: "3 days ago",
      type: "success",
      icon: CheckCircle,
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getTypeStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-amber-500";
      case "error":
        return "text-red-500";
      default:
        return "text-cyan-500";
    }
  };

  return (
    <header className="fixed top-0 left-20 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 z-40">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search players, teams, or stats..."
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadCount}
                  </span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 p-3 cursor-pointer",
                        !notification.read && "bg-primary/5"
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className={cn("mt-0.5", getTypeStyles(notification.type))}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <Badge variant="default" className="h-4 px-1 text-[10px]">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  );
                })
              )}
            </ScrollArea>
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-sm text-primary cursor-pointer">
                  View all notifications
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}