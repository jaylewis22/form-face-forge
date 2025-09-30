import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Globe, Trophy, Plus, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for ID tracking
const mockIdData = {
  teams: { used: [1, 2, 3, 5, 8, 12, 15], total: 99999, lastUsed: 15 },
  leagues: { used: [1, 2, 3, 4, 7, 10], total: 999, lastUsed: 10 },
  countries: { used: Array.from({ length: 195 }, (_, i) => i + 1), total: 999, lastUsed: 195 }
};

function IdCounter({ type, used, total, lastUsed }: { type: string; used: number[]; total: number; lastUsed: number }) {
  const unusedCount = total - used.length;
  const usagePercentage = (used.length / total) * 100;
  
  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">ID Management</span>
        </div>
        <Badge variant="outline">Last Used: {lastUsed}</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Used IDs</div>
          <div className="text-2xl font-bold text-primary">{used.length.toLocaleString()}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Available IDs</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{unusedCount.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>Usage</span>
          <span>{usagePercentage.toFixed(2)}%</span>
        </div>
        <Progress value={usagePercentage} className="h-2" />
      </div>
      
      <div className="text-xs text-muted-foreground">
        Total Range: 1 - {total.toLocaleString()}
      </div>
    </div>
  );
}

export default function CreationHub() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("team");

  const handleCreate = (type: string) => {
    toast({
      title: `${type} Created`,
      description: `Successfully created new ${type.toLowerCase()} with ID assignment.`,
    });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creation Hub</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage teams, leagues, and countries with automated ID assignment
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Create Team
            </TabsTrigger>
            <TabsTrigger value="league" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Create League
            </TabsTrigger>
            <TabsTrigger value="country" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Create Country
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Create New Team
                </CardTitle>
                <CardDescription>
                  Add a new team to the database with automatic ID assignment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <IdCounter type="Teams" {...mockIdData.teams} />
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="team-name">Team Name</Label>
                      <Input id="team-name" placeholder="Enter team name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team-short">Short Name</Label>
                      <Input id="team-short" placeholder="e.g., MUN" maxLength={3} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="team-country">Country</Label>
                      <Select>
                        <SelectTrigger id="team-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="england">England</SelectItem>
                          <SelectItem value="spain">Spain</SelectItem>
                          <SelectItem value="germany">Germany</SelectItem>
                          <SelectItem value="italy">Italy</SelectItem>
                          <SelectItem value="france">France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team-league">League</Label>
                      <Select>
                        <SelectTrigger id="team-league">
                          <SelectValue placeholder="Select league" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="premier">Premier League</SelectItem>
                          <SelectItem value="laliga">La Liga</SelectItem>
                          <SelectItem value="bundesliga">Bundesliga</SelectItem>
                          <SelectItem value="seriea">Serie A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team-stadium">Stadium Name</Label>
                    <Input id="team-stadium" placeholder="Enter stadium name" />
                  </div>

                  <Button onClick={() => handleCreate("Team")} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="league" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Create New League
                </CardTitle>
                <CardDescription>
                  Add a new league or competition with automatic ID assignment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <IdCounter type="Leagues" {...mockIdData.leagues} />
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="league-name">League Name</Label>
                      <Input id="league-name" placeholder="Enter league name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="league-type">League Type</Label>
                      <Select>
                        <SelectTrigger id="league-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="domestic">Domestic League</SelectItem>
                          <SelectItem value="cup">Domestic Cup</SelectItem>
                          <SelectItem value="international">International</SelectItem>
                          <SelectItem value="continental">Continental</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="league-country">Country</Label>
                      <Select>
                        <SelectTrigger id="league-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="england">England</SelectItem>
                          <SelectItem value="spain">Spain</SelectItem>
                          <SelectItem value="germany">Germany</SelectItem>
                          <SelectItem value="italy">Italy</SelectItem>
                          <SelectItem value="france">France</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="league-level">Level</Label>
                      <Select>
                        <SelectTrigger id="league-level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Level 1 (Top Tier)</SelectItem>
                          <SelectItem value="2">Level 2</SelectItem>
                          <SelectItem value="3">Level 3</SelectItem>
                          <SelectItem value="4">Level 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="league-teams">Number of Teams</Label>
                      <Input id="league-teams" type="number" placeholder="20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="league-format">Competition Format</Label>
                      <Select>
                        <SelectTrigger id="league-format">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="league">League</SelectItem>
                          <SelectItem value="knockout">Knockout</SelectItem>
                          <SelectItem value="group-knockout">Group + Knockout</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button onClick={() => handleCreate("League")} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create League
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="country" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Create New Country
                </CardTitle>
                <CardDescription>
                  Add a new country or nation with automatic ID assignment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <IdCounter type="Countries" {...mockIdData.countries} />
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country-name">Country Name</Label>
                      <Input id="country-name" placeholder="Enter country name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country-code">ISO Code</Label>
                      <Input id="country-code" placeholder="e.g., GBR" maxLength={3} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country-confederation">Confederation</Label>
                      <Select>
                        <SelectTrigger id="country-confederation">
                          <SelectValue placeholder="Select confederation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="uefa">UEFA (Europe)</SelectItem>
                          <SelectItem value="conmebol">CONMEBOL (South America)</SelectItem>
                          <SelectItem value="concacaf">CONCACAF (North America)</SelectItem>
                          <SelectItem value="afc">AFC (Asia)</SelectItem>
                          <SelectItem value="caf">CAF (Africa)</SelectItem>
                          <SelectItem value="ofc">OFC (Oceania)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country-tier">Tier Level</Label>
                      <Select>
                        <SelectTrigger id="country-tier">
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Top Tier</SelectItem>
                          <SelectItem value="2">Second Tier</SelectItem>
                          <SelectItem value="3">Third Tier</SelectItem>
                          <SelectItem value="4">Fourth Tier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country-capital">Capital City</Label>
                    <Input id="country-capital" placeholder="Enter capital city" />
                  </div>

                  <Button onClick={() => handleCreate("Country")} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Country
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}