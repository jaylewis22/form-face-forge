/**
 * Client-side FBCHUNKS Parser
 * Parses EA FC squad files directly in the browser.
 * Extracts player data from MEDIUM chunks (no Oodle required).
 */

export interface ParsedPlayer {
  playerid: number;
  overallrating: number;
  potential: number;
  age?: number;
  height?: number;
  weight?: number;
  preferredposition1?: number;
  preferredposition2?: number;
  preferredposition3?: number;
  preferredposition4?: number;
  nationality?: number;
  // Pace attributes
  acceleration?: number;
  sprintspeed?: number;
  // Shooting attributes
  positioning?: number;
  finishing?: number;
  shotpower?: number;
  longshots?: number;
  volleys?: number;
  penalties?: number;
  // Passing attributes
  vision?: number;
  crossing?: number;
  freekickaccuracy?: number;
  shortpassing?: number;
  longpassing?: number;
  curve?: number;
  // Dribbling attributes
  agility?: number;
  balance?: number;
  reactions?: number;
  ballcontrol?: number;
  dribbling?: number;
  composure?: number;
  // Defending attributes
  interceptions?: number;
  headingaccuracy?: number;
  defawareness?: number;
  standingtackle?: number;
  slidingtackle?: number;
  // Physical attributes
  jumping?: number;
  stamina?: number;
  strength?: number;
  aggression?: number;
  // GK attributes
  gkdiving?: number;
  gkhandling?: number;
  gkkicking?: number;
  gkpositioning?: number;
  gkreflexes?: number;
  // Additional fields
  weakfootabilitytypecode?: number;
  skillmoves?: number;
  preferredfoot?: number;
}

interface Chunk {
  index: number;
  offset: number;
  size: number;
  compressedSize?: number;
  isCompressed?: boolean;
}

export interface ParseProgress {
  stage: "reading" | "scanning" | "parsing" | "extracting" | "complete";
  progress: number;
  totalChunks: number;
  processedChunks: number;
  playersFound: number;
  detail?: string;
}

export interface FBCHUNKSParseResult {
  success: boolean;
  format: string;
  players: ParsedPlayer[];
  totalChunks: number;
  mediumChunks: number;
  error?: string;
}

/**
 * Detect if a file is FBCHUNKS format by checking magic bytes
 */
export async function detectFBCHUNKS(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const magic = new TextDecoder().decode(bytes.slice(0, 8));
  return magic === "FBCHUNKS";
}

