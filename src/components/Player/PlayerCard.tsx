import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PlayerAttribute {
  name: string;
  value: number;
  max?: number;
}

interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    position: string;
    number: number;
    age: number;
    nationality: string;
    weight: string;
    height?: string;
    attributes: PlayerAttribute[];
    contractStatus?: string;
    injuryStatus?: string;
  };
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="glass rounded-xl p-6 space-y-6 animate-fade-in">
      {/* Player Header */}
      <div className="flex items-start gap-6">
        <div className="relative">
          <Avatar className="w-32 h-32 border-2 border-primary/30">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-2xl font-bold">
              {player.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            Change
          </Button>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold">{player.name}</h2>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <span className="text-lg">{player.position}</span>
            <span className="text-3xl font-bold text-primary">#{player.number}</span>
          </div>
        </div>
      </div>

      {/* Attributes */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Attributes</h3>
        <div className="space-y-3">
          {player.attributes.map((attr) => (
            <div key={attr.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">{attr.name}</span>
                <span className="text-sm font-medium">{attr.value}</span>
              </div>
              <Progress 
                value={attr.value} 
                max={attr.max || 100}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Position */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Position</h3>
        <p className="text-lg">{player.position}</p>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Info</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Age:</span>
            <span className="ml-2 font-medium">{player.age}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Nationality:</span>
            <span className="ml-2 font-medium">{player.nationality}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Weight:</span>
            <span className="ml-2 font-medium">{player.weight}</span>
          </div>
          {player.height && (
            <div>
              <span className="text-muted-foreground">Height:</span>
              <span className="ml-2 font-medium">{player.height}</span>
            </div>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Options</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Contract:</span>
            <span className={cn(
              "text-sm font-medium",
              player.contractStatus === "Active" ? "text-green-500" : "text-amber-500"
            )}>
              {player.contractStatus || "Active"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Injury:</span>
            <Button 
              variant="ghost" 
              size="sm"
              className={cn(
                "h-6 px-2",
                player.injuryStatus ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {player.injuryStatus ? "Injured" : "Fit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}