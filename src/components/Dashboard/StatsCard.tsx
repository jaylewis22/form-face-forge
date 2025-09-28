import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export function StatsCard({ label, value, className }: StatsCardProps) {
  return (
    <div className={cn("glass rounded-lg p-6", className)}>
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}