// Player attribute offsets within 144-byte record
// Based on documented EA FC player schema - attributes are typically 1 byte each (0-99)
// The record structure groups related attributes together
const PLAYER_SCHEMA: Record<string, { offset: number; size: 1 | 2 | 4; isAttribute?: boolean }> = {
  // Identity block (bytes 0-15)
  playerid: { offset: 0, size: 4 },
  nationality: { offset: 4, size: 2 },
  
  // Core ratings block (bytes 16-25)
  overallrating: { offset: 16, size: 1, isAttribute: true },
  potential: { offset: 17, size: 1, isAttribute: true },
  
  // Physical info (bytes 18-22)
  age: { offset: 18, size: 1 },
  height: { offset: 19, size: 1 },
  weight: { offset: 20, size: 1 },
  preferredfoot: { offset: 21, size: 1 },
  weakfootabilitytypecode: { offset: 22, size: 1, isAttribute: true },
  skillmoves: { offset: 23, size: 1, isAttribute: true },
  
  // Position block (bytes 24-31)
  preferredposition1: { offset: 24, size: 1 },
  preferredposition2: { offset: 25, size: 1 },
  preferredposition3: { offset: 26, size: 1 },
  preferredposition4: { offset: 27, size: 1 },
  
  // Pace attributes (bytes 32-35)
  acceleration: { offset: 32, size: 1, isAttribute: true },
  sprintspeed: { offset: 33, size: 1, isAttribute: true },
  
  // Shooting attributes (bytes 36-45)
  positioning: { offset: 36, size: 1, isAttribute: true },
  finishing: { offset: 37, size: 1, isAttribute: true },
  shotpower: { offset: 38, size: 1, isAttribute: true },
  longshots: { offset: 39, size: 1, isAttribute: true },
  volleys: { offset: 40, size: 1, isAttribute: true },
  penalties: { offset: 41, size: 1, isAttribute: true },
  
  // Passing attributes (bytes 46-55)
  vision: { offset: 46, size: 1, isAttribute: true },
  crossing: { offset: 47, size: 1, isAttribute: true },
  freekickaccuracy: { offset: 48, size: 1, isAttribute: true },
  shortpassing: { offset: 49, size: 1, isAttribute: true },
  longpassing: { offset: 50, size: 1, isAttribute: true },
  curve: { offset: 51, size: 1, isAttribute: true },
  
  // Dribbling attributes (bytes 56-65)
  agility: { offset: 56, size: 1, isAttribute: true },
  balance: { offset: 57, size: 1, isAttribute: true },
  reactions: { offset: 58, size: 1, isAttribute: true },
  ballcontrol: { offset: 59, size: 1, isAttribute: true },
  dribbling: { offset: 60, size: 1, isAttribute: true },
  composure: { offset: 61, size: 1, isAttribute: true },
  
  // Defending attributes (bytes 66-75)
  interceptions: { offset: 66, size: 1, isAttribute: true },
  headingaccuracy: { offset: 67, size: 1, isAttribute: true },
  defawareness: { offset: 68, size: 1, isAttribute: true },
  standingtackle: { offset: 69, size: 1, isAttribute: true },
  slidingtackle: { offset: 70, size: 1, isAttribute: true },
  
  // Physical attributes (bytes 76-85)
  jumping: { offset: 76, size: 1, isAttribute: true },
  stamina: { offset: 77, size: 1, isAttribute: true },
  strength: { offset: 78, size: 1, isAttribute: true },
  aggression: { offset: 79, size: 1, isAttribute: true },
  
  // GK attributes (bytes 86-95)
  gkdiving: { offset: 86, size: 1, isAttribute: true },
  gkhandling: { offset: 87, size: 1, isAttribute: true },
  gkkicking: { offset: 88, size: 1, isAttribute: true },
  gkpositioning: { offset: 89, size: 1, isAttribute: true },
  gkreflexes: { offset: 90, size: 1, isAttribute: true },
};

// Attribute fields that should be clamped to 1-99
const ATTRIBUTE_FIELDS = Object.entries(PLAYER_SCHEMA)
  .filter(([, schema]) => schema.isAttribute)
  .map(([field]) => field);

/**
 * Clamp attribute value to valid range (1-99)
 */
function clampAttribute(value: number): number {
  if (value < 1) return 1;
  if (value > 99) return 99;
  return value;
}

export class FBCHUNKSParser {
  private buffer: ArrayBuffer;
  private view: DataView;
  private bytes: Uint8Array;

  constructor(buffer: ArrayBuffer) {
    this.buffer = buffer;
    this.view = new DataView(buffer);
    this.bytes = new Uint8Array(buffer);
  }

  /**
   * Check if buffer is a valid FBCHUNKS file
   */
  isValidFBCHUNKS(): boolean {
    if (this.buffer.byteLength < 16) return false;
    const magic = new TextDecoder().decode(this.bytes.slice(0, 8));
    return magic === "FBCHUNKS";
  }

