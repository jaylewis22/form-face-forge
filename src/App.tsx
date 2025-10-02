import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

import Players from "./pages/Players";
import Teams from "./pages/Teams";
import Leagues from "./pages/Leagues";
import PlaceholderPage from "./pages/PlaceholderPage";
import Competitions from "./pages/Competitions";
import NotFound from "./pages/NotFound";
import DatabasePage from "./pages/Database";
import Settings from "./pages/Settings";
import CreationHub from "./pages/CreationHub";
import ScheduleEditor from "./pages/ScheduleEditor";
import Kits from "./pages/Kits";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/players" element={<Players />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/creation-hub" element={<CreationHub />} />
          <Route path="/trophies" element={<Leagues />} />
          <Route path="/schedule" element={<ScheduleEditor />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/kits" element={<Kits />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
