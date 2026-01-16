import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Player {
  id: number;
  name: string;
  short_name: string | null;
  position: string | null;
  secondary_position: string | null;
  nationality: string | null;
  nationality_code: string | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  overall_rating: number | null;
  potential_rating: number | null;
  jersey_number: number | null;
  preferred_foot: string | null;
  weak_foot: number | null;
  skill_moves: number | null;
  team_id: number | null;
  wage: number | null;
  team_name?: string | null;
  // Attributes
  pace: number | null;
  shooting: number | null;
  passing: number | null;
  dribbling: number | null;
  defending: number | null;
  physical: number | null;
}

export function usePlayers(limit?: number) {
  return useQuery({
    queryKey: ["players", limit],
    queryFn: async () => {
      let query = supabase.from("players").select("*").order("overall_rating", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get team names
      const { data: teams } = await supabase.from("teams").select("id, name");
      const teamMap = new Map(teams?.map((t) => [t.id, t.name]) || []);

      return data.map((player) => ({
        ...player,
        team_name: player.team_id ? teamMap.get(player.team_id) : null,
      })) as Player[];
    },
  });
}

export function usePlayer(playerId: number | null) {
  return useQuery({
    queryKey: ["player", playerId],
    queryFn: async () => {
      if (!playerId) return null;

      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", playerId)
        .single();

      if (error) throw error;

      let team_name = null;
      if (data.team_id) {
        const { data: team } = await supabase
          .from("teams")
          .select("name")
          .eq("id", data.team_id)
          .single();
        team_name = team?.name || null;
      }

      return { ...data, team_name } as Player;
    },
    enabled: !!playerId,
  });
}