  /**
   * Parse chunk directory at offset 0x1530 (documented structure)
   * Directory has 489 entries × 16 bytes = 8,320 bytes
   */
  private parseChunkDirectory(): Chunk[] {
    const chunks: Chunk[] = [];
    
    // FBCHUNKS documented structure:
    // 0x00-0x08:     "FBCHUNKS" magic
    // 0x08-0x54:     Header metadata (76 bytes)
    // 0x54-0x1530:   Enc1 tag block (5,336 bytes)
    // 0x1530-0x35B0: Primary directory (489 entries × 16 bytes)
    
    const DIR_OFFSET = 0x1530;
    const DIR_END = 0x35B0;
    const ENTRY_SIZE = 16;
    const MAX_ENTRIES = 489;
    
    console.log(`[FBCHUNKSParser] Parsing directory at 0x${DIR_OFFSET.toString(16)}, file size: ${this.buffer.byteLength}`);
    
    // Verify we have enough data for the directory
    if (this.buffer.byteLength < DIR_END) {
      console.log(`[FBCHUNKSParser] File too small for standard directory, using pattern scanning`);
      return this.scanForPlayerData();
    }
    
    // Parse chunk directory entries
    for (let i = 0; i < MAX_ENTRIES; i++) {
      const entryOffset = DIR_OFFSET + i * ENTRY_SIZE;
      
      if (entryOffset + ENTRY_SIZE > this.buffer.byteLength) break;

      try {
        // Entry format: [flags:4][offset:4][uncompressed_size:4][compressed_size:4]
        const flags = this.view.getUint32(entryOffset, true);
        const chunkOffset = this.view.getUint32(entryOffset + 4, true);
        const uncompressedSize = this.view.getUint32(entryOffset + 8, true);
        const compressedSize = this.view.getUint32(entryOffset + 12, true);

        // Skip null entries
        if (chunkOffset === 0 && uncompressedSize === 0) continue;

        // Validate chunk bounds
        const actualSize = compressedSize > 0 && compressedSize < uncompressedSize 
          ? compressedSize 
          : uncompressedSize;
          
        if (
          chunkOffset >= 0x35B0 && // After directory
          uncompressedSize > 0 &&
          uncompressedSize < 0x100000 && // Max 1MB uncompressed
          chunkOffset < this.buffer.byteLength &&
          chunkOffset + actualSize <= this.buffer.byteLength
        ) {
          chunks.push({
            index: i,
            offset: chunkOffset,
            size: uncompressedSize,
            compressedSize: compressedSize > 0 ? compressedSize : undefined,
            isCompressed: compressedSize > 0 && compressedSize < uncompressedSize,
          });
        }
      } catch {
        // Skip invalid entries
      }
    }
    
    console.log(`[FBCHUNKSParser] Directory parsed: ${chunks.length} valid chunks`);
    
    // If directory parsing yielded few chunks, supplement with pattern scanning
    if (chunks.length < 50) {
      console.log(`[FBCHUNKSParser] Low chunk count, supplementing with pattern scan...`);
      const scannedChunks = this.scanForPlayerData();
      // Merge, avoiding duplicates
      for (const sc of scannedChunks) {
        const isDupe = chunks.some(c => 
          Math.abs(c.offset - sc.offset) < 0x1000
        );
        if (!isDupe) {
          chunks.push(sc);
        }
      }
    }

    return chunks;
  }
  
  /**
   * Scan file for player data patterns directly
   * Looks for 144-byte player records with valid attribute values
   */
  private scanForPlayerData(): Chunk[] {
    const chunks: Chunk[] = [];
    const RECORD_SIZE = 144;
    const SCAN_STEP = 0x800; // 2KB steps
    const MIN_DATA_OFFSET = 0x35B0; // After directory
    
    console.log(`[FBCHUNKSParser] Scanning for player data patterns...`);
    
    // Scan the file for regions with valid player data patterns
    for (let pos = MIN_DATA_OFFSET; pos < this.buffer.byteLength - RECORD_SIZE * 10; pos += SCAN_STEP) {
      let validRecordCount = 0;
      
      // Check for valid player-like records in this region
      for (let offset = 0; offset < 0x1000 && pos + offset + RECORD_SIZE <= this.buffer.byteLength; offset += RECORD_SIZE) {
        const recordStart = pos + offset;
        
        // Check for player record markers (various patterns)
        // Player records often have playerid at offset 0 (4 bytes) followed by structured data
        const potentialId = this.view.getUint32(recordStart, true);
        
        // Valid player IDs are typically 1-999999999
        if (potentialId > 0 && potentialId < 999999999) {
          // Check for reasonable attribute values at the new schema offsets
          // Overall rating at offset 16, potential at 17, age at 18
          const rating = this.bytes[recordStart + 16];
          const potential = this.bytes[recordStart + 17];
          const age = this.bytes[recordStart + 18];
          
          if (rating >= 1 && rating <= 99 && 
              potential >= 1 && potential <= 99 &&
              age >= 15 && age <= 50) {
            validRecordCount++;
          }
        }
      }
      
      if (validRecordCount >= 3) {
        chunks.push({
          index: chunks.length,
          offset: pos,
          size: 0x2000, // Scan 8KB region
          isCompressed: false,
        });
        console.log(`[FBCHUNKSParser] Found player region at 0x${pos.toString(16)} (${validRecordCount} valid records)`);
        pos += 0x1800; // Skip ahead to avoid overlap
      }
    }
    
    // Also scan for DF 00 markers which often delimit records
    if (chunks.length < 10) {
      console.log(`[FBCHUNKSParser] Scanning for DF 00 markers...`);
      for (let pos = MIN_DATA_OFFSET; pos < this.buffer.byteLength - 0x2000; pos += 0x1000) {
        const region = this.bytes.slice(pos, Math.min(pos + 0x2000, this.buffer.byteLength));
        let markerCount = 0;
        
        for (let i = 0; i < region.length - 1; i++) {
          if (region[i] === 0xdf && region[i + 1] === 0x00) {
            markerCount++;
          }
        }
        
        if (markerCount >= 5) {
          const isDupe = chunks.some(c => Math.abs(c.offset - pos) < 0x2000);
          if (!isDupe) {
            chunks.push({
              index: chunks.length,
              offset: pos,
              size: 0x2000,
              isCompressed: false,
            });
            console.log(`[FBCHUNKSParser] Found DF 00 region at 0x${pos.toString(16)} (${markerCount} markers)`);
          }
        }
      }
    }
    
    return chunks;
  }

