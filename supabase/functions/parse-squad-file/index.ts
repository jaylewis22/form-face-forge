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
  // Attributes
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
}

// FIFA/FC squad file structure helpers
// Note: This is a simplified parser for common squad file formats
// Full support requires reverse-engineering the exact Frostbite format

function decodeString(bytes: Uint8Array, offset: number, maxLength: number): string {
  let end = offset;
  while (end < offset + maxLength && bytes[end] !== 0) {
    end++;
  }
  return new TextDecoder('utf-8').decode(bytes.slice(offset, end));
}

function readUint32LE(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
}

function readUint16LE(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function parseSquadFile(data: Uint8Array): { players: ParsedPlayer[], teams: ParsedTeam[] } {
  const players: ParsedPlayer[] = [];
  const teams: ParsedTeam[] = [];
  
  console.log(`Parsing squad file, size: ${data.length} bytes`);
  
  // Check for common file signatures
  const header = new TextDecoder().decode(data.slice(0, 16));
  console.log(`File header (first 16 bytes as text): ${header.replace(/[^\x20-\x7E]/g, '.')}`);
  console.log(`File header (hex): ${Array.from(data.slice(0, 16)).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
  
  // Try to find player data patterns
  // FIFA/FC squad files typically have player records with:
  // - Player ID (4 bytes)
  // - Overall rating (1 byte, value 40-99 typically)
  // - Position data
  // - Attribute blocks
  
  // Scan for potential player record patterns
  let offset = 0;
  let foundRecords = 0;
  
  // Look for patterns that might indicate player data
  while (offset < data.length - 100) {
    // Check if we have a potential player ID followed by valid rating
    const potentialId = readUint32LE(data, offset);
    const potentialRating = data[offset + 4];
    
    // Valid player IDs are typically in a certain range (not 0, not too large)
    // Valid overall ratings are 40-99
    if (potentialId > 0 && potentialId < 500000 && potentialRating >= 40 && potentialRating <= 99) {
      // This might be a player record - try to extract data
      const potentialPotential = data[offset + 5];
      
      if (potentialPotential >= 40 && potentialPotential <= 99) {
        // Look for a name string nearby (within next 100 bytes)
        let nameOffset = -1;
        for (let i = offset + 8; i < Math.min(offset + 100, data.length - 20); i++) {
          // Check for printable ASCII sequence that could be a name (min 3 chars)
          let nameLen = 0;
          while (i + nameLen < data.length && data[i + nameLen] >= 32 && data[i + nameLen] < 127) {
            nameLen++;
          }
          if (nameLen >= 3 && nameLen <= 50) {
            nameOffset = i;
            break;
          }
        }
        
        if (nameOffset > 0) {
          const name = decodeString(data, nameOffset, 50);
          if (name.length >= 2) {
            players.push({
              id: potentialId,
              name: name,
              overall_rating: potentialRating,
              potential_rating: potentialPotential,
            });
            foundRecords++;
            console.log(`Found potential player: ID=${potentialId}, Name=${name}, OVR=${potentialRating}`);
            
            // Skip ahead to avoid re-parsing same record
            offset += 50;
            continue;
          }
        }
      }
    }
    
    offset++;
    
    // Limit scanning for performance
    if (foundRecords >= 5000 || offset > 10000000) {
      break;
    }
  }
  
  console.log(`Parsing complete. Found ${players.length} potential players, ${teams.length} teams`);
  
  // If we didn't find structured data, the file format might not be supported
  if (players.length === 0) {
    console.log('No structured player data found. File may be in an unsupported format.');
    console.log('Consider using FIFA Editor Tool (FET) to convert to JSON format.');
  }
  
  return { players, teams };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
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
    const { players, teams } = parseSquadFile(bytes);
    
    if (players.length === 0 && teams.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Could not parse squad file. The file format may not be supported. Please use FIFA Editor Tool (FET) to convert to JSON format.',
          hint: 'Binary squad file parsing has limited format support. FET JSON exports provide the most reliable import method.'
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
    };
    
    // Handle replace mode
    if (importType === 'replace') {
      console.log('Replace mode: clearing existing data...');
      await supabase.from('players').delete().neq('id', 0);
      await supabase.from('teams').delete().neq('id', 0);
    }
    
    // Import teams first (if any)
    if (teams.length > 0) {
      const { error } = await supabase.from('teams').upsert(teams, { onConflict: 'id' });
      if (error) {
        console.error('Error importing teams:', error);
        results.teams.errors = teams.length;
      } else {
        results.teams.inserted = teams.length;
      }
    }
    
    // Import players in batches
    const BATCH_SIZE = 500;
    for (let i = 0; i < players.length; i += BATCH_SIZE) {
      const batch = players.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from('players').upsert(batch, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error importing players batch ${i / BATCH_SIZE + 1}:`, error);
        results.players.errors += batch.length;
      } else {
        results.players.inserted += batch.length;
      }
    }
    
    console.log('Import results:', results);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        message: `Parsed and imported ${results.players.inserted} players and ${results.teams.inserted} teams from binary file.`
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
