import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Share2,
  Download,
  Trophy,
  Target,
  Activity,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock player data - in a real app, this would come from an API
const mockPlayersData: Record<string, any> = {
  "1": {
    id: "1",
    name: "David de Gea",
    position: "Goalkeeper",
    number: 1,
    age: 32,
    nationality: "Spain",
    rating: 85,
    height: "192 cm",
    weight: "82 kg",
    foot: "Right",
    joinDate: "July 2011",
    contract: "June 2025",
    value: "€18M",
    wage: "€375K/week",
    attributes: {
      physical: [
        { name: "Pace", value: 57 },
        { name: "Strength", value: 70 },
        { name: "Stamina", value: 75 },
      ],
      technical: [
        { name: "Handling", value: 88 },
        { name: "Reflexes", value: 90 },
        { name: "Positioning", value: 89 },
        { name: "Diving", value: 87 },
      ],
      mental: [
        { name: "Composure", value: 86 },
        { name: "Concentration", value: 88 },
        { name: "Decision Making", value: 84 },
      ],
    },
    stats: {
      appearances: 145,
      cleanSheets: 58,
      saves: 412,
      goalsAgainst: 87,
    },
  },
  "2": {
    id: "2",
    name: "Harry Maguire",
    position: "Defender",
    number: 5,
    age: 30,
    nationality: "England",
    rating: 82,
    height: "194 cm",
    weight: "100 kg",
    foot: "Right",
    joinDate: "August 2019",
    contract: "June 2025",
    value: "€22M",
    wage: "€190K/week",
    attributes: {
      physical: [
        { name: "Pace", value: 60 },
        { name: "Strength", value: 86 },
        { name: "Stamina", value: 76 },
      ],
      technical: [
        { name: "Marking", value: 83 },
        { name: "Tackling", value: 84 },
        { name: "Heading", value: 88 },
        { name: "Passing", value: 77 },
      ],
      mental: [
        { name: "Composure", value: 80 },
        { name: "Concentration", value: 82 },
        { name: "Decision Making", value: 79 },
      ],
    },
    stats: {
      appearances: 128,
      goals: 7,
      assists: 3,
      tackles: 245,
    },
  },
  "3": {
    id: "3",
    name: "Bruno Fernandes",
    position: "Midfielder",
    number: 8,
    age: 28,
    nationality: "Portugal",
    rating: 88,
    height: "179 cm",
    weight: "69 kg",
    foot: "Right",
    joinDate: "January 2020",
    contract: "June 2026",
    value: "€75M",
    wage: "€240K/week",
    attributes: {
      physical: [
        { name: "Pace", value: 75 },
        { name: "Strength", value: 72 },
        { name: "Stamina", value: 88 },
      ],
      technical: [
        { name: "Passing", value: 91 },
        { name: "Dribbling", value: 84 },
        { name: "Shooting", value: 87 },
        { name: "Vision", value: 92 },
      ],
      mental: [
        { name: "Composure", value: 88 },
        { name: "Concentration", value: 86 },
        { name: "Decision Making", value: 90 },
      ],
    },
    stats: {
      appearances: 156,
      goals: 58,
      assists: 47,
      keyPasses: 312,
    },
  },
  "4": {
    id: "4",
    name: "Marcus Rashford",
    position: "Forward",
    number: 10,
    age: 25,
    nationality: "England",
    rating: 86,
    height: "180 cm",
    weight: "70 kg",
    foot: "Right",
    joinDate: "July 2015",
    contract: "June 2028",
    value: "€85M",
    wage: "€325K/week",
    attributes: {
      physical: [
        { name: "Pace", value: 93 },
        { name: "Strength", value: 78 },
        { name: "Stamina", value: 85 },
      ],
      technical: [
        { name: "Finishing", value: 85 },
        { name: "Dribbling", value: 87 },
        { name: "Shooting", value: 86 },
        { name: "Crossing", value: 81 },
      ],
      mental: [
        { name: "Composure", value: 84 },
        { name: "Concentration", value: 82 },
        { name: "Decision Making", value: 83 },
      ],
    },
    stats: {
      appearances: 178,
      goals: 72,
      assists: 38,
      shots: 456,
    },
  },
  "5": {
    id: "5",
    name: "Casemiro",
    position: "Midfielder",
    number: 18,
    age: 31,
    nationality: "Brazil",
    rating: 87,
    height: "185 cm",
    weight: "84 kg",
    foot: "Right",
    joinDate: "August 2022",
    contract: "June 2026",
    value: "€45M",
    wage: "€350K/week",
    attributes: {
      physical: [
        { name: "Pace", value: 70 },
        { name: "Strength", value: 88 },
        { name: "Stamina", value: 84 },
      ],
      technical: [
        { name: "Tackling", value: 90 },
        { name: "Passing", value: 84 },
        { name: "Interceptions", value: 89 },
        { name: "Positioning", value: 91 },
      ],
      mental: [
        { name: "Composure", value: 89 },
        { name: "Concentration", value: 88 },
        { name: "Decision Making", value: 87 },
      ],
    },
    stats: {
      appearances: 89,
      goals: 8,
      assists: 7,
      tackles: 234,
    },
  },
};

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const player = mockPlayersData[id || "1"] || mockPlayersData["1"];

  const handleEdit = () => {
    toast({
      title: "Edit Player",
      description: "Player editing feature coming soon!",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share Player",
      description: "Player profile copied to clipboard!",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Player Data",
      description: "Player data exported successfully!",
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="glass"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{player.name}</h1>
              <p className="text-muted-foreground">Player Profile</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleShare} variant="outline" size="icon" className="glass">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button onClick={handleExport} variant="outline" size="icon" className="glass">
              <Download className="h-4 w-4" />
            </Button>
            <Button onClick={handleEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Overview Card */}
          <Card className="glass lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-primary/10">
                    {player.number}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{player.name}</h2>
                  <Badge variant="secondary" className="text-sm">
                    {player.position}
                  </Badge>
                  <div className="text-3xl font-bold text-green-500">{player.rating}</div>
                </div>

                <Separator />

                <div className="w-full space-y-3 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">{player.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nationality:</span>
                    <span className="font-medium">{player.nationality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height:</span>
                    <span className="font-medium">{player.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-medium">{player.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preferred Foot:</span>
                    <span className="font-medium">{player.foot}</span>
                  </div>
                </div>

                <Separator />

                <div className="w-full space-y-3 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Value:</span>
                    <span className="font-bold text-primary">{player.value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wage:</span>
                    <span className="font-medium">{player.wage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="font-medium">{player.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract Until:</span>
                    <span className="font-medium">{player.contract}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Attributes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Season Stats */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Season Statistics
                </CardTitle>
                <CardDescription>Performance metrics for current season</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(player.stats).map(([key, value]) => (
                    <div key={key} className="text-center p-4 rounded-lg bg-card/50 border">
                      <div className="text-3xl font-bold text-primary">{value as number}</div>
                      <div className="text-xs text-muted-foreground mt-1 capitalize">
                        {String(key).replace(/([A-Z])/g, " $1").trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attributes */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Player Attributes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="physical" className="space-y-4">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="physical">Physical</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="mental">Mental</TabsTrigger>
                  </TabsList>

                  <TabsContent value="physical" className="space-y-3">
                    {player.attributes.physical.map((attr: any) => (
                      <div key={attr.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{attr.name}</span>
                          <span className="font-bold">{attr.value}</span>
                        </div>
                        <Progress value={attr.value} className="h-2" />
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-3">
                    {player.attributes.technical.map((attr: any) => (
                      <div key={attr.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{attr.name}</span>
                          <span className="font-bold">{attr.value}</span>
                        </div>
                        <Progress value={attr.value} className="h-2" />
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="mental" className="space-y-3">
                    {player.attributes.mental.map((attr: any) => (
                      <div key={attr.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{attr.name}</span>
                          <span className="font-bold">{attr.value}</span>
                        </div>
                        <Progress value={attr.value} className="h-2" />
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
