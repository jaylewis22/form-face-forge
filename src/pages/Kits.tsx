import { AppLayout } from "@/components/Layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Save, Shirt, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function Kits() {
  const [homeKit, setHomeKit] = useState({
    primaryColor: "#FF0000",
    secondaryColor: "#FFFFFF",
    pattern: "solid",
    sponsor: "Team Sponsor"
  });
  
  const [awayKit, setAwayKit] = useState({
    primaryColor: "#FFFFFF",
    secondaryColor: "#000000",
    pattern: "solid",
    sponsor: "Team Sponsor"
  });

  const [selectedTeam, setSelectedTeam] = useState("Manchester United");

  const patterns = [
    { value: "solid", label: "Solid" },
    { value: "stripes", label: "Stripes" },
    { value: "hoops", label: "Hoops" },
    { value: "halves", label: "Halves" },
    { value: "gradient", label: "Gradient" },
    { value: "chevron", label: "Chevron" }
  ];

  const teams = [
    "Manchester United",
    "Liverpool",
    "Chelsea",
    "Arsenal",
    "Manchester City",
    "Tottenham",
    "Leicester City",
    "West Ham"
  ];

  const handleSave = () => {
    toast({
      title: "Kits Updated",
      description: `${selectedTeam} kits have been saved successfully.`,
    });
  };

  const KitPreview = ({ kit, type }: { kit: typeof homeKit; type: string }) => {
    const getPatternStyle = () => {
      switch (kit.pattern) {
        case "stripes":
          return {
            background: `repeating-linear-gradient(90deg, ${kit.primaryColor} 0px, ${kit.primaryColor} 20px, ${kit.secondaryColor} 20px, ${kit.secondaryColor} 40px)`
          };
        case "hoops":
          return {
            background: `repeating-linear-gradient(0deg, ${kit.primaryColor} 0px, ${kit.primaryColor} 20px, ${kit.secondaryColor} 20px, ${kit.secondaryColor} 40px)`
          };
        case "halves":
          return {
            background: `linear-gradient(90deg, ${kit.primaryColor} 50%, ${kit.secondaryColor} 50%)`
          };
        case "gradient":
          return {
            background: `linear-gradient(180deg, ${kit.primaryColor}, ${kit.secondaryColor})`
          };
        case "chevron":
          return {
            background: `repeating-linear-gradient(45deg, ${kit.primaryColor} 0px, ${kit.primaryColor} 20px, ${kit.secondaryColor} 20px, ${kit.secondaryColor} 40px)`
          };
        default:
          return { backgroundColor: kit.primaryColor };
      }
    };

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {/* Kit Shirt */}
          <div className="relative w-48 h-56">
            <svg viewBox="0 0 200 240" className="w-full h-full">
              {/* Shirt Body */}
              <path
                d="M 50 60 L 50 30 L 70 10 L 90 10 L 100 25 L 110 10 L 130 10 L 150 30 L 150 60 L 130 70 L 130 200 L 70 200 L 70 70 Z"
                fill={kit.primaryColor}
                style={getPatternStyle()}
                stroke={kit.secondaryColor}
                strokeWidth="2"
              />
              {/* Sleeves */}
              <path
                d="M 50 60 L 20 80 L 20 120 L 50 100 L 70 70 M 150 60 L 180 80 L 180 120 L 150 100 L 130 70"
                fill={kit.primaryColor}
                style={getPatternStyle()}
                stroke={kit.secondaryColor}
                strokeWidth="2"
              />
              {/* Collar */}
              <circle cx="100" cy="25" r="15" fill="none" stroke={kit.secondaryColor} strokeWidth="3" />
              {/* Sponsor Text */}
              <text
                x="100"
                y="120"
                textAnchor="middle"
                fill={kit.secondaryColor}
                fontSize="14"
                fontWeight="bold"
              >
                {kit.sponsor}
              </text>
            </svg>
          </div>
          {/* Shorts */}
          <div 
            className="w-32 h-20 mx-auto -mt-4 rounded-b-lg border-2"
            style={{ 
              backgroundColor: kit.secondaryColor,
              borderColor: kit.primaryColor
            }}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{type} Kit</p>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Kits</h1>
            <p className="text-muted-foreground mt-1">Customize your team's home and away kits</p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>

        {/* Team Selection */}
        <Card className="p-6">
          <Label htmlFor="team-select">Select Team</Label>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger id="team-select" className="w-full mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="home">Home Kit</TabsTrigger>
            <TabsTrigger value="away">Away Kit</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Home Kit Preview */}
              <Card className="p-8 flex items-center justify-center bg-gradient-to-br from-background to-muted">
                <KitPreview kit={homeKit} type="Home" />
              </Card>

              {/* Home Kit Customization */}
              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shirt className="w-5 h-5" />
                    Customize Home Kit
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="home-primary">Primary Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="home-primary"
                          type="color"
                          value={homeKit.primaryColor}
                          onChange={(e) => setHomeKit({ ...homeKit, primaryColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={homeKit.primaryColor}
                          onChange={(e) => setHomeKit({ ...homeKit, primaryColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="home-secondary">Secondary Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="home-secondary"
                          type="color"
                          value={homeKit.secondaryColor}
                          onChange={(e) => setHomeKit({ ...homeKit, secondaryColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={homeKit.secondaryColor}
                          onChange={(e) => setHomeKit({ ...homeKit, secondaryColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Pattern</Label>
                      <RadioGroup 
                        value={homeKit.pattern} 
                        onValueChange={(value) => setHomeKit({ ...homeKit, pattern: value })}
                        className="grid grid-cols-2 gap-2 mt-2"
                      >
                        {patterns.map((pattern) => (
                          <div key={pattern.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={pattern.value} id={`home-${pattern.value}`} />
                            <Label htmlFor={`home-${pattern.value}`} className="cursor-pointer">
                              {pattern.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="home-sponsor">Sponsor Text</Label>
                      <Input
                        id="home-sponsor"
                        type="text"
                        value={homeKit.sponsor}
                        onChange={(e) => setHomeKit({ ...homeKit, sponsor: e.target.value })}
                        className="mt-2"
                        placeholder="Enter sponsor name"
                      />
                    </div>

                    <Button variant="outline" className="w-full gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="away" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Away Kit Preview */}
              <Card className="p-8 flex items-center justify-center bg-gradient-to-br from-background to-muted">
                <KitPreview kit={awayKit} type="Away" />
              </Card>

              {/* Away Kit Customization */}
              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shirt className="w-5 h-5" />
                    Customize Away Kit
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="away-primary">Primary Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="away-primary"
                          type="color"
                          value={awayKit.primaryColor}
                          onChange={(e) => setAwayKit({ ...awayKit, primaryColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={awayKit.primaryColor}
                          onChange={(e) => setAwayKit({ ...awayKit, primaryColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="away-secondary">Secondary Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="away-secondary"
                          type="color"
                          value={awayKit.secondaryColor}
                          onChange={(e) => setAwayKit({ ...awayKit, secondaryColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={awayKit.secondaryColor}
                          onChange={(e) => setAwayKit({ ...awayKit, secondaryColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Pattern</Label>
                      <RadioGroup 
                        value={awayKit.pattern} 
                        onValueChange={(value) => setAwayKit({ ...awayKit, pattern: value })}
                        className="grid grid-cols-2 gap-2 mt-2"
                      >
                        {patterns.map((pattern) => (
                          <div key={pattern.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={pattern.value} id={`away-${pattern.value}`} />
                            <Label htmlFor={`away-${pattern.value}`} className="cursor-pointer">
                              {pattern.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="away-sponsor">Sponsor Text</Label>
                      <Input
                        id="away-sponsor"
                        type="text"
                        value={awayKit.sponsor}
                        onChange={(e) => setAwayKit({ ...awayKit, sponsor: e.target.value })}
                        className="mt-2"
                        placeholder="Enter sponsor name"
                      />
                    </div>

                    <Button variant="outline" className="w-full gap-2">
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}