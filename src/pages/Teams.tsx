import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { TeamOverview } from "@/components/Team/TeamOverview";
import { TeamComparison } from "@/components/Team/TeamComparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerList } from "@/components/Player/PlayerList";
import { useNavigate } from "react-router-dom";
import { useTeams, useTeamPlayers } from "@/hooks/useTeams";
import { usePlayers } from "@/hooks/usePlayers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

function EmptyState({ title, description, action }: { title: string; description: string; action?: () => void }) {
  return (
    <div className="glass rounded-xl p-12 text-center">
      <Database className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {action && (
        <Button onClick={action} variant="outline">
          Import Data
        </Button>
      )}
    </div>
  );
}

export default function Teams() {
  const navigate = useNavigate();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: allPlayers, isLoading: playersLoading } = usePlayers();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  
  // Get players for selected team
  const { data: teamPlayers } = useTeamPlayers(selectedTeamId);

  // Set first team as default when teams load
  const selectedTeam = selectedTeamId 
    ? teams?.find(t => t.id === selectedTeamId)
    : teams?.[0];

  const hasData = teams && teams.length > 0;

  const formatPlayerForList = (player: any) => ({
    id: String(player.id),
    name: player.name,
    position: player.position || "Unknown",
    number: player.jersey_number || 0,
    age: player.age || 0,
    nationality: player.nationality || "Unknown",
    rating: player.overall_rating || undefined,
  });

  const displayPlayers = selectedTeamId && teamPlayers 
    ? teamPlayers.map(formatPlayerForList)
    : allPlayers?.map(formatPlayerForList) || [];

  if (teamsLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Team Selector */}
        {hasData && (
          <div className="flex items-center gap-4">
            <Select 
              value={selectedTeamId?.toString() || selectedTeam?.id.toString()} 
              onValueChange={(val) => setSelectedTeamId(Number(val))}
            >
              <SelectTrigger className="w-72 glass">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams?.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-sm">
              {teams?.length} teams in database
            </span>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md glass">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roster">Roster</TabsTrigger>
            <TabsTrigger value="players">Players</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {!hasData ? (
              <EmptyState 
                title="No Teams Found" 
                description="Import your FIFA/FC database to view team data."
                action={() => navigate("/database")}
              />
            ) : selectedTeam ? (
              <TeamOverview 
                team={{
                  name: selectedTeam.name,
                  league: selectedTeam.league_name || "Unknown League",
                  squadSize: selectedTeam.player_count || 0,
                  stadium: selectedTeam.stadium || undefined,
                  budget: selectedTeam.budget || undefined,
                  overallRating: selectedTeam.overall_rating || undefined,
                }} 
              />
            ) : null}
          </TabsContent>

          <TabsContent value="roster" className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">
                {selectedTeam ? `${selectedTeam.name} Roster` : "Team Roster"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {selectedTeam 
                  ? `${selectedTeam.player_count || 0} players in the squad`
                  : "Select a team to view the roster"}
              </p>
              {playersLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : displayPlayers.length > 0 ? (
                <PlayerList 
                  players={displayPlayers} 
                  onPlayerClick={(player) => navigate(`/players/${player.id}`)} 
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No players found for this team</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Player Management</h2>
                  <p className="text-muted-foreground mt-1">
                    {hasData ? "Detailed player statistics and management options" : "Import data to manage players"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {allPlayers?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Players</p>
                </div>
              </div>
              {playersLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : displayPlayers.length > 0 ? (
                <PlayerList 
                  players={displayPlayers} 
                  onPlayerClick={(player) => navigate(`/players/${player.id}`)} 
                />
              ) : (
                <EmptyState 
                  title="No Players Found" 
                  description="Import your FIFA/FC database to view player data."
                  action={() => navigate("/database")}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            {hasData ? (
              <TeamComparison teams={teams} />
            ) : (
              <EmptyState 
                title="No Teams to Compare" 
                description="Import your FIFA/FC database to compare teams."
                action={() => navigate("/database")}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
