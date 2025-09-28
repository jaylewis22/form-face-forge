import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";

interface TeamOverviewProps {
  team: {
    name: string;
    league: string;
    squadSize: number;
    coach?: string;
    nextMatch?: {
      date: string;
      opponent: string;
      location: string;
    };
  };
}

export function TeamOverview({ team }: TeamOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="glass rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>{team.league}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{team.squadSize} Players</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info Card */}
        <Card className="glass p-6 space-y-4">
          <h3 className="text-lg font-semibold">Info</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">League</p>
              <p className="font-medium">{team.league}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Squad Size</p>
              <p className="font-medium">{team.squadSize}</p>
            </div>
            {team.coach && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Coach</p>
                <p className="font-medium">{team.coach}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Next Match Card */}
        <Card className="glass p-6 space-y-4">
          <h3 className="text-lg font-semibold">Next Match</h3>
          {team.nextMatch ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary text-2xl font-bold">
                <Calendar className="w-5 h-5" />
                {team.nextMatch.date}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Opponent</p>
                <p className="font-medium text-lg">{team.nextMatch.opponent}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {team.nextMatch.location}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming matches</p>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">Edit Team</Button>
          <Button variant="outline">Save</Button>
          <Button variant="outline">Export</Button>
          <Button variant="outline">Import</Button>
        </div>
      </div>
    </div>
  );
}