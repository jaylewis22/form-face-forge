import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Shield, TrendingUp } from "lucide-react";

interface TeamStats {
  id: string;
  name: string;
  league: string;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  points: number;
  form: string[];
}

const mockTeams: TeamStats[] = [
  {
    id: "1",
    name: "Manchester United",
    league: "Premier League",
    wins: 18,
    draws: 8,
    losses: 6,
    goalsScored: 54,
    goalsConceded: 38,
    points: 62,
    form: ["W", "W", "D", "W", "L"],
  },
  {
    id: "2",
    name: "Liverpool FC",
    league: "Premier League",
    wins: 22,
    draws: 6,
    losses: 4,
    goalsScored: 68,
    goalsConceded: 28,
    points: 72,
    form: ["W", "W", "W", "D", "W"],
  },
  {
    id: "3",
    name: "Chelsea FC",
    league: "Premier League",
    wins: 16,
    draws: 10,
    losses: 6,
    goalsScored: 48,
    goalsConceded: 34,
    points: 58,
    form: ["D", "W", "L", "W", "D"],
  },
  {
    id: "4",
    name: "Arsenal FC",
    league: "Premier League",
    wins: 20,
    draws: 7,
    losses: 5,
    goalsScored: 62,
    goalsConceded: 32,
    points: 67,
    form: ["W", "W", "W", "W", "D"],
  },
];

const FormBadge = ({ result }: { result: string }) => {
  const variant = result === "W" ? "default" : result === "D" ? "secondary" : "destructive";
  return (
    <Badge variant={variant} className="w-8 h-8 flex items-center justify-center">
      {result}
    </Badge>
  );
};

export function TeamComparison() {
  const [team1Id, setTeam1Id] = useState<string>(mockTeams[0].id);
  const [team2Id, setTeam2Id] = useState<string>(mockTeams[1].id);

  const team1 = mockTeams.find((t) => t.id === team1Id) || mockTeams[0];
  const team2 = mockTeams.find((t) => t.id === team2Id) || mockTeams[1];

  const maxPoints = Math.max(team1.points, team2.points);
  const maxGoalsScored = Math.max(team1.goalsScored, team2.goalsScored);
  const maxWins = Math.max(team1.wins, team2.wins);

  const ComparisonStat = ({
    label,
    team1Value,
    team2Value,
    icon: Icon,
    maxValue,
  }: {
    label: string;
    team1Value: number;
    team2Value: number;
    icon: any;
    maxValue: number;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
        <div className="text-right">
          <div className="text-2xl font-bold mb-2">{team1Value}</div>
          <Progress value={(team1Value / maxValue) * 100} className="h-2" />
        </div>
        <div className="text-xs text-muted-foreground">VS</div>
        <div className="text-left">
          <div className="text-2xl font-bold mb-2">{team2Value}</div>
          <Progress value={(team2Value / maxValue) * 100} className="h-2" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="glass">
        <CardHeader>
          <CardTitle>Select Teams to Compare</CardTitle>
          <CardDescription>Choose two teams from the league to compare their statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Team 1</label>
              <Select value={team1Id} onValueChange={setTeam1Id}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id} disabled={team.id === team2Id}>
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id} disabled={team.id === team1Id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Team Names & League</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold">{team1.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{team1.league}</p>
            </div>
            <div className="text-2xl font-bold text-muted-foreground">VS</div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">{team2.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{team2.league}</p>
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
            label="Points"
            team1Value={team1.points}
            team2Value={team2.points}
            icon={Trophy}
            maxValue={maxPoints}
          />
          <ComparisonStat
            label="Wins"
            team1Value={team1.wins}
            team2Value={team2.wins}
            icon={TrendingUp}
            maxValue={maxWins}
          />
          <ComparisonStat
            label="Goals Scored"
            team1Value={team1.goalsScored}
            team2Value={team2.goalsScored}
            icon={Target}
            maxValue={maxGoalsScored}
          />
          <ComparisonStat
            label="Goals Conceded"
            team1Value={team1.goalsConceded}
            team2Value={team2.goalsConceded}
            icon={Shield}
            maxValue={Math.max(team1.goalsConceded, team2.goalsConceded)}
          />
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Recent Form</CardTitle>
          <CardDescription>Last 5 matches (W = Win, D = Draw, L = Loss)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div className="flex justify-end gap-2">
              {team1.form.map((result, index) => (
                <FormBadge key={index} result={result} />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">Form</div>
            <div className="flex justify-start gap-2">
              {team2.form.map((result, index) => (
                <FormBadge key={index} result={result} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Head-to-Head Record</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold">{team1.wins}</div>
              <div className="text-sm text-muted-foreground mt-1">{team1.name} Wins</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{team1.draws}</div>
              <div className="text-sm text-muted-foreground mt-1">Draws</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{team2.wins}</div>
              <div className="text-sm text-muted-foreground mt-1">{team2.name} Wins</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
