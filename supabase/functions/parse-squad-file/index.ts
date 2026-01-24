import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/* ---------------------------
   Data Interfaces
----------------------------*/

interface ParsedPlayer {
  id?: number;
  name: string;
  short_name?: string;
  overall_rating?: number;
  potential_rating?: number;
  position?: string;
  secondary_position?: string;
  age?: number;
  team_id?: number;
  nationality?: string;
  nationality_code?: string;
  height?: number;
  weight?: number;
  jersey_number?: number;
  preferred_foot?: string;
  weak_foot?: number;
  skill_moves?: number;
  wage?: number;
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

interface ParsedTeam {
  id?: number;
  name: string;
  short_name?: string;
  overall_rating?: number;
  league_id?: number;
  country_code?: string;
  stadium?: string;
  budget?: number;
}

interface ParsedLeague {
  id?: number;
  name: string;
  short_name?: string;
  country_code?: string;
  level?: number;
}

interface ParsedCompetition {
  id?: number;
  name: string;
  short_name?: string;
  competition_type?: string;
  country_code?: string;
}

interface ParseResult {
  players: ParsedPlayer[];
  teams: ParsedTeam[];
  leagues: ParsedLeague[];
  competitions: ParsedCompetition[];
  format: string;
  hint?: string;
}

/* ---------------------------
   FET JSON Field Mappings
----------------------------*/

// Common FET field name variations
const PLAYER_FIELD_MAP: Record<string, keyof ParsedPlayer> = {
  // ID fields
  playerid: "id",
  player_id: "id",
  id: "id",
  
  // Name fields
  name: "name",
  playername: "name",
  player_name: "name",
  firstname: "name",
  fullname: "name",
  short_name: "short_name",
  shortname: "short_name",
  knownas: "short_name",
  
  // Position
  position: "position",
  preferredposition: "position",
  preferred_position: "position",
  pos: "position",
  secondaryposition: "secondary_position",
  secondary_position: "secondary_position",
  altposition: "secondary_position",
  
  // Basic info
  age: "age",
  height: "height",
  weight: "weight",
  nationality: "nationality",
  nation: "nationality",
  country: "nationality",
  nationalitycode: "nationality_code",
  nationality_code: "nationality_code",
  nationcode: "nationality_code",
  
  // Ratings
  overall: "overall_rating",
  overallrating: "overall_rating",
  overall_rating: "overall_rating",
  ovr: "overall_rating",
  rating: "overall_rating",
  potential: "potential_rating",
  potentialrating: "potential_rating",
  potential_rating: "potential_rating",
  pot: "potential_rating",
  
  // Team
  teamid: "team_id",
  team_id: "team_id",
  clubid: "team_id",
  club_id: "team_id",
  
  // Player info
  jerseynumber: "jersey_number",
  jersey_number: "jersey_number",
  kitnum: "jersey_number",
  shirtnumber: "jersey_number",
  preferredfoot: "preferred_foot",
  preferred_foot: "preferred_foot",
  foot: "preferred_foot",
  weakfoot: "weak_foot",
  weak_foot: "weak_foot",
  skillmoves: "skill_moves",
  skill_moves: "skill_moves",
  wage: "wage",
  
  // Pace
  pace: "pace",
  spd: "pace",
  acceleration: "acceleration",
  acc: "acceleration",
  sprintspeed: "sprint_speed",
  sprint_speed: "sprint_speed",
  
  // Shooting
  shooting: "shooting",
  sho: "shooting",
  positioning: "positioning",
  finishing: "finishing",
  fin: "finishing",
  shotpower: "shot_power",
  shot_power: "shot_power",
  longshots: "long_shots",
  long_shots: "long_shots",
  volleys: "volleys",
  penalties: "penalties",
  pens: "penalties",
  
  // Passing
  passing: "passing",
  pas: "passing",
  vision: "vision",
  crossing: "crossing",
  freekickaccuracy: "free_kick_accuracy",
  free_kick_accuracy: "free_kick_accuracy",
  fka: "free_kick_accuracy",
  shortpassing: "short_passing",
  short_passing: "short_passing",
  longpassing: "long_passing",
  long_passing: "long_passing",
  curve: "curve",
  
  // Dribbling
  dribbling: "dribbling",
  dri: "dribbling",
  agility: "agility",
  balance: "balance",
  reactions: "reactions",
  ballcontrol: "ball_control",
  ball_control: "ball_control",
  composure: "composure",
  
  // Defending
  defending: "defending",
  def: "defending",
  interceptions: "interceptions",
  headingaccuracy: "heading_accuracy",
  heading_accuracy: "heading_accuracy",
  heading: "heading_accuracy",
  defawareness: "def_awareness",
  def_awareness: "def_awareness",
  marking: "def_awareness",
  standingtackle: "standing_tackle",
  standing_tackle: "standing_tackle",
  slidingtackle: "sliding_tackle",
  sliding_tackle: "sliding_tackle",
  
  // Physical
  physical: "physical",
  phy: "physical",
  jumping: "jumping",
  stamina: "stamina",
  strength: "strength",
  aggression: "aggression",
  
  // GK
  gkdiving: "gk_diving",
  gk_diving: "gk_diving",
  diving: "gk_diving",
  gkhandling: "gk_handling",
  gk_handling: "gk_handling",
  handling: "gk_handling",
  gkkicking: "gk_kicking",
  gk_kicking: "gk_kicking",
  kicking: "gk_kicking",
  gkpositioning: "gk_positioning",
  gk_positioning: "gk_positioning",
  gkreflexes: "gk_reflexes",
  gk_reflexes: "gk_reflexes",
  reflexes: "gk_reflexes",
};

const TEAM_FIELD_MAP: Record<string, keyof ParsedTeam> = {
  teamid: "id",
  team_id: "id",
  id: "id",
  clubid: "id",
  
  name: "name",
  teamname: "name",
  team_name: "name",
  clubname: "name",
  club_name: "name",
  
  shortname: "short_name",
  short_name: "short_name",
  abbr: "short_name",
  abbreviation: "short_name",
  
  leagueid: "league_id",
  league_id: "league_id",
  competitionid: "league_id",
  
  overallrating: "overall_rating",
  overall_rating: "overall_rating",
  overall: "overall_rating",
  rating: "overall_rating",
  
  countrycode: "country_code",
  country_code: "country_code",
  country: "country_code",
  nation: "country_code",
  
  stadium: "stadium",
  stadiumname: "stadium",
  venue: "stadium",
  
  budget: "budget",
  transferbudget: "budget",
  transfer_budget: "budget",
};

const LEAGUE_FIELD_MAP: Record<string, keyof ParsedLeague> = {
  leagueid: "id",
  league_id: "id",
  id: "id",
  competitionid: "id",
  
  name: "name",
  leaguename: "name",
  league_name: "name",
  competitionname: "name",
  
  shortname: "short_name",
  short_name: "short_name",
  abbr: "short_name",
  
  countrycode: "country_code",
  country_code: "country_code",
  country: "country_code",
  nation: "country_code",
  
  level: "level",
  tier: "level",
  division: "level",
};

/* ---------------------------
   Helpers
----------------------------*/

function bytesToHex(bytes: Uint8Array, maxBytes = 32): string {
  return Array.from(bytes.slice(0, maxBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

function asciiPreview(bytes: Uint8Array, maxBytes = 64): string {
  const slice = bytes.slice(0, maxBytes);
  let out = "";
  for (const b of slice) out += b >= 32 && b <= 126 ? String.fromCharCode(b) : ".";
  return out;
}

function startsWithAscii(bytes: Uint8Array, ascii: string): boolean {
  const enc = new TextEncoder().encode(ascii);
  if (bytes.length < enc.length) return false;
  for (let i = 0; i < enc.length; i++) if (bytes[i] !== enc[i]) return false;
  return true;
}

function looksLikeJson(bytes: Uint8Array, maxScan = 256): boolean {
  const limit = Math.min(bytes.length, maxScan);
  let i = 0;
  while (
    i < limit &&
    (bytes[i] === 0x20 || bytes[i] === 0x0a || bytes[i] === 0x0d || bytes[i] === 0x09)
  ) i++;
  return i < limit && (bytes[i] === 0x7b || bytes[i] === 0x5b);
}

/* ---------------------------
   FET JSON Parser
----------------------------*/

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[-_\s]/g, "");
}

function mapFields<T>(obj: Record<string, unknown>, fieldMap: Record<string, keyof T>): Partial<T> {
  const result: Partial<T> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const normalizedKey = normalizeKey(key);
    const mappedField = fieldMap[normalizedKey] || fieldMap[key.toLowerCase()];
    
    if (mappedField && value !== null && value !== undefined) {
      // Type coercion for numeric fields
      if (typeof value === "string" && !isNaN(Number(value))) {
        (result as Record<string, unknown>)[mappedField as string] = Number(value);
      } else {
        (result as Record<string, unknown>)[mappedField as string] = value;
      }
    }
  }
  
  return result;
}

function parsePlayer(obj: Record<string, unknown>): ParsedPlayer | null {
  const mapped = mapFields<ParsedPlayer>(obj, PLAYER_FIELD_MAP);
  
  // Require at least a name
  if (!mapped.name && !obj.name && !obj.playername && !obj.player_name) {
    // Try to find any name-like field
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().includes("name") && typeof value === "string" && value.trim()) {
        mapped.name = value.trim();
        break;
      }
    }
  }
  
  if (!mapped.name) return null;
  
  return mapped as ParsedPlayer;
}

