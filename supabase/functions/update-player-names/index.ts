import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NameMapping {
  playerid: number;
  firstname?: string;
  surname?: string;
  commonname?: string;
  fullname?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { nameMappings } = await req.json() as { nameMappings: NameMapping[] };

    if (!nameMappings || nameMappings.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No name mappings provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Updating ${nameMappings.length} player names...`);

    let updated = 0;
    let errors = 0;
    const batchSize = 50;

    // Process in batches
    for (let i = 0; i < nameMappings.length; i += batchSize) {
      const batch = nameMappings.slice(i, i + batchSize);
      
      for (const mapping of batch) {
        if (!mapping.playerid || !mapping.fullname) continue;

        const { error } = await supabase
          .from("players")
          .update({ name: mapping.fullname })
          .eq("id", mapping.playerid);

        if (error) {
          console.error(`Error updating player ${mapping.playerid}:`, error);
          errors++;
        } else {
          updated++;
        }
      }
    }

    console.log(`Update complete: ${updated} updated, ${errors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Updated ${updated} player names`,
        updated,
        errors,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
