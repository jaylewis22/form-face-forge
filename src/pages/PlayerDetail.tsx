import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Share2,
  Download,
  Activity,
  TrendingUp,
  User,
  Zap,
  Target,
  Brain,
  Shield,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePlayer, Player } from "@/hooks/usePlayers";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

import { RatingBadge, PotentialBadge, AttributeBar } from "@/components/Player/RatingBadge";
import { PositionBadge, PositionGroup } from "@/components/Player/PositionBadge";
import { AttributeHexagon } from "@/components/Player/RadarChart";

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const playerId = id ? parseInt(id, 10) : null;
  const { data: player, isLoading, error } = usePlayer(playerId);
  
  const [editedPlayer, setEditedPlayer] = useState<Partial<Player>>({});

  const handleEdit = () => {
    if (player) {
      setEditedPlayer({ ...player });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!player || !editedPlayer) return;
    
    try {
      const { error } = await supabase
        .from("players")
        .update(editedPlayer)
        .eq("id", player.id);
        
      if (error) throw error;
      
      toast({
        title: "Player Updated",
        description: "Player information has been updated successfully!",
      });
      
      queryClient.invalidateQueries({ queryKey: ["player", player.id] });
      queryClient.invalidateQueries({ queryKey: ["players"] });
      setIsEditDialogOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update player. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof Player, value: string | number | null) => {
    setEditedPlayer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Player profile link copied to clipboard!",
    });
  };

  const handleExport = () => {
    if (!player) return;
    const dataStr = JSON.stringify(player, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${player.name.replace(/\s+/g, "_")}_profile.json`;
    a.click();
    toast({
      title: "Export Complete",
      description: "Player data exported successfully!",
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded" />
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[500px] rounded-xl" />
            <Skeleton className="h-[500px] lg:col-span-2 rounded-xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !player) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="glass">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Player Not Found</h1>
              <p className="text-muted-foreground">The requested player could not be found.</p>
            </div>
          </div>
          <div className="glass rounded-xl p-8 text-center">
            <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              This player may have been removed or the ID is invalid.
            </p>
            <Button onClick={() => navigate("/players")}>Back to Players</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const isGK = player.position?.toUpperCase() === "GK";

  // Build attribute groups
  const paceAttributes = [
    { name: "Acceleration", value: player.acceleration || 0 },
    { name: "Sprint Speed", value: player.sprint_speed || 0 },
  ];
  
  const shootingAttributes = [
    { name: "Positioning", value: player.positioning || 0 },
    { name: "Finishing", value: player.finishing || 0 },
    { name: "Shot Power", value: player.shot_power || 0 },
    { name: "Long Shots", value: player.long_shots || 0 },
    { name: "Volleys", value: player.volleys || 0 },
    { name: "Penalties", value: player.penalties || 0 },
  ];
  
  const passingAttributes = [
    { name: "Vision", value: player.vision || 0 },
    { name: "Crossing", value: player.crossing || 0 },
    { name: "FK Accuracy", value: player.free_kick_accuracy || 0 },
    { name: "Short Passing", value: player.short_passing || 0 },
    { name: "Long Passing", value: player.long_passing || 0 },
    { name: "Curve", value: player.curve || 0 },
  ];
  
  const dribblingAttributes = [
    { name: "Agility", value: player.agility || 0 },
    { name: "Balance", value: player.balance || 0 },
    { name: "Reactions", value: player.reactions || 0 },
    { name: "Ball Control", value: player.ball_control || 0 },
    { name: "Composure", value: player.composure || 0 },
  ];
  
  const defendingAttributes = [
    { name: "Interceptions", value: player.interceptions || 0 },
    { name: "Heading Accuracy", value: player.heading_accuracy || 0 },
    { name: "Def. Awareness", value: player.def_awareness || 0 },
    { name: "Standing Tackle", value: player.standing_tackle || 0 },
    { name: "Sliding Tackle", value: player.sliding_tackle || 0 },
  ];
  
  const physicalAttributes = [
    { name: "Jumping", value: player.jumping || 0 },
    { name: "Stamina", value: player.stamina || 0 },
    { name: "Strength", value: player.strength || 0 },
    { name: "Aggression", value: player.aggression || 0 },
  ];
  
  const gkAttributes = [
    { name: "Diving", value: player.gk_diving || 0 },
    { name: "Handling", value: player.gk_handling || 0 },
    { name: "Kicking", value: player.gk_kicking || 0 },
    { name: "Reflexes", value: player.gk_reflexes || 0 },
    { name: "Positioning", value: player.gk_positioning || 0 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="glass">
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
                    {player.jersey_number || <User className="w-12 h-12" />}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{player.name}</h2>
                  {player.short_name && player.short_name !== player.name && (
                    <p className="text-muted-foreground">{player.short_name}</p>
                  )}
                  <div className="flex items-center justify-center gap-2">
                    <PositionBadge position={player.position || "N/A"} size="lg" />
                    {player.secondary_position && (
                      <PositionBadge position={player.secondary_position} size="md" />
                    )}
                  </div>
                  <PositionGroup position={player.position || ""} />
                </div>

                {/* Ratings */}
                <div className="py-4">
                  <PotentialBadge
                    current={player.overall_rating || 0}
                    potential={player.potential_rating || player.overall_rating || 0}
                    size="lg"
                  />
                </div>

                <Separator />

                {/* Basic Info */}
                <div className="w-full space-y-3 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age:</span>
                    <span className="font-medium">{player.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nationality:</span>
                    <span className="font-medium">{player.nationality || "Unknown"}</span>
                  </div>
                  {player.height && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Height:</span>
                      <span className="font-medium">{player.height} cm</span>
                    </div>
                  )}
                  {player.weight && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">{player.weight} kg</span>
                    </div>
                  )}
                  {player.preferred_foot && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preferred Foot:</span>
                      <span className="font-medium">{player.preferred_foot}</span>
                    </div>
                  )}
                  {player.weak_foot && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weak Foot:</span>
                      <span className="font-medium">{"★".repeat(player.weak_foot)}</span>
                    </div>
                  )}
                  {player.skill_moves && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Skill Moves:</span>
                      <span className="font-medium">{"★".repeat(player.skill_moves)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Team & Contract */}
                <div className="w-full space-y-3 text-left text-sm">
                  {player.team_name && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Team:</span>
                      <span className="font-bold text-primary">{player.team_name}</span>
                    </div>
                  )}
                  {player.jersey_number && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jersey:</span>
                      <span className="font-medium">#{player.jersey_number}</span>
                    </div>
                  )}
                  {player.wage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wage:</span>
                      <span className="font-medium">€{player.wage.toLocaleString()}/week</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Attributes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Radar Chart */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Attribute Overview
                </CardTitle>
                <CardDescription>Visual breakdown of main attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <AttributeHexagon
                    pace={player.pace || 0}
                    shooting={player.shooting || 0}
                    passing={player.passing || 0}
                    dribbling={player.dribbling || 0}
                    defending={player.defending || 0}
                    physical={player.physical || 0}
                    size={280}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Detailed Attributes */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Detailed Attributes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={isGK ? "goalkeeping" : "pace"} className="space-y-4">
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                    {isGK ? (
                      <TabsTrigger value="goalkeeping">GK</TabsTrigger>
                    ) : (
                      <>
                        <TabsTrigger value="pace">
                          <Zap className="w-3 h-3 mr-1" />
                          PAC
                        </TabsTrigger>
                        <TabsTrigger value="shooting">
                          <Target className="w-3 h-3 mr-1" />
                          SHO
                        </TabsTrigger>
                        <TabsTrigger value="passing">PAS</TabsTrigger>
                        <TabsTrigger value="dribbling">DRI</TabsTrigger>
                        <TabsTrigger value="defending">
                          <Shield className="w-3 h-3 mr-1" />
                          DEF
                        </TabsTrigger>
                        <TabsTrigger value="physical">
                          <Heart className="w-3 h-3 mr-1" />
                          PHY
                        </TabsTrigger>
                      </>
                    )}
                  </TabsList>

                  {isGK ? (
                    <TabsContent value="goalkeeping" className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <RatingBadge rating={player.overall_rating || 0} size="lg" />
                        <span className="text-lg font-semibold">Goalkeeping</span>
                      </div>
                      {gkAttributes.map((attr) => (
                        <AttributeBar key={attr.name} value={attr.value} label={attr.name} />
                      ))}
                    </TabsContent>
                  ) : (
                    <>
                      <TabsContent value="pace" className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <RatingBadge rating={player.pace || 0} size="lg" />
                          <span className="text-lg font-semibold">Pace</span>
                        </div>
                        {paceAttributes.map((attr) => (
                          <AttributeBar key={attr.name} value={attr.value} label={attr.name} />
                        ))}
                      </TabsContent>

                      <TabsContent value="shooting" className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <RatingBadge rating={player.shooting || 0} size="lg" />
                          <span className="text-lg font-semibold">Shooting</span>
                        </div>
                        {shootingAttributes.map((attr) => (
                          <AttributeBar key={attr.name} value={attr.value} label={attr.name} />
                        ))}
                      </TabsContent>

                      <TabsContent value="passing" className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <RatingBadge rating={player.passing || 0} size="lg" />
                          <span className="text-lg font-semibold">Passing</span>
                        </div>
                        {passingAttributes.map((attr) => (
                          <AttributeBar key={attr.name} value={attr.value} label={attr.name} />
                        ))}
                      </TabsContent>

                      <TabsContent value="dribbling" className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <RatingBadge rating={player.dribbling || 0} size="lg" />
                          <span className="text-lg font-semibold">Dribbling</span>
                        </div>
                        {dribblingAttributes.map((attr) => (
                          <AttributeBar key={attr.name} value={attr.value} label={attr.name} />
                        ))}
                      </TabsContent>

                      <TabsContent value="defending" className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <RatingBadge rating={player.defending || 0} size="lg" />
                          <span className="text-lg font-semibold">Defending</span>
                        </div>
                        {defendingAttributes.map((attr) => (
                          <AttributeBar key={attr.name} value={attr.value} label={attr.name} />
                        ))}
                      </TabsContent>

                      <TabsContent value="physical" className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <RatingBadge rating={player.physical || 0} size="lg" />
                          <span className="text-lg font-semibold">Physical</span>
                        </div>
                        {physicalAttributes.map((attr) => (
                          <AttributeBar key={attr.name} value={attr.value} label={attr.name} />
                        ))}
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Player</DialogTitle>
              <DialogDescription>
                Update player information and attributes
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editedPlayer.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="short_name">Short Name</Label>
                    <Input
                      id="short_name"
                      value={editedPlayer.short_name || ""}
                      onChange={(e) => handleInputChange("short_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={editedPlayer.age || ""}
                      onChange={(e) => handleInputChange("age", parseInt(e.target.value) || null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={editedPlayer.nationality || ""}
                      onChange={(e) => handleInputChange("nationality", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Ratings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Overall Rating: {editedPlayer.overall_rating || 0}</Label>
                    <Slider
                      value={[editedPlayer.overall_rating || 0]}
                      min={1}
                      max={99}
                      step={1}
                      onValueChange={([value]) => handleInputChange("overall_rating", value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Potential Rating: {editedPlayer.potential_rating || 0}</Label>
                    <Slider
                      value={[editedPlayer.potential_rating || 0]}
                      min={1}
                      max={99}
                      step={1}
                      onValueChange={([value]) => handleInputChange("potential_rating", value)}
                    />
                  </div>
                </div>
              </div>

              {/* Main Attributes */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Main Attributes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {["pace", "shooting", "passing", "dribbling", "defending", "physical"].map((attr) => (
                    <div key={attr} className="space-y-2">
                      <Label className="capitalize">{attr}: {editedPlayer[attr as keyof Player] || 0}</Label>
                      <Slider
                        value={[(editedPlayer[attr as keyof Player] as number) || 0]}
                        min={1}
                        max={99}
                        step={1}
                        onValueChange={([value]) => handleInputChange(attr as keyof Player, value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}