  /**
   * Classify chunk by size
   */
  private classifyChunk(chunk: Chunk): "TINY" | "SMALL" | "MEDIUM" | "LARGE" {
    const size = chunk.isCompressed ? chunk.size : chunk.size;
    if (size < 500) return "TINY";
    if (size < 1400) return "SMALL";
    if (size < 2100) return "MEDIUM";
    return "LARGE";
  }

  /**
   * Extract player records from a chunk
   * Tries multiple extraction methods
   */
  private extractPlayerRecords(chunk: Chunk): ParsedPlayer[] {
    const players: ParsedPlayer[] = [];
    const RECORD_SIZE = 144;

    // Get chunk data
    const actualSize = chunk.isCompressed
      ? chunk.compressedSize ?? chunk.size
      : chunk.size;
    
    if (chunk.offset + actualSize > this.buffer.byteLength) {
      return players;
    }

    const chunkData = this.bytes.slice(chunk.offset, chunk.offset + actualSize);
    
    // Method 1: Look for DF 00 markers
    const MARKER = [0xdf, 0x00];
    for (let i = 0; i < chunkData.length - RECORD_SIZE - 2; i++) {
      if (chunkData[i] === MARKER[0] && chunkData[i + 1] === MARKER[1]) {
        const recordStart = i + 2;
        if (recordStart + RECORD_SIZE <= chunkData.length) {
          const recordBytes = chunkData.slice(recordStart, recordStart + RECORD_SIZE);
          const player = this.parsePlayerRecord(recordBytes);
          
          if (this.isValidPlayer(player)) {
            players.push(player);
            i += RECORD_SIZE; // Skip to next potential record
          }
        }
      }
    }
    
    // Method 2: If no markers found, try direct stride-based scanning
    if (players.length === 0) {
      for (let offset = 0; offset + RECORD_SIZE <= chunkData.length; offset += RECORD_SIZE) {
        const recordBytes = chunkData.slice(offset, offset + RECORD_SIZE);
        const player = this.parsePlayerRecord(recordBytes);
        
        if (this.isValidPlayer(player)) {
          players.push(player);
        }
      }
    }
    
    // Method 3: Try scanning with different alignments if still no results
    if (players.length === 0) {
      // Try scanning byte-by-byte for valid player patterns
      for (let offset = 0; offset + RECORD_SIZE <= chunkData.length; offset++) {
        // Check if this looks like a player record start
        const potentialId = new DataView(
          chunkData.buffer, 
          chunkData.byteOffset + offset, 
          4
        ).getUint32(0, true);
        
        if (potentialId > 100 && potentialId < 999999999) {
          const recordBytes = chunkData.slice(offset, offset + RECORD_SIZE);
          const player = this.parsePlayerRecord(recordBytes);
          
          if (this.isValidPlayer(player)) {
            players.push(player);
            offset += RECORD_SIZE - 1; // Skip ahead
          }
        }
      }
    }

    return players;
  }

