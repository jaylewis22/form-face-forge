import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PlayerCard } from "@/components/Player/PlayerCard";
import { PlayerList } from "@/components/Player/PlayerList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const mockPlayers = [
  {
    id: "1",
    name: "Marcus Sterling",
    position: "Forward",
    number: 10,
    age: 24,
    nationality: "England",
    weight: "75kg",
    height: "180cm",
    rating: 88,
    status: "fit" as const,
    attributes: [
      { name: "Pace", value: 85, max: 100 },
      { name: "Shooting", value: 78, max: 100 },
      { name: "Passing", value: 82, max: 100 },
    ],
    contractStatus: "Active",
  },
  {
    id: "2",
    name: "João Silva",
    position: "Midfielder",
    number: 8,
    age: 26,
    nationality: "Brazil",
    weight: "72kg",
    height: "175cm",
    rating: 85,
    status: "fit" as const,
    attributes: [
      { name: "Pace", value: 78, max: 100 },
      { name: "Shooting", value: 72, max: 100 },
      { name: "Passing", value: 88, max: 100 },
    ],
    contractStatus: "Active",
  },
  {
    id: "3",
    name: "Lucas Martinez",
    position: "Defender",
    number: 4,
    age: 28,
    nationality: "Spain",
    weight: "82kg",
    height: "185cm",
    rating: 84,
    status: "injured" as const,
    attributes: [
      { name: "Pace", value: 72, max: 100 },
      { name: "Shooting", value: 45, max: 100 },
      { name: "Passing", value: 76, max: 100 },
    ],
    contractStatus: "Active",
    injuryStatus: "Injured",
  },
];

export default function Players() {
  const [selectedPlayer, setSelectedPlayer] = useState(mockPlayers[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPlayers = mockPlayers.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <h2 className="text-lg font-semibold mb-4">Squad</h2>
              <PlayerList
                players={filteredPlayers}
                onPlayerClick={(player) => {
                  const fullPlayer = mockPlayers.find(p => p.id === player.id);
                  if (fullPlayer) setSelectedPlayer(fullPlayer);
                }}
              />
            </div>
          </div>

          {/* Player Details */}
          <div className="lg:col-span-2">
            {selectedPlayer && <PlayerCard player={selectedPlayer} />}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}