function parseTeam(obj: Record<string, unknown>): ParsedTeam | null {
  const mapped = mapFields<ParsedTeam>(obj, TEAM_FIELD_MAP);
  
  if (!mapped.name) {
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().includes("name") && typeof value === "string" && value.trim()) {
        mapped.name = value.trim();
        break;
      }
    }
  }
  
  if (!mapped.name) return null;
  
  return mapped as ParsedTeam;
}

function parseLeague(obj: Record<string, unknown>): ParsedLeague | null {
  const mapped = mapFields<ParsedLeague>(obj, LEAGUE_FIELD_MAP);
  
  if (!mapped.name) {
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().includes("name") && typeof value === "string" && value.trim()) {
        mapped.name = value.trim();
        break;
      }
    }
  }
  
  if (!mapped.name) return null;
  
  return mapped as ParsedLeague;
}

function detectArrayType(arr: unknown[]): "players" | "teams" | "leagues" | "unknown" {
  if (arr.length === 0) return "unknown";
  
  const sample = arr[0] as Record<string, unknown>;
  const keys = Object.keys(sample).map(k => k.toLowerCase());
  
  // Player indicators
  const playerIndicators = ["overall", "overallrating", "pace", "shooting", "passing", "dribbling", "defending", "physical", "position", "potential", "potentialrating", "age", "nationality"];
  const teamIndicators = ["leagueid", "league_id", "stadium", "budget", "transferbudget"];
  const leagueIndicators = ["level", "tier", "division", "countrycode", "country_code"];
  
  const playerScore = playerIndicators.filter(i => keys.some(k => k.includes(i))).length;
  const teamScore = teamIndicators.filter(i => keys.some(k => k.includes(i))).length;
  const leagueScore = leagueIndicators.filter(i => keys.some(k => k.includes(i))).length;
  
  // If has rating attributes, likely players
  if (playerScore >= 3) return "players";
  if (teamScore >= 1 && playerScore < 2) return "teams";
  if (leagueScore >= 1 && playerScore < 2) return "leagues";
  
  // Check for explicit type hints in keys
  if (keys.some(k => k.includes("player"))) return "players";
  if (keys.some(k => k.includes("team") || k.includes("club"))) return "teams";
  if (keys.some(k => k.includes("league") || k.includes("competition"))) return "leagues";
  
  return "unknown";
}

