import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RatingBadge, PotentialBadge, AttributeBar } from "./RatingBadge";
import { PositionBadge, PositionGroup } from "./PositionBadge";
import { AttributeHexagon } from "./RadarChart";
import { ExternalLink, TrendingUp, User } from "lucide-react";

interface PlayerAttribute {
  name: string;
  value: number;
  max?: number;
}

interface EnhancedPlayerCardProps {
  player: {
    id: string;
    name: string;
    short_name?: string;
    position: string;
    secondary_position?: string;
    number: number;
    age: number;
    nationality: string;
    nationality_code?: string;
    weight?: string;
    height?: string;
    overall_rating?: number;
    potential_rating?: number;
    preferred_foot?: string;
    weak_foot?: number;
    skill_moves?: number;
    team_name?: string;
    pace?: number;
    shooting?: number;
    passing?: number;
    dribbling?: number;
    defending?: number;
    physical?: number;
    // Sub-attributes
    acceleration?: number;
    sprint_speed?: number;
    positioning?: number;
    finishing?: number;
    shot_power?: number;
    long_shots?: number;
    volleys?: number;
    penalties?: number;
    vision?: number;
    crossing?: number;
    free_kick_accuracy?: number;
    short_passing?: number;
    long_passing?: number;
    curve?: number;
    agility?: number;
    balance?: number;
    reactions?: number;
    ball_control?: number;
    composure?: number;
    interceptions?: number;
    heading_accuracy?: number;
    def_awareness?: number;
    standing_tackle?: number;
    sliding_tackle?: number;
    jumping?: number;
    stamina?: number;
    strength?: number;
    aggression?: number;
    // GK
    gk_diving?: number;
    gk_handling?: number;
    gk_kicking?: number;
    gk_positioning?: number;
    gk_reflexes?: number;
  };
  compact?: boolean;
}

export function EnhancedPlayerCard({ player, compact = false }: EnhancedPlayerCardProps) {
  const navigate = useNavigate();
  const isGK = player.position?.toUpperCase() === "GK";
  
  const mainAttributes = isGK
    ? [
        { label: "DIV", value: player.gk_diving || 0 },
        { label: "HAN", value: player.gk_handling || 0 },
        { label: "KIC", value: player.gk_kicking || 0 },
        { label: "REF", value: player.gk_reflexes || 0 },
        { label: "SPD", value: player.pace || 0 },
        { label: "POS", value: player.gk_positioning || 0 },
      ]
    : [
        { label: "PAC", value: player.pace || 0 },
        { label: "SHO", value: player.shooting || 0 },
        { label: "PAS", value: player.passing || 0 },
        { label: "DRI", value: player.dribbling || 0 },
        { label: "DEF", value: player.defending || 0 },
        { label: "PHY", value: player.physical || 0 },
      ];
  
  if (compact) {
    return (
      <div 
        className="glass glass-hover rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
        onClick={() => navigate(`/players/${player.id}`)}
      >
        <div className="flex items-center gap-4">
          {/* Rating */}
          <RatingBadge rating={player.overall_rating || 0} size="lg" />
          
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg truncate">
                {player.short_name || player.name}
              </h3>
              <PositionBadge position={player.position} size="sm" />
              {player.secondary_position && (
                <PositionBadge position={player.secondary_position} size="sm" />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span>{player.nationality}</span>
              <span>•</span>
              <span>{player.age} yrs</span>
              {player.team_name && (
                <>
                  <span>•</span>
                  <span className="truncate">{player.team_name}</span>
                </>
              )}
            </div>
          </div>
          
          {/* Potential */}
          {player.potential_rating && player.potential_rating > (player.overall_rating || 0) && (
            <div className="flex items-center gap-1 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">{player.potential_rating}</span>
            </div>
          )}
        </div>
        
        {/* Mini attributes */}
        <div className="grid grid-cols-6 gap-2 mt-4">
          {mainAttributes.map((attr) => (
            <div key={attr.label} className="text-center">
              <div className={cn(
                "text-sm font-bold",
                attr.value >= 80 ? "text-emerald-400" :
                attr.value >= 70 ? "text-primary" :
                attr.value >= 60 ? "text-amber-400" : "text-muted-foreground"
              )}>
                {attr.value}
              </div>
              <div className="text-[10px] text-muted-foreground">{attr.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass rounded-xl p-6 space-y-6 animate-fade-in">
      {/* Header with rating and info */}
      <div className="flex items-start gap-6">
        {/* Avatar & Rating */}
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-24 h-24 border-2 border-primary/30">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-2xl font-bold">
              {player.number || <User className="w-10 h-10 text-muted-foreground" />}
            </AvatarFallback>
          </Avatar>
          
          <PotentialBadge 
            current={player.overall_rating || 0} 
            potential={player.potential_rating || player.overall_rating || 0}
            size="md"
          />
        </div>
        
        {/* Player Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-2xl font-bold">{player.name}</h2>
            {player.short_name && player.short_name !== player.name && (
              <p className="text-muted-foreground">{player.short_name}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <PositionBadge position={player.position} size="lg" />
            {player.secondary_position && (
              <PositionBadge position={player.secondary_position} size="md" />
            )}
            <PositionGroup position={player.position} />
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium">{player.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nationality:</span>
              <span className="font-medium">{player.nationality}</span>
            </div>
            {player.height && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Height:</span>
                <span className="font-medium">{player.height}</span>
              </div>
            )}
            {player.weight && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight:</span>
                <span className="font-medium">{player.weight}</span>
              </div>
            )}
            {player.preferred_foot && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Foot:</span>
                <span className="font-medium">{player.preferred_foot}</span>
              </div>
            )}
            {player.weak_foot && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weak Foot:</span>
                <span className="font-medium">{"★".repeat(player.weak_foot)}</span>
              </div>
            )}
            {player.skill_moves && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Skill Moves:</span>
                <span className="font-medium">{"★".repeat(player.skill_moves)}</span>
              </div>
            )}
            {player.team_name && (
              <div className="flex justify-between col-span-2">
                <span className="text-muted-foreground">Team:</span>
                <span className="font-medium">{player.team_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Radar Chart + Main Attributes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="flex justify-center items-center">
          <AttributeHexagon
            pace={player.pace || 0}
            shooting={player.shooting || 0}
            passing={player.passing || 0}
            dribbling={player.dribbling || 0}
            defending={player.defending || 0}
            physical={player.physical || 0}
            size={220}
          />
        </div>
        
        {/* Main Attributes with bars */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Main Attributes
          </h3>
          {mainAttributes.map((attr) => (
            <AttributeBar 
              key={attr.label} 
              value={attr.value} 
              label={attr.label === "PAC" ? "Pace" :
                     attr.label === "SHO" ? "Shooting" :
                     attr.label === "PAS" ? "Passing" :
                     attr.label === "DRI" ? "Dribbling" :
                     attr.label === "DEF" ? "Defending" :
                     attr.label === "PHY" ? "Physical" :
                     attr.label === "DIV" ? "Diving" :
                     attr.label === "HAN" ? "Handling" :
                     attr.label === "KIC" ? "Kicking" :
                     attr.label === "REF" ? "Reflexes" :
                     attr.label === "SPD" ? "Speed" :
                     attr.label === "POS" ? "Positioning" : attr.label}
            />
          ))}
        </div>
      </div>
      
      {/* View Full Profile Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => navigate(`/players/${player.id}`)}
        >
          <ExternalLink className="w-4 h-4" />
          View Full Profile
        </Button>
      </div>
    </div>
  );
}
