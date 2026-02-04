import { cn } from "@/lib/utils";

interface RadarChartProps {
  data: {
    label: string;
    value: number;
    max?: number;
  }[];
  size?: number;
  className?: string;
  showLabels?: boolean;
  fillColor?: string;
  strokeColor?: string;
}

/**
 * Hexagonal radar chart for player attributes (like FIFA cards)
 */
export function RadarChart({
  data,
  size = 200,
  className,
  showLabels = true,
  fillColor = "hsl(192 85% 55% / 0.3)",
  strokeColor = "hsl(192 85% 55%)",
}: RadarChartProps) {
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = (size / 2) - 30; // Leave room for labels
  
  const angleStep = (2 * Math.PI) / data.length;
  const startAngle = -Math.PI / 2; // Start from top
  
  // Calculate points for the data polygon
  const dataPoints = data.map((item, index) => {
    const angle = startAngle + index * angleStep;
    const normalizedValue = (item.value / (item.max || 99));
    const radius = normalizedValue * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      labelX: centerX + (maxRadius + 20) * Math.cos(angle),
      labelY: centerY + (maxRadius + 20) * Math.sin(angle),
      label: item.label,
      value: item.value,
    };
  });
  
  // Create polygon path
  const polygonPath = dataPoints
    .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ") + " Z";
  
  // Create grid lines (background hexagons at 25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPaths = gridLevels.map(level => {
    const points = data.map((_, index) => {
      const angle = startAngle + index * angleStep;
      const radius = level * maxRadius;
      return `${index === 0 ? "M" : "L"} ${centerX + radius * Math.cos(angle)} ${centerY + radius * Math.sin(angle)}`;
    });
    return points.join(" ") + " Z";
  });
  
  // Create axis lines
  const axisLines = data.map((_, index) => {
    const angle = startAngle + index * angleStep;
    return {
      x1: centerX,
      y1: centerY,
      x2: centerX + maxRadius * Math.cos(angle),
      y2: centerY + maxRadius * Math.sin(angle),
    };
  });
  
  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid lines */}
        {gridPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="hsl(220 25% 20%)"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}
        
        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="hsl(220 25% 25%)"
            strokeWidth="1"
            opacity={0.5}
          />
        ))}
        
        {/* Data polygon */}
        <path
          d={polygonPath}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
        />
        
        {/* Data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={strokeColor}
          />
        ))}
      </svg>
      
      {/* Labels */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none">
          {dataPoints.map((point, i) => {
            // Adjust label position based on angle
            const angle = startAngle + i * angleStep;
            const isTop = angle < -Math.PI / 4 && angle > -3 * Math.PI / 4;
            const isRight = angle >= -Math.PI / 4 && angle <= Math.PI / 4;
            const isBottom = angle > Math.PI / 4 && angle < 3 * Math.PI / 4;
            
            let textAnchor = "middle";
            let translateX = 0;
            if (isRight) {
              textAnchor = "start";
              translateX = 5;
            } else if (!isTop && !isBottom && !isRight) {
              textAnchor = "end";
              translateX = -5;
            }
            
            return (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{
                  left: point.labelX,
                  top: point.labelY,
                  transform: `translate(${textAnchor === "start" ? "0" : textAnchor === "end" ? "-100%" : "-50%"}, -50%)`,
                }}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {point.label}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {point.value}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface AttributeHexagonProps {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  size?: number;
  className?: string;
}

/**
 * Pre-configured hexagon chart for the 6 main FIFA attributes
 */
export function AttributeHexagon({
  pace,
  shooting,
  passing,
  dribbling,
  defending,
  physical,
  size = 200,
  className,
}: AttributeHexagonProps) {
  const data = [
    { label: "PAC", value: pace },
    { label: "SHO", value: shooting },
    { label: "PAS", value: passing },
    { label: "DRI", value: dribbling },
    { label: "DEF", value: defending },
    { label: "PHY", value: physical },
  ];
  
  return <RadarChart data={data} size={size} className={className} />;
}
