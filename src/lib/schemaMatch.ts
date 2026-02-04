/**
 * EA Sports FC Schema Matching
 * Matches imported table headers against the 223 known EA FC table schemas
 */

import schemaIndex from "@/data/schemaIndex.json";

export interface TableSchema {
  file: string;
  fields: string[];
  fieldCount: number;
  rowCount: number;
}

export interface SchemaMatch {
  tableName: string;
  schema: TableSchema;
  score: number;
  matchedFields: string[];
  unmatchedFields: string[];
  confidence: "high" | "medium" | "low";
}

interface SchemaIndex {
  generatedAt: string;
  source: Record<string, string>;
  tables: Record<string, TableSchema>;
}

const SCHEMA_INDEX = schemaIndex as unknown as SchemaIndex;

/**
 * Normalize field name for comparison
 */
function normalizeFieldName(field: string): string {
  return field
    .toLowerCase()
    .replace(/[-_\s]/g, "")
    .replace(/rating$/, "")
    .replace(/^gk_/, "gk")
    .replace(/^def_/, "def");
}

/**
 * Calculate Jaccard similarity between two sets of field names
 */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Find matched and unmatched fields between input headers and schema
 */
function findFieldMatches(
  inputHeaders: string[],
  schemaFields: string[]
): { matched: string[]; unmatched: string[] } {
  const normalizedSchema = new Map(
    schemaFields.map(f => [normalizeFieldName(f), f])
  );
  
  const matched: string[] = [];
  const unmatched: string[] = [];
  
  for (const header of inputHeaders) {
    const normalized = normalizeFieldName(header);
    if (normalizedSchema.has(normalized)) {
      matched.push(header);
    } else {
      unmatched.push(header);
    }
  }
  
  return { matched, unmatched };
}

/**
 * Match input headers against all known EA FC table schemas
 */
export function matchSchemaByHeaders(
  headers: string[],
  roleHint?: "players" | "teams" | "leagues" | "career" | "competitions"
): SchemaMatch[] {
  const normalizedInput = new Set(headers.map(normalizeFieldName));
  const matches: SchemaMatch[] = [];
  
  for (const [tableName, schema] of Object.entries(SCHEMA_INDEX.tables)) {
    // Filter by role hint if provided
    if (roleHint) {
      const lowerName = tableName.toLowerCase();
      if (roleHint === "players" && !lowerName.includes("player")) continue;
      if (roleHint === "teams" && !lowerName.includes("team") && !lowerName.includes("club")) continue;
      if (roleHint === "leagues" && !lowerName.includes("league") && !lowerName.includes("competition")) continue;
      if (roleHint === "career" && !lowerName.includes("career")) continue;
    }
    
    const normalizedSchema = new Set(schema.fields.map(normalizeFieldName));
    const score = jaccardSimilarity(normalizedInput, normalizedSchema);
    
    if (score > 0.1) { // Only include if at least 10% match
      const { matched, unmatched } = findFieldMatches(headers, schema.fields);
      
      let confidence: "high" | "medium" | "low";
      if (score >= 0.8) {
        confidence = "high";
      } else if (score >= 0.5) {
        confidence = "medium";
      } else {
        confidence = "low";
      }
      
      matches.push({
        tableName,
        schema,
        score,
        matchedFields: matched,
        unmatchedFields: unmatched,
        confidence,
      });
    }
  }
  
  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Get schema for a specific table
 */
export function getTableSchema(tableName: string): TableSchema | null {
  return SCHEMA_INDEX.tables[tableName] || null;
}

/**
 * Get all table names
 */
export function getAllTableNames(): string[] {
  return Object.keys(SCHEMA_INDEX.tables);
}

/**
 * Get tables by category prefix
 */
export function getTablesByCategory(category: string): string[] {
  return getAllTableNames().filter(name => 
    name.toLowerCase().startsWith(category.toLowerCase())
  );
}

/**
 * Get the main players table schema
 */
export function getPlayersSchema(): TableSchema | null {
  return getTableSchema("players");
}

/**
 * Get the main teams table schema
 */
export function getTeamsSchema(): TableSchema | null {
  return getTableSchema("teams");
}

/**
 * Detect entity type from headers
 */
export function detectEntityType(
  headers: string[]
): "players" | "teams" | "leagues" | "competitions" | "unknown" {
  const normalizedHeaders = headers.map(h => h.toLowerCase());
  
  // Player indicators
  const playerIndicators = [
    "overallrating", "overall", "potential", "pace", "shooting", 
    "passing", "dribbling", "defending", "physical", "position",
    "nationality", "age", "height", "weight", "preferredfoot"
  ];
  
  // Team indicators
  const teamIndicators = [
    "leagueid", "league_id", "stadium", "budget", "transferbudget",
    "teamid", "clubid", "teamname"
  ];
  
  // League/Competition indicators
  const leagueIndicators = [
    "level", "tier", "division", "competitiontype"
  ];
  
  const playerScore = playerIndicators.filter(i => 
    normalizedHeaders.some(h => h.includes(i))
  ).length;
  
  const teamScore = teamIndicators.filter(i => 
    normalizedHeaders.some(h => h.includes(i))
  ).length;
  
  const leagueScore = leagueIndicators.filter(i => 
    normalizedHeaders.some(h => h.includes(i))
  ).length;
  
  if (playerScore >= 3) return "players";
  if (teamScore >= 2) return "teams";
  if (leagueScore >= 1) return "leagues";
  
  return "unknown";
}

/**
 * Map field names from FET format to database format
 */
export const FIELD_MAPPINGS: Record<string, string> = {
  // Player ID
  playerid: "id",
  
  // Names
  firstname: "name",
  playername: "name",
  commonname: "short_name",
  
  // Ratings
  overallrating: "overall_rating",
  overall: "overall_rating",
  potential: "potential_rating",
  
  // Position
  preferredposition1: "position",
  preferredposition2: "secondary_position",
  
  // Physical
  sprintspeed: "sprint_speed",
  shotpower: "shot_power",
  longshots: "long_shots",
  shortpassing: "short_passing",
  longpassing: "long_passing",
  freekickaccuracy: "free_kick_accuracy",
  ballcontrol: "ball_control",
  headingaccuracy: "heading_accuracy",
  standingtackle: "standing_tackle",
  slidingtackle: "sliding_tackle",
  defawareness: "def_awareness",
  
  // GK
  gkdiving: "gk_diving",
  gkhandling: "gk_handling",
  gkkicking: "gk_kicking",
  gkpositioning: "gk_positioning",
  gkreflexes: "gk_reflexes",
  
  // Info
  preferredfoot: "preferred_foot",
  skillmoves: "skill_moves",
  weakfootabilitytypecode: "weak_foot",
  jerseynumber: "jersey_number",
  
  // Team
  teamid: "team_id",
  clubid: "team_id",
  leagueid: "league_id",
};

/**
 * Normalize a record from FET format to database format
 */
export function normalizeRecord<T extends Record<string, unknown>>(
  record: Record<string, unknown>
): T {
  const normalized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = key.toLowerCase().replace(/[-_\s]/g, "");
    const mappedKey = FIELD_MAPPINGS[normalizedKey] || key.toLowerCase();
    
    // Convert numeric strings
    if (typeof value === "string" && !isNaN(Number(value)) && value.trim() !== "") {
      normalized[mappedKey] = Number(value);
    } else {
      normalized[mappedKey] = value;
    }
  }
  
  return normalized as T;
}
