import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ParsedPlayer {
  id: number;
  name: string;
  short_name?: string;
  overall_rating?: number;
  potential_rating?: number;
  position?: string;
  secondary_position?: string;
  nationality?: string;
  nationality_code?: string;
  age?: number;
  height?: number;
  weight?: number;
  preferred_foot?: string;
  weak_foot?: number;
  skill_moves?: number;
  jersey_number?: number;
  team_id?: number;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physical?: number;
}

interface ParsedTeam {
  id: number;
  name: string;
  short_name?: string;
  overall_rating?: number;
  league_id?: number;
  country_code?: string;
}

interface ParsedLeague {
  id: number;
  name: string;
  short_name?: string;
  country_code?: string;
  level?: number;
}

interface ParsedCompetition {
  id: number;
  name: string;
  short_name?: string;
  country_code?: string;
  competition_type?: string;
}

interface ParseResult {
  players: ParsedPlayer[];
  teams: ParsedTeam[];
  leagues: ParsedLeague[];
  competitions: ParsedCompetition[];
}

// Helper functions for reading binary data
function decodeString(bytes: Uint8Array, offset: number, maxLength: number): string {
  let end = offset;
  while (end < offset + maxLength && end < bytes.length && bytes[end] !== 0) {
    end++;
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(offset, end));
}

function decodeUTF16String(bytes: Uint8Array, offset: number, maxLength: number): string {
  const chars: number[] = [];
  for (let i = 0; i < maxLength && offset + i * 2 + 1 < bytes.length; i++) {
    const charCode = bytes[offset + i * 2] | (bytes[offset + i * 2 + 1] << 8);
    if (charCode === 0) break;
    chars.push(charCode);
  }
  return String.fromCharCode(...chars);
}

function readUint32LE(bytes: Uint8Array, offset: number): number {
  if (offset + 3 >= bytes.length) return 0;
  return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
}

function readUint16LE(bytes: Uint8Array, offset: number): number {
  if (offset + 1 >= bytes.length) return 0;
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function readInt32LE(bytes: Uint8Array, offset: number): number {
  if (offset + 3 >= bytes.length) return 0;
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
}

// Position code mappings from FIFA/FC
const positionCodes: Record<number, string> = {
  0: 'GK', 1: 'SW', 2: 'RWB', 3: 'RB', 4: 'RCB', 5: 'CB', 6: 'LCB', 7: 'LB', 8: 'LWB',
  9: 'RDM', 10: 'CDM', 11: 'LDM', 12: 'RM', 13: 'RCM', 14: 'CM', 15: 'LCM', 16: 'LM',
  17: 'RAM', 18: 'CAM', 19: 'LAM', 20: 'RF', 21: 'CF', 22: 'LF', 23: 'RW', 24: 'RS',
  25: 'ST', 26: 'LS', 27: 'LW'
};

// Nationality code mappings (subset of common ones)
const nationalityCodes: Record<number, { name: string; code: string }> = {
  1: { name: 'England', code: 'ENG' }, 2: { name: 'France', code: 'FRA' },
  3: { name: 'Germany', code: 'GER' }, 4: { name: 'Italy', code: 'ITA' },
  5: { name: 'Spain', code: 'ESP' }, 7: { name: 'Argentina', code: 'ARG' },
  8: { name: 'Brazil', code: 'BRA' }, 14: { name: 'Netherlands', code: 'NED' },
  18: { name: 'Portugal', code: 'POR' }, 21: { name: 'Belgium', code: 'BEL' },
  27: { name: 'Poland', code: 'POL' }, 45: { name: 'Croatia', code: 'CRO' },
  52: { name: 'USA', code: 'USA' }, 95: { name: 'Nigeria', code: 'NGA' },
};

function isValidName(str: string): boolean {
  if (!str || str.length < 2 || str.length > 60) return false;
  // Check if mostly printable characters
  const printable = str.split('').filter(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) < 127).length;
  return printable > str.length * 0.7;
}