  /**
   * Parse a single 144-byte player record
   */
  private parsePlayerRecord(bytes: Uint8Array): ParsedPlayer {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const player: Partial<ParsedPlayer> = {};

    for (const [field, schema] of Object.entries(PLAYER_SCHEMA)) {
      if (schema.offset + schema.size <= bytes.length) {
        try {
          let value: number;
          if (schema.size === 1) {
            value = bytes[schema.offset];
          } else if (schema.size === 2) {
            value = view.getUint16(schema.offset, true);
          } else {
            value = view.getUint32(schema.offset, true);
          }
          
          // Clamp attribute values to valid range (1-99)
          if (schema.isAttribute && schema.size === 1) {
            value = clampAttribute(value);
          }
          
          (player as Record<string, number>)[field] = value;
        } catch {
          // Skip field on error
        }
      }
    }

    return player as ParsedPlayer;
  }

  /**
   * Validate if a parsed player has reasonable data
   */
  private isValidPlayer(player: ParsedPlayer): boolean {
    // Must have a player ID
    if (!player.playerid || player.playerid <= 0 || player.playerid > 999999999) {
      return false;
    }

    // Overall rating should be between 1 and 99
    if (!player.overallrating || player.overallrating < 1 || player.overallrating > 99) {
      return false;
    }

    // Potential should be between 1 and 99
    if (!player.potential || player.potential < 1 || player.potential > 99) {
      return false;
    }

    // Age should be reasonable (15-50)
    if (player.age && (player.age < 15 || player.age > 50)) {
      return false;
    }

    return true;
  }

  /**
   * Main parse method
   */
  parse(): FBCHUNKSParseResult {
    return this.parseWithProgress();
  }

  /**
   * Parse with progress callback support
   */
  parseWithProgress(onProgress?: (progress: ParseProgress) => void): FBCHUNKSParseResult {
    if (!this.isValidFBCHUNKS()) {
      return {
        success: false,
        format: "unknown",
        players: [],
        totalChunks: 0,
        mediumChunks: 0,
        error: "Not a valid FBCHUNKS file",
      };
    }

    onProgress?.({
      stage: "scanning",
      progress: 20,
      totalChunks: 0,
      processedChunks: 0,
      playersFound: 0,
      detail: "Parsing chunk directory...",
    });

    const chunks = this.parseChunkDirectory();
    const mediumChunks = chunks.filter((c) => this.classifyChunk(c) === "MEDIUM");
    const smallChunks = chunks.filter((c) => this.classifyChunk(c) === "SMALL");
    // Also include LARGE chunks (uncompressed ones may contain data)
    const largeChunks = chunks.filter((c) => this.classifyChunk(c) === "LARGE" && !c.isCompressed);
    const chunksToProcess = [...mediumChunks, ...smallChunks, ...largeChunks, ...chunks];
    
    // Deduplicate by offset
    const uniqueChunks = Array.from(
      new Map(chunksToProcess.map(c => [c.offset, c])).values()
    );
    
    const allPlayers: ParsedPlayer[] = [];

    console.log(`[FBCHUNKSParser] Found ${chunks.length} chunks, ${mediumChunks.length} MEDIUM, ${smallChunks.length} SMALL, ${largeChunks.length} LARGE (uncompressed)`);

    onProgress?.({
      stage: "parsing",
      progress: 30,
      totalChunks: chunks.length,
      processedChunks: 0,
      playersFound: 0,
      detail: `Found ${chunks.length} chunks, scanning for player data...`,
    });

    // Extract players from chunks
    let processedCount = 0;
    for (const chunk of uniqueChunks) {
      const players = this.extractPlayerRecords(chunk);
      allPlayers.push(...players);
      processedCount++;

      // Report progress every 10 chunks
      if (processedCount % 10 === 0 || processedCount === uniqueChunks.length) {
        const progressPct = 30 + Math.floor((processedCount / uniqueChunks.length) * 40);
        onProgress?.({
          stage: "extracting",
          progress: progressPct,
          totalChunks: chunks.length,
          processedChunks: processedCount,
          playersFound: allPlayers.length,
          detail: `Processing chunk ${processedCount}/${uniqueChunks.length}...`,
        });
      }
    }
    
    // If no players found from chunks, do a full file scan
    if (allPlayers.length === 0) {
      onProgress?.({
        stage: "extracting",
        progress: 75,
        totalChunks: chunks.length,
        processedChunks: uniqueChunks.length,
        playersFound: 0,
        detail: "No players in chunks, performing full file scan...",
      });
      
      console.log(`[FBCHUNKSParser] No players from chunks, performing full file scan...`);
      const scannedPlayers = this.fullFileScan();
      allPlayers.push(...scannedPlayers);
    }

    onProgress?.({
      stage: "extracting",
      progress: 85,
      totalChunks: chunks.length,
      processedChunks: uniqueChunks.length,
      playersFound: allPlayers.length,
      detail: "Deduplicating player records...",
    });

    // Deduplicate by playerid
    const uniquePlayers = new Map<number, ParsedPlayer>();
    for (const player of allPlayers) {
      if (!uniquePlayers.has(player.playerid)) {
        uniquePlayers.set(player.playerid, player);
      }
    }

    const players = Array.from(uniquePlayers.values());
    console.log(`[FBCHUNKSParser] Extracted ${players.length} unique players`);

    onProgress?.({
      stage: "complete",
      progress: 100,
      totalChunks: chunks.length,
      processedChunks: uniqueChunks.length,
      playersFound: players.length,
      detail: `Extracted ${players.length} unique players`,
    });

    return {
      success: players.length > 0,
      format: "fbchunks",
      players,
      totalChunks: chunks.length,
      mediumChunks: mediumChunks.length,
    };
  }
  