function parseFETJson(json: unknown): ParseResult {
  const result: ParseResult = {
    players: [],
    teams: [],
    leagues: [],
    competitions: [],
    format: "fet_json",
  };
  
  // Handle array at root level
  if (Array.isArray(json)) {
    const arrayType = detectArrayType(json);
    console.log(`Root array detected, type: ${arrayType}, count: ${json.length}`);
    
    if (arrayType === "players") {
      for (const item of json) {
        const player = parsePlayer(item as Record<string, unknown>);
        if (player) result.players.push(player);
      }
    } else if (arrayType === "teams") {
      for (const item of json) {
        const team = parseTeam(item as Record<string, unknown>);
        if (team) result.teams.push(team);
      }
    } else if (arrayType === "leagues") {
      for (const item of json) {
        const league = parseLeague(item as Record<string, unknown>);
        if (league) result.leagues.push(league);
      }
    } else {
      // Try all parsers
      for (const item of json) {
        const obj = item as Record<string, unknown>;
        const player = parsePlayer(obj);
        if (player && player.overall_rating) {
          result.players.push(player);
        } else {
          const team = parseTeam(obj);
          if (team) result.teams.push(team);
        }
      }
    }
    
    return result;
  }
  
  // Handle object at root level
  if (typeof json === "object" && json !== null) {
    const obj = json as Record<string, unknown>;
    
    // Look for known keys
    const keysLower = Object.keys(obj).map(k => ({ original: k, lower: k.toLowerCase() }));
    
    for (const { original, lower } of keysLower) {
      const value = obj[original];
      
      if (!Array.isArray(value)) continue;
      
      // Players
      if (lower.includes("player")) {
        console.log(`Found players array: ${original}, count: ${value.length}`);
        for (const item of value) {
          const player = parsePlayer(item as Record<string, unknown>);
          if (player) result.players.push(player);
        }
      }
      // Teams
      else if (lower.includes("team") || lower.includes("club")) {
        console.log(`Found teams array: ${original}, count: ${value.length}`);
        for (const item of value) {
          const team = parseTeam(item as Record<string, unknown>);
          if (team) result.teams.push(team);
        }
      }
      // Leagues
      else if (lower.includes("league") || lower.includes("competition")) {
        console.log(`Found leagues array: ${original}, count: ${value.length}`);
        for (const item of value) {
          const league = parseLeague(item as Record<string, unknown>);
          if (league) result.leagues.push(league);
        }
      }
      // Generic arrays - try to detect type
      else if (value.length > 0) {
        const arrayType = detectArrayType(value);
        console.log(`Found generic array: ${original}, detected type: ${arrayType}, count: ${value.length}`);
        
        if (arrayType === "players") {
          for (const item of value) {
            const player = parsePlayer(item as Record<string, unknown>);
            if (player) result.players.push(player);
          }
        } else if (arrayType === "teams") {
          for (const item of value) {
            const team = parseTeam(item as Record<string, unknown>);
            if (team) result.teams.push(team);
          }
        } else if (arrayType === "leagues") {
          for (const item of value) {
            const league = parseLeague(item as Record<string, unknown>);
            if (league) result.leagues.push(league);
          }
        }
      }
    }
  }
  
  return result;
}

