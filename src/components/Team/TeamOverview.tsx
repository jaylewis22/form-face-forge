import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, MapPin, DollarSign, Star } from "lucide-react";

interface TeamOverviewProps {
  team: {
    name: string;
    league: string;
    squadSize: number;
    stadium?: string;
    budget?: number;
    overallRating?: number;
  };
}

export function TeamOverview({ team }: TeamOverviewProps) {
  const formatBudget = (budget: number) => {
    if (budget >= 1000000000) {
      return `€${(budget / 1000000000).toFixed(1)}B`;
    }
    if (budget >= 1000000) {
      return `€${(budget / 1000000).toFixed(1)}M`;
    }
    if (budget >= 1000) {
      return `€${(budget / 1000).toFixed(1)}K`;
    }
    return `€${budget}`;
  };

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="glass rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
        <div className="flex items-center gap-6 text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>{team.league}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{team.squadSize} Players</span>
          </div>
          {team.overallRating && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <span className="font-medium">{team.overallRating} OVR</span>
            </div>
          )}
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
            {team.overallRating && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Rating</p>
                <p className="font-medium">{team.overallRating}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Stadium & Budget Card */}
        <Card className="glass p-6 space-y-4">
          <h3 className="text-lg font-semibold">Details</h3>
          <div className="space-y-3">
            {team.stadium && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Stadium</p>
                  <p className="font-medium">{team.stadium}</p>
                </div>
              </div>
            )}
            {team.budget !== undefined && team.budget > 0 && (
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transfer Budget</p>
                  <p className="font-medium text-lg">{formatBudget(team.budget)}</p>
                </div>
              </div>
            )}
            {!team.stadium && (!team.budget || team.budget === 0) && (
              <p className="text-muted-foreground">No additional details available</p>
            )}
          </div>
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
