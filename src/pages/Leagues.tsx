import { useState } from "react";
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

// Mock data for teams
const mockTeams = [
  { id: 1, name: "Arsenal", short: "ARS", code: "ENG", league: "England Premier League (1)", ovr: 83 },
  { id: 2, name: "Aston Villa", short: "AVL", code: "ENG", league: "England Premier League (1)", ovr: 80 },
  { id: 3, name: "Blackburn Rovers", short: "BLB", code: "ENG", league: "England Championship (2)", ovr: 69 },
  { id: 4, name: "Bolton Wanderers", short: "BOL", code: "ENG", league: "England League One (3)", ovr: 66 },
  { id: 5, name: "Chelsea", short: "CHE", code: "ENG", league: "England Premier League (1)", ovr: 80 },
  { id: 7, name: "Everton", short: "EVE", code: "ENG", league: "England Premier League (1)", ovr: 76 },
  { id: 8, name: "Leeds United", short: "LEE", code: "ENG", league: "England Championship (2)", ovr: 73 },
  { id: 9, name: "Liverpool", short: "LIV", code: "ENG", league: "England Premier League (1)", ovr: 83 },
  { id: 10, name: "Manchester City", short: "MCI", code: "ENG", league: "England Premier League (1)", ovr: 86 },
  { id: 11, name: "Manchester United", short: "MUN", code: "ENG", league: "England Premier League (1)", ovr: 82 },
  { id: 12, name: "Newcastle United", short: "NEW", code: "ENG", league: "England Premier League (1)", ovr: 78 },
  { id: 13, name: "Real Madrid", short: "RMA", code: "ESP", league: "Spain Primera División (1)", ovr: 87 },
  { id: 14, name: "Barcelona", short: "BAR", code: "ESP", league: "Spain Primera División (1)", ovr: 85 },
  { id: 15, name: "Atlético Madrid", short: "ATM", code: "ESP", league: "Spain Primera División (1)", ovr: 83 },
  { id: 16, name: "Bayern Munich", short: "BAY", code: "GER", league: "Germany Bundesliga (1)", ovr: 86 },
  { id: 17, name: "Borussia Dortmund", short: "BVB", code: "GER", league: "Germany Bundesliga (1)", ovr: 82 },
  { id: 18, name: "Paris Saint-Germain", short: "PSG", code: "FRA", league: "France Ligue 1 (1)", ovr: 85 },
  { id: 19, name: "Juventus", short: "JUV", code: "ITA", league: "Italy Serie A (1)", ovr: 82 },
  { id: 20, name: "AC Milan", short: "ACM", code: "ITA", league: "Italy Serie A (1)", ovr: 80 },
];

const countries = ["All countries", "England", "Spain", "Germany", "France", "Italy", "Netherlands", "Portugal"];
const leagues = [
  "All leagues",
  "England Premier League (1)",
  "England Championship (2)",
  "England League One (3)",
  "Spain Primera División (1)",
  "Germany Bundesliga (1)",
  "France Ligue 1 (1)",
  "Italy Serie A (1)",
];

export default function Leagues() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All countries");
  const [selectedLeague, setSelectedLeague] = useState("All leagues");
  const [itemsPerPage, setItemsPerPage] = useState("50");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter teams based on search and selections
  const filteredTeams = mockTeams.filter((team) => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.short.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry === "All countries" || 
      (selectedCountry === "England" && team.code === "ENG") ||
      (selectedCountry === "Spain" && team.code === "ESP") ||
      (selectedCountry === "Germany" && team.code === "GER") ||
      (selectedCountry === "France" && team.code === "FRA") ||
      (selectedCountry === "Italy" && team.code === "ITA");
    
    const matchesLeague = selectedLeague === "All leagues" || team.league === selectedLeague;
    
    return matchesSearch && matchesCountry && matchesLeague;
  });

  const totalPages = Math.ceil(filteredTeams.length / parseInt(itemsPerPage));
  const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
  const paginatedTeams = filteredTeams.slice(startIndex, startIndex + parseInt(itemsPerPage));

  const getOvrColor = (ovr: number) => {
    if (ovr >= 85) return "text-emerald-500";
    if (ovr >= 80) return "text-green-500";
    if (ovr >= 75) return "text-yellow-500";
    if (ovr >= 70) return "text-orange-500";
    return "text-red-500";
  };

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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((league) => (
                    <SelectItem key={league} value={league}>
                      {league}
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
                    <TableCell className="text-muted-foreground">{team.short}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{team.code}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{team.league}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-bold ${getOvrColor(team.ovr)}`}>
                        {team.ovr}
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