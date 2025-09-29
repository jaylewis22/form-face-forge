import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Roster from "./pages/Roster";
import Players from "./pages/Players";
import Teams from "./pages/Teams";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import DatabasePage from "./pages/Database";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/players" element={<Players />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/trophies" element={<PlaceholderPage title="Leagues" />} />
          <Route path="/schedule" element={<PlaceholderPage title="Schedule Editor" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="/leagues" element={<PlaceholderPage title="Manage Leagues" />} />
          <Route path="/competitions" element={<PlaceholderPage title="Arrange Competitions" />} />
          <Route path="/kits" element={<PlaceholderPage title="Edit Kits" />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
