import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlayerImport {
  id?: number;
  name: string;
  short_name?: string;
  position?: string;
  secondary_position?: string;
  nationality?: string;
  nationality_code?: string;
  age?: number;
  height?: number;
  weight?: number;
  overall_rating?: number;
  potential_rating?: number;
  jersey_number?: number;
  preferred_foot?: string;
  weak_foot?: number;
  skill_moves?: number;
  team_id?: number;
  wage?: number;
  // Attributes
  pace?: number;
  acceleration?: number;
  sprint_speed?: number;
  shooting?: number;
  positioning?: number;
  finishing?: number;
  shot_power?: number;
  long_shots?: number;
  volleys?: number;
  penalties?: number;
  passing?: number;
  vision?: number;
  crossing?: number;
  free_kick_accuracy?: number;
  short_passing?: number;
  long_passing?: number;
  curve?: number;
  dribbling?: number;
  agility?: number;
  balance?: number;
  reactions?: number;
  ball_control?: number;
  composure?: number;
  defending?: number;
  interceptions?: number;
  heading_accuracy?: number;
  def_awareness?: number;
  standing_tackle?: number;
  sliding_tackle?: number;
  physical?: number;
  jumping?: number;
  stamina?: number;
  strength?: number;
  aggression?: number;
  gk_diving?: number;
  gk_handling?: number;
  gk_kicking?: number;
  gk_positioning?: number;
  gk_reflexes?: number;
}

interface TeamImport {
  id?: number;
  name: string;
  short_name?: string;
  country_code?: string;
  league_id?: number;
  overall_rating?: number;
  stadium?: string;
  budget?: number;
}

interface LeagueImport {
  id?: number;
  name: string;
  short_name?: string;
  country_code?: string;
  level?: number;
}

interface CompetitionImport {
  id?: number;
  name: string;
  short_name?: string;
  competition_type?: string;
  country_code?: string;
}

interface KitImport {
  id?: number;
  team_id: number;
  kit_type: string;
  primary_color?: string;
  secondary_color?: string;
  third_color?: string;
  pattern?: string;
}

interface ImportData {
  players?: PlayerImport[];
  teams?: TeamImport[];
  leagues?: LeagueImport[];
  competitions?: CompetitionImport[];
  kits?: KitImport[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, importType } = await req.json() as { data: ImportData; importType: string };

    console.log("Import started with type:", importType);
    console.log("Data counts:", {
      players: data.players?.length || 0,
      teams: data.teams?.length || 0,
      leagues: data.leagues?.length || 0,
      competitions: data.competitions?.length || 0,
      kits: data.kits?.length || 0,
    });

    const results = {
      leagues: { inserted: 0, updated: 0, errors: 0 },
      teams: { inserted: 0, updated: 0, errors: 0 },
      players: { inserted: 0, updated: 0, errors: 0 },
      competitions: { inserted: 0, updated: 0, errors: 0 },
      kits: { inserted: 0, updated: 0, errors: 0 },
    };

    // If replace mode, clear existing data first
    if (importType === "replace") {
      console.log("Replace mode: clearing existing data...");
      await supabase.from("kits").delete().neq("id", 0);
      await supabase.from("players").delete().neq("id", 0);
      await supabase.from("teams").delete().neq("id", 0);
      await supabase.from("competitions").delete().neq("id", 0);
      await supabase.from("leagues").delete().neq("id", 0);
    }

    // Import leagues first (due to foreign key dependencies)
    if (data.leagues && data.leagues.length > 0) {
      console.log(`Importing ${data.leagues.length} leagues...`);
      for (const league of data.leagues) {
        const { error } = await supabase.from("leagues").upsert(league, { onConflict: "id" });
        if (error) {
          console.error("League import error:", error);
          results.leagues.errors++;
        } else {
          results.leagues.inserted++;
        }
      }
    }

    // Import competitions
    if (data.competitions && data.competitions.length > 0) {
      console.log(`Importing ${data.competitions.length} competitions...`);
      for (const competition of data.competitions) {
        const { error } = await supabase.from("competitions").upsert(competition, { onConflict: "id" });
        if (error) {
          console.error("Competition import error:", error);
          results.competitions.errors++;
        } else {
          results.competitions.inserted++;
        }
      }
    }

    // Import teams (depends on leagues)
    if (data.teams && data.teams.length > 0) {
      console.log(`Importing ${data.teams.length} teams...`);
      for (const team of data.teams) {
        const { error } = await supabase.from("teams").upsert(team, { onConflict: "id" });
        if (error) {
          console.error("Team import error:", error);
          results.teams.errors++;
        } else {
          results.teams.inserted++;
        }
      }
    }

    // Import players (depends on teams)
    if (data.players && data.players.length > 0) {
      console.log(`Importing ${data.players.length} players...`);
      // Batch insert for better performance
      const batchSize = 100;
      for (let i = 0; i < data.players.length; i += batchSize) {
        const batch = data.players.slice(i, i + batchSize);
        const { error } = await supabase.from("players").upsert(batch, { onConflict: "id" });
        if (error) {
          console.error("Player batch import error:", error);
          results.players.errors += batch.length;
        } else {
          results.players.inserted += batch.length;
        }
      }
    }

    // Import kits (depends on teams)
    if (data.kits && data.kits.length > 0) {
      console.log(`Importing ${data.kits.length} kits...`);
      for (const kit of data.kits) {
        const { error } = await supabase.from("kits").upsert(kit, { onConflict: "id" });
        if (error) {
          console.error("Kit import error:", error);
          results.kits.errors++;
        } else {
          results.kits.inserted++;
        }
      }
    }

    console.log("Import completed:", results);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Import completed successfully",
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Import error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
