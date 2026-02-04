import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/Layout/AppLayout";
import { EnhancedPlayerCard } from "@/components/Player/EnhancedPlayerCard";
import { RatingBadge } from "@/components/Player/RatingBadge";
import { PositionBadge } from "@/components/Player/PositionBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Users, 
  Filter, 
  SortAsc, 
  SortDesc,
  LayoutGrid,
  List,
  TrendingUp,
} from "lucide-react";
import { usePlayers, Player } from "@/hooks/usePlayers";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Position filter options
const POSITION_FILTERS = [
  { value: "all", label: "All Positions" },
  { value: "GK", label: "Goalkeepers" },
  { value: "DEF", label: "Defenders" },
  { value: "MID", label: "Midfielders" },
  { value: "FWD", label: "Forwards" },
];

// Rating filter options
const RATING_FILTERS = [
  { value: "all", label: "All Ratings" },
  { value: "90+", label: "90+ (World Class)" },
  { value: "85-89", label: "85-89 (Elite)" },
  { value: "80-84", label: "80-84 (Great)" },
  { value: "75-79", label: "75-79 (Good)" },
  { value: "70-74", label: "70-74 (Decent)" },
  { value: "below70", label: "Below 70" },
];

// Sort options
const SORT_OPTIONS = [
  { value: "rating-desc", label: "Rating (High to Low)" },
  { value: "rating-asc", label: "Rating (Low to High)" },
  { value: "potential-desc", label: "Potential (High to Low)" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "age-asc", label: "Age (Young to Old)" },
  { value: "age-desc", label: "Age (Old to Young)" },
];

// Helper to check if position matches filter
function matchesPositionFilter(position: string | null, filter: string): boolean {
  if (filter === "all") return true;
  if (!position) return false;
  
  const pos = position.toUpperCase();
  
  switch (filter) {
    case "GK":
      return pos === "GK";
    case "DEF":
      return ["CB", "LB", "RB", "LWB", "RWB"].includes(pos);
    case "MID":
      return ["CDM", "CM", "CAM", "LM", "RM"].includes(pos);
    case "FWD":
      return ["LW", "RW", "CF", "ST"].includes(pos);
    default:
      return true;
  }
}

// Helper to check rating filter
function matchesRatingFilter(rating: number | null, filter: string): boolean {
  if (filter === "all") return true;
  if (rating === null) return false;
  
  switch (filter) {
    case "90+":
      return rating >= 90;
    case "85-89":
      return rating >= 85 && rating <= 89;
    case "80-84":
      return rating >= 80 && rating <= 84;
    case "75-79":
      return rating >= 75 && rating <= 79;
    case "70-74":
      return rating >= 70 && rating <= 74;
    case "below70":
      return rating < 70;
    default:
      return true;
  }
}

// Format player for enhanced card
function formatPlayerForCard(player: Player) {
  return {
    id: String(player.id),
    name: player.name,
    short_name: player.short_name || undefined,
    position: player.position || "N/A",
    secondary_position: player.secondary_position || undefined,
    number: player.jersey_number || 0,
    age: player.age || 0,
    nationality: player.nationality || "Unknown",
    nationality_code: player.nationality_code || undefined,
    weight: player.weight ? `${player.weight}kg` : undefined,
    height: player.height ? `${player.height}cm` : undefined,
    overall_rating: player.overall_rating || undefined,
    potential_rating: player.potential_rating || undefined,
    preferred_foot: player.preferred_foot || undefined,
    weak_foot: player.weak_foot || undefined,
    skill_moves: player.skill_moves || undefined,
    team_name: player.team_name || undefined,
    pace: player.pace || 0,
    shooting: player.shooting || 0,
    passing: player.passing || 0,
    dribbling: player.dribbling || 0,
    defending: player.defending || 0,
    physical: player.physical || 0,
    // GK attributes
    gk_diving: player.gk_diving || undefined,
    gk_handling: player.gk_handling || undefined,
    gk_kicking: player.gk_kicking || undefined,
    gk_positioning: player.gk_positioning || undefined,
    gk_reflexes: player.gk_reflexes || undefined,
  };
}

