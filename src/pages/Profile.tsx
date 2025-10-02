import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Edit, 
  LogOut, 
  ArrowLeft,
  Trophy,
  Users,
  Target,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const mockUser = {
  name: "Alex Morgan",
  email: "alex.morgan@compdata.com",
  role: "Team Manager",
  joinDate: "January 2024",
  location: "Manchester, UK",
  avatar: "",
  bio: "Passionate about football management and team development. 10+ years experience in sports analytics.",
  stats: {
    teamsManaged: 3,
    playersRecruited: 45,
    matchesWon: 127,
    trophiesWon: 8,
  }
};

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing feature coming soon!",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Change Password",
      description: "Password change feature coming soon!",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header with Back Button */}
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
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="destructive" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-1">
            <Card className="glass">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="w-32 h-32 border-4 border-primary/20">
                    <AvatarImage src={mockUser.avatar} />
                    <AvatarFallback className="text-4xl bg-primary/10">
                      {mockUser.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{mockUser.name}</h2>
                    <Badge variant="secondary" className="text-sm">
                      {mockUser.role}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {mockUser.bio}
                  </p>

                  <Separator />

                  <div className="w-full space-y-3 text-left">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{mockUser.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{mockUser.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {mockUser.joinDate}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="w-full space-y-2">
                    <Button 
                      onClick={handleEditProfile} 
                      className="w-full gap-2"
                      variant="default"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button 
                      onClick={handleChangePassword}
                      className="w-full gap-2"
                      variant="outline"
                    >
                      <Shield className="h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold">{mockUser.stats.teamsManaged}</div>
                    <div className="text-xs text-muted-foreground">Teams Managed</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold">{mockUser.stats.playersRecruited}</div>
                    <div className="text-xs text-muted-foreground">Players Recruited</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold">{mockUser.stats.matchesWon}</div>
                    <div className="text-xs text-muted-foreground">Matches Won</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold">{mockUser.stats.trophiesWon}</div>
                    <div className="text-xs text-muted-foreground">Trophies Won</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Updated team roster", team: "Manchester United", time: "2 hours ago" },
                    { action: "Signed new player", team: "Manchester United", time: "5 hours ago" },
                    { action: "Created match schedule", team: "Premier League", time: "1 day ago" },
                    { action: "Modified team formation", team: "Manchester United", time: "2 days ago" },
                    { action: "Exported team data", team: "Manchester United", time: "3 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.team}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Unlock badges by completing milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "First Team", icon: Users, earned: true },
                    { name: "10 Wins", icon: Target, earned: true },
                    { name: "Champion", icon: Trophy, earned: true },
                    { name: "Expert", icon: Shield, earned: false },
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center text-center p-4 rounded-lg border ${
                        achievement.earned
                          ? "bg-primary/10 border-primary/20"
                          : "bg-muted/50 border-muted opacity-50"
                      }`}
                    >
                      <achievement.icon className={`h-8 w-8 mb-2 ${achievement.earned ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-xs font-medium">{achievement.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