  /**
   * Full file scan - brute force search for player records
   */
  private fullFileScan(): ParsedPlayer[] {
    const players: ParsedPlayer[] = [];
    const RECORD_SIZE = 144;
    const MIN_OFFSET = 0x35B0; // After directory
    
    console.log(`[FBCHUNKSParser] Full file scan from 0x${MIN_OFFSET.toString(16)} to 0x${this.buffer.byteLength.toString(16)}`);
    
    // Scan the entire data region for valid player records
    for (let offset = MIN_OFFSET; offset + RECORD_SIZE <= this.buffer.byteLength; offset++) {
      // Quick check: valid player ID at offset 0
      const potentialId = this.view.getUint32(offset, true);
      
      // Player IDs are typically 100+
      if (potentialId < 100 || potentialId > 999999999) {
        continue;
      }
      
      // Check ratings at expected offsets (16, 17, 18 per new schema)
      const rating = this.bytes[offset + 16];
      const potential = this.bytes[offset + 17];
      const age = this.bytes[offset + 18];
      
      if (rating >= 1 && rating <= 99 && 
          potential >= 1 && potential <= 99 &&
          age >= 15 && age <= 50) {
        // This looks like a valid player record
        const recordBytes = this.bytes.slice(offset, offset + RECORD_SIZE);
        const player = this.parsePlayerRecord(recordBytes);
        
        if (this.isValidPlayer(player)) {
          players.push(player);
          offset += RECORD_SIZE - 1; // Skip to next potential record
          
          // Log every 1000 players found
          if (players.length % 1000 === 0) {
            console.log(`[FBCHUNKSParser] Full scan found ${players.length} players so far...`);
          }
        }
      }
    }
    
    console.log(`[FBCHUNKSParser] Full file scan found ${players.length} players`);
    return players;
  }
}

/**
 * Parse a File object as FBCHUNKS with progress callback
 */