export default function Players() {
  const navigate = useNavigate();
  const { data: players, isLoading, error } = usePlayers();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter and sort players
  const filteredPlayers = useMemo(() => {
    if (!players) return [];
    
    let result = players.filter((player) => {
      // Search filter
      const matchesSearch = 
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (player.short_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (player.position?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (player.nationality?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (player.team_name?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Position filter
      const matchesPosition = matchesPositionFilter(player.position, positionFilter);
      
      // Rating filter
      const matchesRating = matchesRatingFilter(player.overall_rating, ratingFilter);
      
      return matchesSearch && matchesPosition && matchesRating;
    });
    
    // Sort
    const [sortField, sortDir] = sortBy.split("-");
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "rating":
          comparison = (a.overall_rating || 0) - (b.overall_rating || 0);
          break;
        case "potential":
          comparison = (a.potential_rating || 0) - (b.potential_rating || 0);
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "age":
          comparison = (a.age || 0) - (b.age || 0);
          break;
      }
      
      return sortDir === "desc" ? -comparison : comparison;
    });
    
    return result;
  }, [players, searchQuery, positionFilter, ratingFilter, sortBy]);

  const selectedPlayer = players?.find(p => p.id === selectedPlayerId) || filteredPlayers[0];
  
  // Stats summary
  const stats = useMemo(() => {
    if (!players) return null;
    const totalPlayers = players.length;
    const avgRating = Math.round(
      players.reduce((sum, p) => sum + (p.overall_rating || 0), 0) / totalPlayers
    );
    const wonderkids = players.filter(p => 
      (p.potential_rating || 0) >= 85 && (p.age || 99) <= 21
    ).length;
    
    return { totalPlayers, avgRating, wonderkids };
  }, [players]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">Players</h1>
            <p className="text-muted-foreground">Browse and manage your squad</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">Players</h1>
            <p className="text-muted-foreground">Browse and manage your squad</p>
          </div>
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-destructive">Error loading players: {error.message}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!players || players.length === 0) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">Players</h1>
            <p className="text-muted-foreground">Browse and manage your squad</p>
          </div>
          <div className="glass rounded-xl p-8 text-center">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Players Found</h2>
            <p className="text-muted-foreground mb-4">
              Import a database to see player data here.
            </p>
            <Button onClick={() => navigate("/database")}>
              Go to Database
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Players</h1>
            <p className="text-muted-foreground">Browse and manage your squad</p>
          </div>
          
          {/* Quick stats */}
          {stats && (
            <div className="flex items-center gap-4">
              <div className="glass rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalPlayers}</div>
                <div className="text-xs text-muted-foreground">Players</div>
              </div>
              <div className="glass rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold text-emerald-400">{stats.avgRating}</div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
              <div className="glass rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold text-amber-400">{stats.wonderkids}</div>
                <div className="text-xs text-muted-foreground">Wonderkids</div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search players, teams, nations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Position Filter */}
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              {POSITION_FILTERS.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Rating Filter */}
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              {RATING_FILTERS.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Active filters */}
        {(positionFilter !== "all" || ratingFilter !== "all" || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {positionFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {POSITION_FILTERS.find(f => f.value === positionFilter)?.label}
                <button onClick={() => setPositionFilter("all")} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {ratingFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {RATING_FILTERS.find(f => f.value === ratingFilter)?.label}
                <button onClick={() => setRatingFilter("all")} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchQuery("");
                setPositionFilter("all");
                setRatingFilter("all");
              }}
            >
              Clear all
            </Button>
          </div>
        )}
        
        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredPlayers.length} of {players.length} players
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player List */}
          <div className="lg:col-span-1">
            <ScrollArea className="h-[calc(100vh-400px)] pr-4">
              <div className={cn(
                "space-y-2",
                viewMode === "grid" && "grid grid-cols-2 gap-2 space-y-0"
              )}>
                {filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => setSelectedPlayerId(player.id)}
                    className={cn(
                      "glass rounded-lg p-3 cursor-pointer transition-all duration-200",
                      "hover:bg-card/50 hover:border-primary/30",
                      selectedPlayerId === player.id && "border-primary bg-card/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RatingBadge rating={player.overall_rating || 0} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm truncate">
                            {player.short_name || player.name}
                          </h3>
                          <PositionBadge position={player.position || "N/A"} size="sm" />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {player.team_name || player.nationality || "Unknown"}
                        </p>
                      </div>
                      {player.potential_rating && player.potential_rating > (player.overall_rating || 0) && (
                        <div className="flex items-center gap-0.5 text-emerald-400">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs font-semibold">{player.potential_rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Player Details */}
          <div className="lg:col-span-2">
            {selectedPlayer ? (
              <EnhancedPlayerCard player={formatPlayerForCard(selectedPlayer)} />
            ) : (
              <div className="glass rounded-xl p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a player to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
