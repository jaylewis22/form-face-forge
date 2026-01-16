import { useState, useMemo } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeams } from "@/hooks/useTeams";
import { useLeagues } from "@/hooks/useLeagues";

export default function Leagues() {
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: leagues, isLoading: leaguesLoading } = useLeagues();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedLeague, setSelectedLeague] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("50");
  const [currentPage, setCurrentPage] = useState(1);

  // Create a league map for quick lookups
  const leagueMap = useMemo(() => {
    return new Map(leagues?.map(l => [l.id, l]) || []);
  }, [leagues]);

  // Get unique countries from teams
  const countries = useMemo(() => {
    if (!teams) return [];
    const codes = new Set(teams.map(t => t.country_code).filter(Boolean));
    return Array.from(codes).sort();
  }, [teams]);

  // Filter teams based on search and selections
  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    
    return teams.filter((team) => {
      const matchesSearch = 
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (team.short_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (team.country_code?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCountry = selectedCountry === "all" || team.country_code === selectedCountry;
      
      const matchesLeague = selectedLeague === "all" || String(team.league_id) === selectedLeague;
      
      return matchesSearch && matchesCountry && matchesLeague;
    });
  }, [teams, searchTerm, selectedCountry, selectedLeague]);

  const totalPages = Math.ceil(filteredTeams.length / parseInt(itemsPerPage));
  const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
  const paginatedTeams = filteredTeams.slice(startIndex, startIndex + parseInt(itemsPerPage));

  const getOvrColor = (ovr: number | null) => {
    if (!ovr) return "text-muted-foreground";
    if (ovr >= 85) return "text-emerald-500";
    if (ovr >= 80) return "text-green-500";
    if (ovr >= 75) return "text-yellow-500";
    if (ovr >= 70) return "text-orange-500";
    return "text-red-500";
  };

  const isLoading = teamsLoading || leaguesLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Leagues & Teams</h1>
            </div>
          </div>
          <Card className="p-4">
            <Skeleton className="h-10 w-full mb-4" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </Card>
          <Card className="overflow-hidden">
            <div className="p-4 space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Leagues & Teams</h1>
            </div>
          </div>
          <Card className="p-8 text-center">
            <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Teams Found</h2>
            <p className="text-muted-foreground">
              Import a database to see leagues and teams here.
            </p>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Leagues & Teams</h1>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {filteredTeams.length} total
          </Badge>
        </div>

        {/* Search and Filters */}
        <Card className="p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Search</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams (name, short, code)..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedCountry} onValueChange={(v) => { setSelectedCountry(v); setCurrentPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((code) => (
                    <SelectItem key={code} value={code!}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLeague} onValueChange={(v) => { setSelectedLeague(v); setCurrentPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Leagues" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leagues</SelectItem>
                  {leagues?.map((league) => (
                    <SelectItem key={league.id} value={String(league.id)}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Teams Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-20">Short</TableHead>
                <TableHead className="w-20">Code</TableHead>
                <TableHead>League</TableHead>
                <TableHead className="w-20 text-right">OVR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTeams.length > 0 ? (
                paginatedTeams.map((team) => (
                  <TableRow 
                    key={team.id} 
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">{team.id}</TableCell>
                    <TableCell className="font-semibold">{team.name}</TableCell>
                    <TableCell className="text-muted-foreground">{team.short_name || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{team.country_code || "-"}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {team.league_id ? leagueMap.get(team.league_id)?.name || "-" : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-bold ${getOvrColor(team.overall_rating)}`}>
                        {team.overall_rating || "-"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No teams found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + parseInt(itemsPerPage), filteredTeams.length)} of {filteredTeams.length} teams
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-10"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
