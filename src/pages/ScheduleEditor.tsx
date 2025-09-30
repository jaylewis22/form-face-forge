import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Clock, MapPin, Users, Trophy, Plus, Edit2, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  time: string;
  venue: string;
  competition: string;
  status: "scheduled" | "live" | "completed" | "postponed";
}

export default function ScheduleEditor() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [matchDate, setMatchDate] = useState<Date | undefined>();
  const [matches, setMatches] = useState<Match[]>([
    {
      id: "1",
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      date: new Date(),
      time: "15:00",
      venue: "Old Trafford",
      competition: "Premier League",
      status: "scheduled"
    },
    {
      id: "2",
      homeTeam: "Chelsea",
      awayTeam: "Arsenal",
      date: new Date(Date.now() + 86400000),
      time: "17:30",
      venue: "Stamford Bridge",
      competition: "Premier League",
      status: "scheduled"
    }
  ]);

  const getStatusColor = (status: Match["status"]) => {
    switch (status) {
      case "scheduled": return "bg-blue-500/10 text-blue-500";
      case "live": return "bg-red-500/10 text-red-500";
      case "completed": return "bg-green-500/10 text-green-500";
      case "postponed": return "bg-yellow-500/10 text-yellow-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Editor</h1>
          <p className="text-muted-foreground">Manage match fixtures and competition schedules</p>
        </div>

        <Tabs defaultValue="fixtures" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="create">Create Match</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          </TabsList>

          <TabsContent value="fixtures" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Fixtures</CardTitle>
                <CardDescription>Manage and edit scheduled matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Input placeholder="Search matches..." className="max-w-sm" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Competition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Competitions</SelectItem>
                      <SelectItem value="premier">Premier League</SelectItem>
                      <SelectItem value="champions">Champions League</SelectItem>
                      <SelectItem value="cup">FA Cup</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="scheduled">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="postponed">Postponed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                              {format(match.date, "MMM dd")}
                            </p>
                            <p className="font-semibold">{match.time}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-semibold">{match.homeTeam}</p>
                              <p className="text-sm text-muted-foreground">Home</p>
                            </div>
                            <div className="px-4 py-2 bg-muted rounded">
                              <p className="text-sm font-bold">VS</p>
                            </div>
                            <div>
                              <p className="font-semibold">{match.awayTeam}</p>
                              <p className="text-sm text-muted-foreground">Away</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {match.venue}
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4" />
                              {match.competition}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={cn(getStatusColor(match.status))}>
                            {match.status}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>View and manage fixtures in calendar format</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-4">
                    Matches on {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : "Select a date"}
                  </h3>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {matches
                        .filter(m => selectedDate && format(m.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"))
                        .map((match) => (
                          <div key={match.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-sm">{match.time}</p>
                              <Badge variant="outline" className="text-xs">
                                {match.competition}
                              </Badge>
                            </div>
                            <p className="text-sm">{match.homeTeam} vs {match.awayTeam}</p>
                            <p className="text-xs text-muted-foreground mt-1">{match.venue}</p>
                          </div>
                        ))}
                      {selectedDate && matches.filter(m => format(m.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")).length === 0 && (
                        <p className="text-muted-foreground text-center py-8">No matches scheduled</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Match</CardTitle>
                <CardDescription>Schedule a new fixture</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="competition">Competition</Label>
                      <Select>
                        <SelectTrigger id="competition">
                          <SelectValue placeholder="Select competition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="premier">Premier League</SelectItem>
                          <SelectItem value="champions">Champions League</SelectItem>
                          <SelectItem value="cup">FA Cup</SelectItem>
                          <SelectItem value="league-cup">League Cup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="home-team">Home Team</Label>
                      <Select>
                        <SelectTrigger id="home-team">
                          <SelectValue placeholder="Select home team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="man-utd">Manchester United</SelectItem>
                          <SelectItem value="liverpool">Liverpool</SelectItem>
                          <SelectItem value="chelsea">Chelsea</SelectItem>
                          <SelectItem value="arsenal">Arsenal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="away-team">Away Team</Label>
                      <Select>
                        <SelectTrigger id="away-team">
                          <SelectValue placeholder="Select away team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="man-city">Manchester City</SelectItem>
                          <SelectItem value="tottenham">Tottenham</SelectItem>
                          <SelectItem value="newcastle">Newcastle</SelectItem>
                          <SelectItem value="brighton">Brighton</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Match Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !matchDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {matchDate ? format(matchDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={matchDate}
                            onSelect={setMatchDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Kick-off Time</Label>
                      <Input id="time" type="time" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue</Label>
                      <Select>
                        <SelectTrigger id="venue">
                          <SelectValue placeholder="Select venue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="old-trafford">Old Trafford</SelectItem>
                          <SelectItem value="anfield">Anfield</SelectItem>
                          <SelectItem value="emirates">Emirates Stadium</SelectItem>
                          <SelectItem value="stamford">Stamford Bridge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline">Cancel</Button>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Match
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Import</CardTitle>
                <CardDescription>Import multiple fixtures from CSV or generate season fixtures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop a CSV file here, or click to browse
                  </p>
                  <Button variant="outline">
                    Select CSV File
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Generate Season Fixtures</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Competition</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select competition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="league">League</SelectItem>
                          <SelectItem value="cup">Cup</SelectItem>
                          <SelectItem value="tournament">Tournament</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Format</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="round-robin">Round Robin</SelectItem>
                          <SelectItem value="single-elim">Single Elimination</SelectItem>
                          <SelectItem value="double-elim">Double Elimination</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">
                    Generate Fixtures
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