import { AppLayout } from "@/components/Layout/AppLayout";
import { TeamOverview } from "@/components/Team/TeamOverview";
import { TeamComparison } from "@/components/Team/TeamComparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerList } from "@/components/Player/PlayerList";
import { useNavigate } from "react-router-dom";

const mockTeam = {
  name: "Manchester United",
  league: "Premier League",
  squadSize: 25,
  coach: "Erik ten Hag",
  nextMatch: {
    date: "April 20",
    opponent: "Liverpool FC",
    location: "Old Trafford",
  },
};

const mockPlayers = [
  { id: "1", name: "David de Gea", position: "Goalkeeper", number: 1, age: 32, nationality: "Spain", rating: 85 },
  { id: "2", name: "Harry Maguire", position: "Defender", number: 5, age: 30, nationality: "England", rating: 82 },
  { id: "3", name: "Bruno Fernandes", position: "Midfielder", number: 8, age: 28, nationality: "Portugal", rating: 88 },
  { id: "4", name: "Marcus Rashford", position: "Forward", number: 10, age: 25, nationality: "England", rating: 86 },
  { id: "5", name: "Casemiro", position: "Midfielder", number: 18, age: 31, nationality: "Brazil", rating: 87 },
];

export default function Teams() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md glass">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roster">Roster</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <TeamOverview team={mockTeam} />
          </TabsContent>

          <TabsContent value="roster" className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Team Roster</h2>
              <p className="text-muted-foreground mb-6">
                View and manage your complete team roster
              </p>
              <PlayerList players={mockPlayers} onPlayerClick={(player) => navigate(`/players/${player.id}`)} />
            </div>
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Player Management</h2>
                  <p className="text-muted-foreground mt-1">
                    Detailed player statistics and management options
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{mockPlayers.length}</div>
                  <p className="text-sm text-muted-foreground">Total Players</p>
                </div>
              </div>
              <PlayerList players={mockPlayers} onPlayerClick={(player) => navigate(`/players/${player.id}`)} />
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <TeamComparison />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}