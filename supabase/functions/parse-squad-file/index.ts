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
  age?: number;
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
}

interface ParsedLeague {
  id: number;
  name: string;
  short_name?: string;
  country_code?: string;
}

interface ParseResult {
  players: ParsedPlayer[];
  teams: ParsedTeam[];
  leagues: ParsedLeague[];
  format: string;
  hint?: string;
}

function readUint32LE(bytes: Uint8Array, offset: number): number {
  if (offset + 3 >= bytes.length) return 0;
  return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
}

function decodeString(bytes: Uint8Array, offset: number, maxLength: number): string {
  let end = offset;
  while (end < offset + maxLength && end < bytes.length && bytes[end] !== 0) {
    end++;
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(offset, end));
}

// Detect file format from header
function detectFormat(data: Uint8Array): string {
  const header = decodeString(data, 0, 20);
  
  if (header.startsWith('FBCHUNKS')) {
    return 'fbchunks'; // Frostbite chunk format
  }
  if (header.startsWith('DB\x00') || header.includes('DB')) {
    return 'frostbite_db';
  }
  // Check for FIFA legacy formats
  const magic = readUint32LE(data, 0);
  if (magic === 0x00004244) { // "DB\x00\x00"
    return 'legacy_db';
  }
  
  return 'unknown';
}

// Parse FBCHUNKS format (Frostbite engine squad files)
// This format is proprietary and complex - we provide limited extraction
function parseFBChunks(data: Uint8Array): ParseResult {
  console.log('Detected FBCHUNKS format - Frostbite engine squad file');
  
  // FBCHUNKS files contain compressed/encoded data that requires
  // the Frostbite engine or specialized tools like FET to properly decode.
  // Direct binary parsing cannot reliably extract player data without
  // reverse-engineering the entire format specification.
  
  // We'll look for the string tables which might contain readable names
  const players: ParsedPlayer[] = [];
  const teams: ParsedTeam[] = [];
  const leagues: ParsedLeague[] = [];
  
  // FBCHUNKS header structure (limited parsing):
  // 0-7: "FBCHUNKS"
  // 8-11: Version/flags
  // 12+: Chunk data
  
  // Extract the embedded label if present
  const labelOffset = 24;
  const label = decodeString(data, labelOffset, 50);
  console.log(`Squad file label: ${label}`);
  
  // Try to find and extract any string tables
  // String tables in FBCHUNKS are typically at known offsets or marked with patterns
  const stringTablePatterns = findStringTables(data);
  console.log(`Found ${stringTablePatterns.length} potential string sections`);
  
  // Look for player-like strings that could be names
  const potentialNames = extractPotentialNames(data);
  console.log(`Found ${potentialNames.length} potential name strings`);
  
  return {
    players,
    teams,
    leagues,
    format: 'fbchunks',
    hint: 'FBCHUNKS files (Frostbite engine format) contain compressed binary data that requires FIFA Editor Tool (FET) to properly decode. Please export your squad file to JSON format using FET for accurate data import.'
  };
}

// Find sections that might contain string tables
function findStringTables(data: Uint8Array): number[] {
  const offsets: number[] = [];
  // Limited scan to avoid CPU timeout
  const maxScan = Math.min(data.length, 100000);
  
  for (let i = 0; i < maxScan - 4; i += 4) {
    // Look for high ASCII density (string table markers)
    let printableCount = 0;
    for (let j = 0; j < 20 && i + j < data.length; j++) {
      if (data[i + j] >= 32 && data[i + j] < 127) {
        printableCount++;
      }
    }
    if (printableCount > 15) {
      offsets.push(i);
      i += 50; // Skip ahead
    }
  }
  
  return offsets.slice(0, 10); // Return first 10 only
}

// Extract strings that look like names (limited extraction)
function extractPotentialNames(data: Uint8Array): string[] {
  const names: string[] = [];
  const maxScan = Math.min(data.length, 500000);
  let i = 0;
  
  while (i < maxScan && names.length < 100) {
    // Look for sequences of printable characters
    let start = -1;
    while (i < maxScan && !(data[i] >= 65 && data[i] <= 122)) {
      i++;
    }
    if (i >= maxScan) break;
    
    start = i;
    let len = 0;
    while (i < maxScan && data[i] >= 32 && data[i] < 127 && len < 50) {
      i++;
      len++;
    }
    
    if (len >= 4 && len <= 40) {
      const str = decodeString(data, start, len);
      // Filter for name-like strings (contain letters, reasonable format)
      if (/^[A-Za-z][A-Za-z\s\-'\.]+$/.test(str) && str.length >= 4) {
        names.push(str);
      }
    }
    i++;
  }
  
  return names;
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
    
    // Detect and log format
    const format = detectFormat(bytes);
    const headerHex = Array.from(bytes.slice(0, 32)).map(b => b.toString(16).padStart(2, '0')).join(' ');
    console.log(`Detected format: ${format}`);
    console.log(`File header: ${headerHex}`);
    
    // Handle FBCHUNKS format specifically
    if (format === 'fbchunks') {
      const result = parseFBChunks(bytes);
      
      // FBCHUNKS files cannot be reliably parsed without FET
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Frostbite engine squad file detected (FBCHUNKS format)',
          hint: result.hint,
          format: 'fbchunks',
          fileInfo: {
            size: bytes.length,
            sizeFormatted: `${(bytes.length / 1024 / 1024).toFixed(2)} MB`,
            header: headerHex.substring(0, 48)
          },
          recommendation: 'Please use FIFA Editor Tool (FET) to open this squad file and export to JSON format. FET can properly decode the Frostbite engine data structures and provide accurate player, team, and league information.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // For other unknown formats, also recommend FET
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Unsupported binary file format',
        hint: 'This binary format is not recognized. FIFA/FC squad files use proprietary formats that require specialized tools to decode.',
        format: format,
        fileInfo: {
          size: bytes.length,
          header: headerHex.substring(0, 48)
        },
        recommendation: 'Please use FIFA Editor Tool (FET) to convert your squad file to JSON format for import.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
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
