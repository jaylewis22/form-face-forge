import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Shield, Users, Star } from "lucide-react";
import { Team } from "@/hooks/useTeams";

interface TeamComparisonProps {
  teams: Team[];
}

export function TeamComparison({ teams }: TeamComparisonProps) {
  const [team1Id, setTeam1Id] = useState<string>(teams[0]?.id.toString() || "");
  const [team2Id, setTeam2Id] = useState<string>(teams[1]?.id.toString() || teams[0]?.id.toString() || "");

  const team1 = useMemo(() => teams.find((t) => t.id.toString() === team1Id), [teams, team1Id]);
  const team2 = useMemo(() => teams.find((t) => t.id.toString() === team2Id), [teams, team2Id]);

  if (teams.length < 2) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle>Team Comparison</CardTitle>
          <CardDescription>
            Need at least 2 teams in the database to compare. Currently have {teams.length} team(s).
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const ComparisonStat = ({
    label,
    team1Value,
    team2Value,
    icon: Icon,
  }: {
    label: string;
    team1Value: number | null;
    team2Value: number | null;
    icon: any;
  }) => {
    const val1 = team1Value || 0;
    const val2 = team2Value || 0;
    const maxValue = Math.max(val1, val2, 1);

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
          <div className="text-right">
            <div className="text-2xl font-bold mb-2">{val1 || "N/A"}</div>
            <Progress value={(val1 / maxValue) * 100} className="h-2" />
          </div>
          <div className="text-xs text-muted-foreground">VS</div>
          <div className="text-left">
            <div className="text-2xl font-bold mb-2">{val2 || "N/A"}</div>
            <Progress value={(val2 / maxValue) * 100} className="h-2" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Select Teams to Compare</CardTitle>
          <CardDescription>Choose two teams from your database to compare their statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Team 1</label>
              <Select value={team1Id} onValueChange={setTeam1Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()} disabled={team.id.toString() === team2Id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Team 2</label>
              <Select value={team2Id} onValueChange={setTeam2Id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()} disabled={team.id.toString() === team1Id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {team1 && team2 && (
        <>
          <Card className="glass">
            <CardHeader>
              <CardTitle>Team Names & League</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{team1.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{team1.league_name || "Unknown League"}</p>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">VS</div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{team2.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{team2.league_name || "Unknown League"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Statistics Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ComparisonStat
                label="Overall Rating"
                team1Value={team1.overall_rating}
                team2Value={team2.overall_rating}
                icon={Star}
              />
              <ComparisonStat
                label="Squad Size"
                team1Value={team1.player_count || 0}
                team2Value={team2.player_count || 0}
                icon={Users}
              />
              <ComparisonStat
                label="Transfer Budget (M)"
                team1Value={team1.budget ? Math.round(team1.budget / 1000000) : 0}
                team2Value={team2.budget ? Math.round(team2.budget / 1000000) : 0}
                icon={Trophy}
              />
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Team Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[1fr,auto,1fr] gap-4">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Stadium</p>
                    <p className="font-medium">{team1.stadium || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{team1.country_code || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-px h-full bg-border" />
                </div>
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Stadium</p>
                    <p className="font-medium">{team2.stadium || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{team2.country_code || "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
