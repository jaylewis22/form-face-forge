import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
  className?: string;
}

export function DashboardCard({ 
  title, 
  icon: Icon, 
  iconColor = "text-primary",
  onClick, 
  className 
}: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "card-interactive p-8 rounded-xl flex flex-col items-center justify-center gap-4 min-h-[200px] group",
        className
      )}
    >
      <div className={cn(
        "p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 group-hover:scale-110",
        iconColor
      )}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-center">{title}</h3>
    </div>
  );
}