export async function parseSquadFile(
  file: File,
  onProgress?: (progress: ParseProgress) => void
): Promise<FBCHUNKSParseResult> {
  // Report initial stage
  onProgress?.({
    stage: "reading",
    progress: 5,
    totalChunks: 0,
    processedChunks: 0,
    playersFound: 0,
    detail: "Reading file...",
  });

  const buffer = await file.arrayBuffer();
  
  onProgress?.({
    stage: "scanning",
    progress: 15,
    totalChunks: 0,
    processedChunks: 0,
    playersFound: 0,
    detail: "Scanning for chunks...",
  });

  const parser = new FBCHUNKSParser(buffer);
  return parser.parseWithProgress(onProgress);
}

/**
 * Map parsed player to database schema
 */
export function mapPlayerToDatabase(player: ParsedPlayer): Record<string, unknown> {
  // Map position codes to position strings
  const positionMap: Record<number, string> = {
    0: "GK",
    1: "SW",
    2: "RWB",
    3: "RB",
    4: "RCB",
    5: "CB",
    6: "LCB",
    7: "LB",
    8: "LWB",
    9: "RDM",
    10: "CDM",
    11: "LDM",
    12: "RM",
    13: "RCM",
    14: "CM",
    15: "LCM",
    16: "LM",
    17: "RAM",
    18: "CAM",
    19: "LAM",
    20: "RF",
    21: "CF",
    22: "LF",
    23: "RW",
    24: "RS",
    25: "ST",
    26: "LS",
    27: "LW",
  };

  const footMap: Record<number, string> = {
    1: "Right",
    2: "Left",
  };

  return {
    id: player.playerid,
    name: `Player_${player.playerid}`, // Name needs to come from separate name table
    overall_rating: player.overallrating,
    potential_rating: player.potential,
    age: player.age,
    height: player.height ? player.height + 150 : null, // Height stored as offset from 150cm
    weight: player.weight ? player.weight + 40 : null, // Weight stored as offset from 40kg
    position: positionMap[player.preferredposition1 ?? 0] ?? null,
    secondary_position: player.preferredposition2 ? positionMap[player.preferredposition2] : null,
    // Pace
    acceleration: player.acceleration,
    sprint_speed: player.sprintspeed,
    pace: player.acceleration && player.sprintspeed
      ? Math.round((player.acceleration + player.sprintspeed) / 2)
      : null,
    // Shooting
    positioning: player.positioning,
    finishing: player.finishing,
    shot_power: player.shotpower,
    long_shots: player.longshots,
    volleys: player.volleys,
    penalties: player.penalties,
    shooting: player.finishing && player.positioning && player.shotpower && player.longshots
      ? Math.round((player.finishing + player.positioning + player.shotpower + player.longshots) / 4)
      : null,
    // Passing
    vision: player.vision,
    crossing: player.crossing,
    free_kick_accuracy: player.freekickaccuracy,
    short_passing: player.shortpassing,
    long_passing: player.longpassing,
    curve: player.curve,
    passing: player.shortpassing && player.longpassing && player.vision
      ? Math.round((player.shortpassing + player.longpassing + player.vision) / 3)
      : null,
    // Dribbling
    agility: player.agility,
    balance: player.balance,
    reactions: player.reactions,
    ball_control: player.ballcontrol,
    dribbling: player.dribbling,
    composure: player.composure,
    // Defending
    interceptions: player.interceptions,
    heading_accuracy: player.headingaccuracy,
    def_awareness: player.defawareness,
    standing_tackle: player.standingtackle,
    sliding_tackle: player.slidingtackle,
    defending: player.standingtackle && player.slidingtackle && player.defawareness
      ? Math.round((player.standingtackle + player.slidingtackle + player.defawareness) / 3)
      : null,
    // Physical
    jumping: player.jumping,
    stamina: player.stamina,
    strength: player.strength,
    aggression: player.aggression,
    physical: player.stamina && player.strength && player.jumping
      ? Math.round((player.stamina + player.strength + player.jumping) / 3)
      : null,
    // GK
    gk_diving: player.gkdiving,
    gk_handling: player.gkhandling,
    gk_kicking: player.gkkicking,
    gk_positioning: player.gkpositioning,
    gk_reflexes: player.gkreflexes,
    // Other
    weak_foot: player.weakfootabilitytypecode,
    skill_moves: player.skillmoves,
    preferred_foot: footMap[player.preferredfoot ?? 1] ?? "Right",
  };
}
