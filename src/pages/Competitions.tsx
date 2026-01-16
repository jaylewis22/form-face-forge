import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Trophy, 
  Users, 
  Calendar as CalendarIcon,
  Shield,
  Target,
  Plus,
  Settings,
  ChevronRight,
  Star,
  Flag,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompetitions } from "@/hooks/useCompetitions";
import { useTeams } from "@/hooks/useTeams";
import { Skeleton } from "@/components/ui/skeleton";

export default function Competitions() {
  const { data: competitions, isLoading: competitionsLoading } = useCompetitions();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  
  const [selectedType, setSelectedType] = useState("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [competitionName, setCompetitionName] = useState("");
  const [competitionType, setCompetitionType] = useState("");
  const [numberOfTeams, setNumberOfTeams] = useState("");
  const [format, setFormat] = useState("");

  const filteredCompetitions = competitions?.filter(comp => 
    selectedType === "all" || comp.competition_type?.toLowerCase() === selectedType
  ) || [];

  const getTypeIcon = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case "league":
        return <Shield className="h-4 w-4" />;
      case "cup":
        return <Trophy className="h-4 w-4" />;
      case "tournament":
        return <Target className="h-4 w-4" />;
      case "friendly":
        return <Users className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  const isLoading = competitionsLoading || teamsLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Competitions</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const totalCompetitions = competitions?.length || 0;
  const totalTeams = teams?.length || 0;
  const competitionTypes = [...new Set(competitions?.map(c => c.competition_type).filter(Boolean))];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Competitions</h1>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Competition
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Competitions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompetitions}</div>
              <p className="text-xs text-muted-foreground mt-1">In database</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTeams}</div>
              <p className="text-xs text-muted-foreground mt-1">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Competition Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{competitionTypes.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {[...new Set(competitions?.map(c => c.country_code).filter(Boolean))].length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Represented</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="existing" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="existing">Existing Competitions</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Existing Competitions Tab */}
          <TabsContent value="existing" className="space-y-4">
            {/* Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filter Competitions</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Competition Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {competitionTypes.map((type) => (
                      <SelectItem key={type} value={type!.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Competitions List */}
            {filteredCompetitions.length > 0 ? (
              <div className="grid gap-4">
                {filteredCompetitions.map((comp) => (
                  <Card key={comp.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            {getTypeIcon(comp.competition_type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{comp.name}</h3>
                              {comp.competition_type && (
                                <Badge variant="secondary">
                                  {comp.competition_type}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {comp.short_name && (
                                <span className="flex items-center gap-1">
                                  <Flag className="h-3 w-3" />
                                  {comp.short_name}
                                </span>
                              )}
                              {comp.country_code && (
                                <Badge variant="outline" className="text-xs">
                                  {comp.country_code}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Competitions Found</h2>
                <p className="text-muted-foreground">
                  {competitions?.length === 0 
                    ? "Import a database to see competitions here."
                    : "No competitions match the selected filter."}
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Create New Competition Tab */}
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Competition</CardTitle>
                <CardDescription>
                  Set up a new league, tournament, cup, or friendly competition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="comp-name">Competition Name</Label>
                    <Input
                      id="comp-name"
                      placeholder="e.g., Summer League 2024"
                      value={competitionName}
                      onChange={(e) => setCompetitionName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Competition Type</Label>
                    <Select value={competitionType} onValueChange={setCompetitionType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="league">League</SelectItem>
                        <SelectItem value="cup">Cup</SelectItem>
                        <SelectItem value="tournament">Tournament</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teams">Number of Teams</Label>
                    <Input
                      id="teams"
                      type="number"
                      placeholder="e.g., 20"
                      value={numberOfTeams}
                      onChange={(e) => setNumberOfTeams(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="round-robin">Round Robin</SelectItem>
                        <SelectItem value="single-elimination">Single Elimination</SelectItem>
                        <SelectItem value="double-elimination">Double Elimination</SelectItem>
                        <SelectItem value="group-knockout">Group + Knockout</SelectItem>
                        <SelectItem value="swiss">Swiss System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? startDate.toLocaleDateString() : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? endDate.toLocaleDateString() : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Competition</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Standard League", description: "Round-robin format, home and away matches", icon: Shield, teams: "10-30" },
                { name: "Knockout Cup", description: "Single elimination tournament", icon: Trophy, teams: "8-64" },
                { name: "Group Stage + Knockout", description: "UEFA Champions League style", icon: Star, teams: "16-32" },
                { name: "Swiss System", description: "Chess-style tournament format", icon: Target, teams: "8-256" },
                { name: "Double Round Robin", description: "Each team plays twice against every other", icon: Users, teams: "4-20" },
                { name: "Playoffs", description: "Top teams compete for the championship", icon: Award, teams: "4-16" },
              ].map((template, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <template.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Teams: {template.teams}</span>
                      <Button size="sm" variant="outline">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
