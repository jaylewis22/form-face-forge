import { useNavigate } from "react-router-dom";
import { Shield, Users, Trophy, Calendar, BarChart3, Database } from "lucide-react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { StatsCard } from "@/components/Dashboard/StatsCard";

export default function Dashboard() {
  const navigate = useNavigate();

  const dashboardItems = [
    { title: "Edit Teams", icon: Shield, path: "/teams", color: "text-cyan-400" },
    { title: "Manage Leagues", icon: Trophy, path: "/leagues", color: "text-green-400" },
    { title: "Arrange Competitions", icon: Trophy, path: "/competitions", color: "text-green-400" },
    { title: "Edit Kits", icon: Users, path: "/kits", color: "text-blue-400" },
    { title: "Schedule Editor", icon: Calendar, path: "/schedule", color: "text-purple-400" },
    { title: "Database Options", icon: Database, path: "/database", color: "text-amber-400" },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the compdata Editor</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard label="Selected League" value="Premier League" />
          <StatsCard label="Teams" value="20" />
          <StatsCard label="Players" value="541" />
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => (
            <DashboardCard
              key={item.path}
              title={item.title}
              icon={item.icon}
              iconColor={item.color}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-all">
              Save
            </button>
            <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-all">
              Export
            </button>
            <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-all">
              Import
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}