import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age: number;
  nationality: string;
  rating?: number;
  status?: "fit" | "injured" | "suspended";
}

interface PlayerListProps {
  players: Player[];
  onPlayerClick?: (player: Player) => void;
}

export function PlayerList({ players, onPlayerClick }: PlayerListProps) {
  return (
    <div className="space-y-2">
      {players.map((player) => (
        <div
          key={player.id}
          onClick={() => onPlayerClick?.(player)}
          className="glass glass-hover p-4 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-200 hover:translate-x-1"
        >
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
              {player.number}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{player.name}</h3>
              {player.status && player.status !== "fit" && (
                <Badge 
                  variant={player.status === "injured" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {player.status}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {player.position} • {player.age} years • {player.nationality}
            </p>
          </div>

          {player.rating && (
            <div className={cn(
              "text-lg font-bold",
              player.rating >= 80 ? "text-green-500" : 
              player.rating >= 70 ? "text-primary" : 
              "text-amber-500"
            )}>
              {player.rating}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}