function findStringsInRange(bytes: Uint8Array, start: number, end: number): string[] {
  const strings: string[] = [];
  let current = '';
  for (let i = start; i < Math.min(end, bytes.length); i++) {
    if (bytes[i] >= 32 && bytes[i] < 127) {
      current += String.fromCharCode(bytes[i]);
    } else if (current.length >= 3) {
      strings.push(current);
      current = '';
    } else {
      current = '';
    }
  }
  if (current.length >= 3) strings.push(current);
  return strings;
}

function parseSquadFile(data: Uint8Array): ParseResult {
  const players: ParsedPlayer[] = [];
  const teams: ParsedTeam[] = [];
  const leagues: ParsedLeague[] = [];
  const competitions: ParsedCompetition[] = [];
  const seenPlayerIds = new Set<number>();
  const seenTeamIds = new Set<number>();
  const seenLeagueIds = new Set<number>();
  
  console.log(`Parsing squad file, size: ${data.length} bytes`);
  
  // Log file header for debugging
  const headerHex = Array.from(data.slice(0, 32)).map(b => b.toString(16).padStart(2, '0')).join(' ');
  console.log(`File header (hex): ${headerHex}`);
  
  // Strategy 1: Look for DB (database) chunks - Frostbite format markers
  const dbMarkers = ['DB\x00\x00', 'players', 'teamplayerlinks', 'teams', 'leagues'];
  let foundMarkers: string[] = [];
  
  for (let i = 0; i < Math.min(data.length - 20, 1000000); i++) {
    const sample = decodeString(data, i, 20).toLowerCase();
    for (const marker of dbMarkers) {
      if (sample.includes(marker.toLowerCase())) {
        foundMarkers.push(`${marker} at offset ${i}`);
        console.log(`Found marker: ${marker} at offset ${i}`);
      }
    }
  }
  
  // Strategy 2: Scan for player-like records
  // FIFA player records typically have: ID (4 bytes), rating data, attribute blocks
  let offset = 0;
  const maxScan = Math.min(data.length - 200, 50000000);
  
  while (offset < maxScan) {
    // Pattern: Look for valid player ID followed by plausible ratings
    const potentialId = readUint32LE(data, offset);
    
    // Player IDs in FIFA are typically 1-500000
    if (potentialId > 0 && potentialId < 500000 && !seenPlayerIds.has(potentialId)) {
      // Check subsequent bytes for rating patterns
      // Overall rating is typically 1 byte, value 40-99
      let ratingOffset = -1;
      
      // Try multiple offsets for rating
      for (const testOffset of [4, 8, 12, 16]) {
        const testRating = data[offset + testOffset];
        const testPotential = data[offset + testOffset + 1];
        
        if (testRating >= 45 && testRating <= 99 && testPotential >= 45 && testPotential <= 99) {
          ratingOffset = testOffset;
          break;
        }
      }
      
      if (ratingOffset > 0) {
        const ovr = data[offset + ratingOffset];
        const pot = data[offset + ratingOffset + 1];
        
        // Look for name string in nearby bytes
        const nearbyStrings = findStringsInRange(data, offset + 20, offset + 200);
        const nameCandidates = nearbyStrings.filter(s => isValidName(s) && !s.match(/^[0-9]+$/));
        
        if (nameCandidates.length > 0) {
          // Extract more player data
          const player: ParsedPlayer = {
            id: potentialId,
            name: nameCandidates[0],
            overall_rating: ovr,
            potential_rating: pot,
          };
          
          // Try to extract position (usually encoded as single byte)
          for (const posOffset of [ratingOffset + 2, ratingOffset + 4, ratingOffset + 8]) {
            const posCode = data[offset + posOffset];
            if (posCode < 28 && positionCodes[posCode]) {
              player.position = positionCodes[posCode];
              break;
            }
          }
          
          // Try to extract age (usually 16-50 range)
          for (let ageOff = ratingOffset + 2; ageOff < ratingOffset + 20; ageOff++) {
            const age = data[offset + ageOff];
            if (age >= 16 && age <= 50) {
              player.age = age;
              break;
            }
          }
          
          // Extract attributes - look for 6 consecutive values in 20-99 range
          for (let attrOff = ratingOffset + 10; attrOff < ratingOffset + 100; attrOff++) {
            const attrs = [
              data[offset + attrOff],
              data[offset + attrOff + 1],
              data[offset + attrOff + 2],
              data[offset + attrOff + 3],
              data[offset + attrOff + 4],
              data[offset + attrOff + 5],
            ];
            
            if (attrs.every(a => a >= 20 && a <= 99)) {
              player.pace = attrs[0];
              player.shooting = attrs[1];
              player.passing = attrs[2];
              player.dribbling = attrs[3];
              player.defending = attrs[4];
              player.physical = attrs[5];
              break;
            }
          }
          
          // Look for team_id reference
          for (const tidOff of [ratingOffset + 40, ratingOffset + 44, ratingOffset + 48]) {
            const tid = readUint32LE(data, offset + tidOff);
            if (tid > 0 && tid < 200000) {
              player.team_id = tid;
              break;
            }
          }
          
          players.push(player);
          seenPlayerIds.add(potentialId);
          
          if (players.length <= 10) {
            console.log(`Found player: ID=${potentialId}, Name=${player.name}, OVR=${ovr}, POS=${player.position || 'N/A'}`);
          }
          
          offset += 100; // Skip ahead
          continue;
        }
      }
    }
    
    offset += 4;
    
    // Performance limit
    if (players.length >= 25000) break;
  }
  
  // Strategy 3: Look for team records
  // Teams typically have: ID, name, league_id, rating
  offset = 0;
  
  while (offset < maxScan) {
    const potentialTeamId = readUint32LE(data, offset);
    
    // Team IDs are typically 1-200000
    if (potentialTeamId > 0 && potentialTeamId < 200000 && !seenTeamIds.has(potentialTeamId)) {
      const nearbyStrings = findStringsInRange(data, offset + 4, offset + 150);
      
      // Look for team name patterns (typically longer, may contain FC, United, City, etc.)
      const teamNameCandidates = nearbyStrings.filter(s => {
        if (!isValidName(s) || s.length < 3) return false;
        // Team names often contain these patterns
        const teamKeywords = ['fc', 'united', 'city', 'real', 'inter', 'athletic', 'club', 'sport', 'cf'];
        const lower = s.toLowerCase();
        return teamKeywords.some(k => lower.includes(k)) || s.length >= 6;
      });
      
      if (teamNameCandidates.length > 0) {
        // Look for a league_id nearby
        let leagueId: number | undefined;
        for (let lidOff = 20; lidOff < 80; lidOff += 4) {
          const lid = readUint32LE(data, offset + lidOff);
          if (lid > 0 && lid < 5000) {
            leagueId = lid;
            break;
          }
        }
        
        const team: ParsedTeam = {
          id: potentialTeamId,
          name: teamNameCandidates[0],
          league_id: leagueId,
        };
        
        teams.push(team);
        seenTeamIds.add(potentialTeamId);
        
        if (teams.length <= 5) {
          console.log(`Found team: ID=${potentialTeamId}, Name=${team.name}`);
        }
        
        offset += 80;
        continue;
      }
    }
    
    offset += 4;
    if (teams.length >= 2000) break;
  }
  
  // Strategy 4: Look for league records
  offset = 0;
  const leagueKeywords = ['league', 'liga', 'serie', 'ligue', 'bundesliga', 'premier', 'division', 'eredivisie'];
  
  while (offset < maxScan) {
    const potentialLeagueId = readUint32LE(data, offset);
    
    if (potentialLeagueId > 0 && potentialLeagueId < 5000 && !seenLeagueIds.has(potentialLeagueId)) {
      const nearbyStrings = findStringsInRange(data, offset + 4, offset + 120);
      
      const leagueNameCandidates = nearbyStrings.filter(s => {
        const lower = s.toLowerCase();
        return isValidName(s) && leagueKeywords.some(k => lower.includes(k));
      });
      
      if (leagueNameCandidates.length > 0) {
        const league: ParsedLeague = {
          id: potentialLeagueId,
          name: leagueNameCandidates[0],
        };
        
        leagues.push(league);
        seenLeagueIds.add(potentialLeagueId);
        
        console.log(`Found league: ID=${potentialLeagueId}, Name=${league.name}`);
        
        offset += 60;
        continue;
      }
    }
    
    offset += 4;
    if (leagues.length >= 200) break;
  }
  
  console.log(`Parsing complete: ${players.length} players, ${teams.length} teams, ${leagues.length} leagues`);
  
  return { players, teams, leagues, competitions };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileData, fileName, importType } = await req.json();
    
    if (!fileData) {
      return new Response(
        JSON.stringify({ success: false, error: 'No file data provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log(`Processing file: ${fileName}, import type: ${importType}`);
    
    // Decode base64 to binary
    const binaryString = atob(fileData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log(`Decoded ${bytes.length} bytes from base64`);
    
    // Parse the squad file
    const { players, teams, leagues, competitions } = parseSquadFile(bytes);
    
    if (players.length === 0 && teams.length === 0 && leagues.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Could not parse squad file. The binary format may not be recognized.',
          hint: 'Binary parsing has limited format support. For best results, use FIFA Editor Tool (FET) to export to JSON format, which provides 100% accurate data import.',
          fileInfo: {
            size: bytes.length,
            headerHex: Array.from(bytes.slice(0, 32)).map(b => b.toString(16).padStart(2, '0')).join(' ')
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const results = {
      players: { inserted: 0, errors: 0 },
      teams: { inserted: 0, errors: 0 },
      leagues: { inserted: 0, errors: 0 },
      competitions: { inserted: 0, errors: 0 },
    };
    
    // Handle replace mode - clear existing data
    if (importType === 'replace') {
      console.log('Replace mode: clearing existing data...');
      await supabase.from('players').delete().neq('id', 0);
      await supabase.from('teams').delete().neq('id', 0);
      await supabase.from('leagues').delete().neq('id', 0);
      await supabase.from('competitions').delete().neq('id', 0);
    }
    
    // Import in order: leagues -> teams -> players (to respect foreign keys)
    if (leagues.length > 0) {
      console.log(`Importing ${leagues.length} leagues...`);
      const { error } = await supabase.from('leagues').upsert(leagues, { onConflict: 'id' });
      if (error) {
        console.error('Error importing leagues:', error);
        results.leagues.errors = leagues.length;
      } else {
        results.leagues.inserted = leagues.length;
      }
    }
    
    if (teams.length > 0) {
      console.log(`Importing ${teams.length} teams...`);
      const { error } = await supabase.from('teams').upsert(teams, { onConflict: 'id' });
      if (error) {
        console.error('Error importing teams:', error);
        results.teams.errors = teams.length;
      } else {
        results.teams.inserted = teams.length;
      }
    }
    
    // Import players in batches
    if (players.length > 0) {
      console.log(`Importing ${players.length} players in batches...`);
      const BATCH_SIZE = 500;
      for (let i = 0; i < players.length; i += BATCH_SIZE) {
        const batch = players.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('players').upsert(batch, { onConflict: 'id' });
        
        if (error) {
          console.error(`Error importing players batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
          results.players.errors += batch.length;
        } else {
          results.players.inserted += batch.length;
        }
      }
    }
    
    if (competitions.length > 0) {
      const { error } = await supabase.from('competitions').upsert(competitions, { onConflict: 'id' });
      if (error) {
        console.error('Error importing competitions:', error);
        results.competitions.errors = competitions.length;
      } else {
        results.competitions.inserted = competitions.length;
      }
    }
    
    console.log('Import results:', results);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        message: `Imported ${results.players.inserted} players, ${results.teams.inserted} teams, ${results.leagues.inserted} leagues from binary file.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing squad file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
