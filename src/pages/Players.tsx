import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PlayerCard } from "@/components/Player/PlayerCard";
import { PlayerList } from "@/components/Player/PlayerList";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { usePlayers, Player } from "@/hooks/usePlayers";
import { Skeleton } from "@/components/ui/skeleton";

// Helper to format database player to component format
function formatPlayerForList(player: Player) {
  return {
    id: String(player.id),
    name: player.name,
    position: player.position || "Unknown",
    number: player.jersey_number || 0,
    age: player.age || 0,
    nationality: player.nationality || "Unknown",
    rating: player.overall_rating || undefined,
  };
}

function formatPlayerForCard(player: Player) {
  return {
    id: String(player.id),
    name: player.name,
    position: player.position || "Unknown",
    number: player.jersey_number || 0,
    age: player.age || 0,
    nationality: player.nationality || "Unknown",
    weight: player.weight ? `${player.weight}kg` : "N/A",
    height: player.height ? `${player.height}cm` : undefined,
    attributes: [
      { name: "Pace", value: player.pace || 0, max: 100 },
      { name: "Shooting", value: player.shooting || 0, max: 100 },
      { name: "Passing", value: player.passing || 0, max: 100 },
      { name: "Dribbling", value: player.dribbling || 0, max: 100 },
      { name: "Defending", value: player.defending || 0, max: 100 },
      { name: "Physical", value: player.physical || 0, max: 100 },
    ],
    contractStatus: "Active",
  };
}

export default function Players() {
  const navigate = useNavigate();
  const { data: players, isLoading, error } = usePlayers();
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = players?.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (player.position?.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const selectedPlayer = players?.find(p => p.id === selectedPlayerId) || players?.[0];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-2">Players</h1>
            <p className="text-muted-foreground">Manage your squad and player details</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-xl" />
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
            <p className="text-muted-foreground">Manage your squad and player details</p>
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
            <p className="text-muted-foreground">Manage your squad and player details</p>
          </div>
          <div className="glass rounded-xl p-8 text-center">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Players Found</h2>
            <p className="text-muted-foreground">
              Import a database to see player data here.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Players</h1>
          <p className="text-muted-foreground">Manage your squad and player details</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player List */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Squad ({filteredPlayers.length})</h2>
              <PlayerList
                players={filteredPlayers.map(formatPlayerForList)}
                onPlayerClick={(player) => {
                  setSelectedPlayerId(Number(player.id));
                }}
              />
            </div>
          </div>

          {/* Player Details */}
          <div className="lg:col-span-2">
            {selectedPlayer && <PlayerCard player={formatPlayerForCard(selectedPlayer)} />}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
