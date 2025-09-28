import { useState } from "react";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  name: string;
  number: number;
  position: { x: number; y: number };
}

const formations: Record<string, Player[]> = {
  "4-4-2": [
    { id: "gk", name: "Goalkeeper", number: 1, position: { x: 50, y: 90 } },
    // Defense
    { id: "lb", name: "Left Back", number: 3, position: { x: 15, y: 70 } },
    { id: "cb1", name: "Center Back", number: 4, position: { x: 35, y: 75 } },
    { id: "cb2", name: "Center Back", number: 5, position: { x: 65, y: 75 } },
    { id: "rb", name: "Right Back", number: 2, position: { x: 85, y: 70 } },
    // Midfield
    { id: "lm", name: "Left Mid", number: 11, position: { x: 15, y: 45 } },
    { id: "cm1", name: "Center Mid", number: 6, position: { x: 35, y: 50 } },
    { id: "cm2", name: "Center Mid", number: 8, position: { x: 65, y: 50 } },
    { id: "rm", name: "Right Mid", number: 7, position: { x: 85, y: 45 } },
    // Attack
    { id: "st1", name: "Striker", number: 9, position: { x: 35, y: 20 } },
    { id: "st2", name: "Striker", number: 10, position: { x: 65, y: 20 } },
  ],
  "4-3-3": [
    { id: "gk", name: "Goalkeeper", number: 1, position: { x: 50, y: 90 } },
    // Defense
    { id: "lb", name: "Left Back", number: 3, position: { x: 15, y: 70 } },
    { id: "cb1", name: "Center Back", number: 4, position: { x: 35, y: 75 } },
    { id: "cb2", name: "Center Back", number: 5, position: { x: 65, y: 75 } },
    { id: "rb", name: "Right Back", number: 2, position: { x: 85, y: 70 } },
    // Midfield
    { id: "cm1", name: "Center Mid", number: 6, position: { x: 30, y: 50 } },
    { id: "cm2", name: "Center Mid", number: 8, position: { x: 50, y: 45 } },
    { id: "cm3", name: "Center Mid", number: 10, position: { x: 70, y: 50 } },
    // Attack
    { id: "lw", name: "Left Wing", number: 11, position: { x: 20, y: 20 } },
    { id: "st", name: "Striker", number: 9, position: { x: 50, y: 15 } },
    { id: "rw", name: "Right Wing", number: 7, position: { x: 80, y: 20 } },
  ],
};

export function FormationField() {
  const [selectedFormation, setSelectedFormation] = useState("4-4-2");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const players = formations[selectedFormation];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Formation</h2>
        <select
          value={selectedFormation}
          onChange={(e) => setSelectedFormation(e.target.value)}
          className="bg-secondary border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="4-4-2">4-4-2</option>
          <option value="4-3-3">4-3-3</option>
        </select>
      </div>

      <div className="relative w-full aspect-[3/4] field-gradient rounded-xl overflow-hidden">
        {/* Field Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Outer boundary */}
          <rect x="5" y="5" width="90" height="90" fill="none" stroke="white" strokeWidth="0.3" opacity="0.3" />
          
          {/* Center line */}
          <line x1="5" y1="50" x2="95" y2="50" stroke="white" strokeWidth="0.3" opacity="0.3" />
          
          {/* Center circle */}
          <circle cx="50" cy="50" r="10" fill="none" stroke="white" strokeWidth="0.3" opacity="0.3" />
          <circle cx="50" cy="50" r="0.5" fill="white" opacity="0.3" />
          
          {/* Penalty areas */}
          <rect x="30" y="5" width="40" height="12" fill="none" stroke="white" strokeWidth="0.3" opacity="0.3" />
          <rect x="30" y="83" width="40" height="12" fill="none" stroke="white" strokeWidth="0.3" opacity="0.3" />
          
          {/* Goal areas */}
          <rect x="40" y="5" width="20" height="6" fill="none" stroke="white" strokeWidth="0.3" opacity="0.3" />
          <rect x="40" y="89" width="20" height="6" fill="none" stroke="white" strokeWidth="0.3" opacity="0.3" />
        </svg>

        {/* Players */}
        {players.map((player) => (
          <div
            key={player.id}
            onClick={() => setSelectedPlayer(player.id)}
            className={cn(
              "absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300",
              selectedPlayer === player.id && "scale-110 z-10"
            )}
            style={{
              left: `${player.position.x}%`,
              top: `${player.position.y}%`,
            }}
          >
            <div className={cn(
              "w-full h-full rounded-full flex items-center justify-center font-bold text-sm",
              player.id === "gk" 
                ? "bg-amber-500 text-black border-2 border-amber-600" 
                : "bg-primary text-primary-foreground border-2 border-primary/50",
              "hover:scale-110 transition-transform shadow-lg"
            )}>
              {player.number}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs text-white/80 whitespace-nowrap">
              {player.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}