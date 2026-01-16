import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface League {
  id: number;
  name: string;
  short_name: string | null;
  country_code: string | null;
  level: number | null;
}

export function useLeagues() {
  return useQuery({
    queryKey: ["leagues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leagues")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as League[];
    },
  });
}

export function useLeague(leagueId: number | null) {
  return useQuery({
    queryKey: ["league", leagueId],
    queryFn: async () => {
      if (!leagueId) return null;

      const { data, error } = await supabase
        .from("leagues")
        .select("*")
        .eq("id", leagueId)
        .single();

      if (error) throw error;
      return data as League;
    },
    enabled: !!leagueId,
  });
}