/* ---------------------------
   Handler
----------------------------*/

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileData, fileName, importType } = await req.json();

    if (!fileData) {
      return new Response(JSON.stringify({ success: false, error: "No file data provided" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log(`Processing file: ${fileName}, import type: ${importType}`);

    // Decode base64 → bytes
    const binaryString = atob(fileData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

    console.log(`Decoded ${bytes.length} bytes from base64`);

    const header = bytes.slice(0, Math.min(bytes.length, 256));
    const headerHex = bytesToHex(header, 16);

    // FBCHUNKS detection - return early with guidance
    if (startsWithAscii(header, "FBCHUNKS")) {
      console.log("Detected FBCHUNKS format");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Frostbite engine squad file detected (FBCHUNKS format)",
          hint: "FBCHUNKS files (Frostbite engine format) contain compressed binary data that requires FIFA Editor Tool (FET) to properly decode. Please export your squad file to JSON format using FET for accurate data import.",
          format: "fbchunks",
          fileInfo: {
            size: bytes.length,
            sizeFormatted: `${(bytes.length / 1024 / 1024).toFixed(2)} MB`,
            header: headerHex,
          },
          recommendation: "Please use FIFA Editor Tool (FET) to open this squad file and export to JSON format. FET can properly decode the Frostbite engine data structures and provide accurate player, team, and league information.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // JSON detection and parsing
    if (looksLikeJson(header)) {
      console.log("Detected JSON format, parsing...");
      
      const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      let json: unknown;
      
      try {
        json = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid JSON format",
            hint: "The file appears to be JSON but could not be parsed. Please check the file for syntax errors.",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }
      
      // Parse the FET JSON structure
      const parsed = parseFETJson(json);
      
      console.log(`Parsed: ${parsed.players.length} players, ${parsed.teams.length} teams, ${parsed.leagues.length} leagues`);
      
      // Check if we got any data
      if (parsed.players.length === 0 && parsed.teams.length === 0 && parsed.leagues.length === 0) {
        // Return the raw JSON for the import-database to handle
        return new Response(
          JSON.stringify({
            success: true,
            format: "json",
            data: json,
            parsed: {
              players: 0,
              teams: 0,
              leagues: 0,
            },
            hint: "No recognizable player/team/league data found. The raw JSON data will be passed to the importer.",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          format: "fet_json",
          data: {
            players: parsed.players,
            teams: parsed.teams,
            leagues: parsed.leagues,
            competitions: parsed.competitions,
          },
          parsed: {
            players: parsed.players.length,
            teams: parsed.teams.length,
            leagues: parsed.leagues.length,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    // Unknown binary format
    console.log("Unknown binary format detected");
    return new Response(
      JSON.stringify({
        success: false,
        error: "Unsupported file format",
        hint: "This file does not appear to be a JSON export. FIFA/FC squad files often use proprietary Frostbite binary formats.",
        fileInfo: {
          size: bytes.length,
          sizeFormatted: `${(bytes.length / 1024 / 1024).toFixed(2)} MB`,
          header: headerHex,
        },
        recommendation: "Please use FIFA Editor Tool (FET) to open this squad file and export to JSON format.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 415,
      },
    );
  } catch (error) {
    console.error("Error processing squad file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
