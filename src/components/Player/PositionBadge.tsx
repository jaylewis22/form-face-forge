import { cn } from "@/lib/utils";

interface PositionBadgeProps {
  position: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Position colors like FIFA/FC Ultimate Team cards
const positionColors: Record<string, { bg: string; text: string; border: string }> = {
  // Goalkeepers
  GK: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/50" },
  
  // Defenders
  CB: { bg: "bg-sky-500/20", text: "text-sky-400", border: "border-sky-500/50" },
  LB: { bg: "bg-sky-500/20", text: "text-sky-400", border: "border-sky-500/50" },
  RB: { bg: "bg-sky-500/20", text: "text-sky-400", border: "border-sky-500/50" },
  LWB: { bg: "bg-sky-500/20", text: "text-sky-400", border: "border-sky-500/50" },
  RWB: { bg: "bg-sky-500/20", text: "text-sky-400", border: "border-sky-500/50" },
  
  // Midfielders
  CDM: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/50" },
  CM: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/50" },
  CAM: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/50" },
  LM: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/50" },
  RM: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/50" },
  
  // Forwards
  LW: { bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500/50" },
  RW: { bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500/50" },
  CF: { bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500/50" },
  ST: { bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500/50" },
};

// Default colors for unknown positions
const defaultColors = { bg: "bg-secondary/50", text: "text-foreground", border: "border-border" };

const sizeClasses = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export function PositionBadge({ position, size = "md", className }: PositionBadgeProps) {
  const normalizedPosition = position?.toUpperCase()?.trim() || "N/A";
  const colors = positionColors[normalizedPosition] || defaultColors;
  
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded font-semibold border",
        colors.bg,
        colors.text,
        colors.border,
        sizeClasses[size],
        className
      )}
    >
      {normalizedPosition}
    </span>
  );
}

// Position group badge for displaying position type
interface PositionGroupProps {
  position: string;
  className?: string;
}

export function getPositionGroup(position: string): string {
  const pos = position?.toUpperCase()?.trim();
  
  if (pos === "GK") return "Goalkeeper";
  if (["CB", "LB", "RB", "LWB", "RWB"].includes(pos)) return "Defender";
  if (["CDM", "CM", "CAM", "LM", "RM"].includes(pos)) return "Midfielder";
  if (["LW", "RW", "CF", "ST"].includes(pos)) return "Forward";
  
  return "Unknown";
}

export function PositionGroup({ position, className }: PositionGroupProps) {
  const group = getPositionGroup(position);
  
  const groupColors: Record<string, string> = {
    Goalkeeper: "text-amber-400",
    Defender: "text-sky-400",
    Midfielder: "text-emerald-400",
    Forward: "text-rose-400",
    Unknown: "text-muted-foreground",
  };
  
  return (
    <span className={cn("text-sm font-medium", groupColors[group], className)}>
      {group}
    </span>
  );
}
