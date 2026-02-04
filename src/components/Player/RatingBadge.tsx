import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

/**
 * Get rating color based on value (like CMTracker/SoFIFA style)
 */
function getRatingColor(rating: number): string {
  if (rating >= 85) return "from-emerald-500 to-emerald-600"; // World class
  if (rating >= 80) return "from-green-500 to-green-600"; // Great
  if (rating >= 75) return "from-lime-500 to-lime-600"; // Good
  if (rating >= 70) return "from-yellow-500 to-yellow-600"; // Decent
  if (rating >= 65) return "from-amber-500 to-amber-600"; // Average
  if (rating >= 60) return "from-orange-500 to-orange-600"; // Below average
  return "from-red-500 to-red-600"; // Poor
}

function getRatingBorderColor(rating: number): string {
  if (rating >= 85) return "border-emerald-400/50";
  if (rating >= 80) return "border-green-400/50";
  if (rating >= 75) return "border-lime-400/50";
  if (rating >= 70) return "border-yellow-400/50";
  if (rating >= 65) return "border-amber-400/50";
  if (rating >= 60) return "border-orange-400/50";
  return "border-red-400/50";
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

export function RatingBadge({ 
  rating, 
  size = "md", 
  showLabel = false,
  label,
  className 
}: RatingBadgeProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-lg font-bold text-white shadow-lg border-2",
          "bg-gradient-to-br",
          getRatingColor(rating),
          getRatingBorderColor(rating),
          sizeClasses[size]
        )}
      >
        {rating}
      </div>
      {showLabel && label && (
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}

interface PotentialBadgeProps {
  current: number;
  potential: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PotentialBadge({ 
  current, 
  potential, 
  size = "md",
  className 
}: PotentialBadgeProps) {
  const growth = potential - current;
  const growthPercentage = current > 0 ? Math.round((growth / current) * 100) : 0;
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <RatingBadge rating={current} size={size} showLabel label="OVR" />
      <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground">→</span>
        {growth > 0 && (
          <span className="text-xs font-medium text-emerald-400">+{growth}</span>
        )}
      </div>
      <RatingBadge rating={potential} size={size} showLabel label="POT" />
    </div>
  );
}

interface AttributeBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function AttributeBar({ 
  value, 
  max = 99, 
  label,
  showValue = true,
  size = "md",
  className 
}: AttributeBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getBarColor = (val: number): string => {
    if (val >= 85) return "bg-emerald-500";
    if (val >= 75) return "bg-green-500";
    if (val >= 65) return "bg-yellow-500";
    if (val >= 55) return "bg-orange-500";
    return "bg-red-500";
  };
  
  return (
    <div className={cn("space-y-1", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className={cn(
              "text-muted-foreground",
              size === "sm" ? "text-xs" : "text-sm"
            )}>
              {label}
            </span>
          )}
          {showValue && (
            <span className={cn(
              "font-semibold",
              size === "sm" ? "text-xs" : "text-sm",
              value >= 75 ? "text-emerald-400" : value >= 60 ? "text-foreground" : "text-muted-foreground"
            )}>
              {value}
            </span>
          )}
        </div>
      )}
      <div className={cn(
        "w-full rounded-full bg-secondary/50",
        size === "sm" ? "h-1.5" : "h-2"
      )}>
        <div
          className={cn("rounded-full transition-all duration-300", getBarColor(value))}
          style={{ width: `${percentage}%`, height: "100%" }}
        />
      </div>
    </div>
  );
}
