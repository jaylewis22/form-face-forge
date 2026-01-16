import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Team {
  id: number;
  name: string;
  short_name: string | null;
  country_code: string | null;
  league_id: number | null;
  overall_rating: number | null;
  stadium: string | null;
  budget: number | null;
  league_name?: string | null;
  player_count?: number;
}

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data: teams, error } = await supabase
        .from("teams")
        .select("*")
        .order("name");

      if (error) throw error;

      // Get league names
      const { data: leagues } = await supabase.from("leagues").select("id, name");
      const leagueMap = new Map(leagues?.map((l) => [l.id, l.name]) || []);

      // Get player counts per team
      const { data: playerCounts } = await supabase
        .from("players")
        .select("team_id");

      const countMap = new Map<number, number>();
      playerCounts?.forEach((p) => {
        if (p.team_id) {
          countMap.set(p.team_id, (countMap.get(p.team_id) || 0) + 1);
        }
      });

      return teams.map((team) => ({
        ...team,
        league_name: team.league_id ? leagueMap.get(team.league_id) : null,
        player_count: countMap.get(team.id) || 0,
      })) as Team[];
    },
  });
}

export function useTeam(teamId: number | null) {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      if (!teamId) return null;

      const { data: team, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamId)
        .single();

      if (error) throw error;

      // Get league name
      let league_name = null;
      if (team.league_id) {
        const { data: league } = await supabase
          .from("leagues")
          .select("name")
          .eq("id", team.league_id)
          .single();
        league_name = league?.name || null;
      }

      // Get player count
      const { count } = await supabase
        .from("players")
        .select("*", { count: "exact", head: true })
        .eq("team_id", teamId);

      return {
        ...team,
        league_name,
        player_count: count || 0,
      } as Team;
    },
    enabled: !!teamId,
  });
}

export function useTeamPlayers(teamId: number | null) {
  return useQuery({
    queryKey: ["team-players", teamId],
    queryFn: async () => {
      if (!teamId) return [];

      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("team_id", teamId)
        .order("jersey_number");

      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });
}
