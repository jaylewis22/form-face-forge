import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Competition {
  id: number;
  name: string;
  short_name: string | null;
  country_code: string | null;
  competition_type: string | null;
}

export function useCompetitions() {
  return useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Competition[];
    },
  });
}

export function useCompetition(competitionId: number | null) {
  return useQuery({
    queryKey: ["competition", competitionId],
    queryFn: async () => {
      if (!competitionId) return null;

      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .eq("id", competitionId)
        .single();

      if (error) throw error;
      return data as Competition;
    },
    enabled: !!competitionId,
  });
}
