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
// Based on documented EA FC player schema
const PLAYER_SCHEMA: Record<string, { offset: number; size: 1 | 2 | 4 }> = {
  playerid: { offset: 0, size: 4 },
  // Ratings at standard offsets
  overallrating: { offset: 50, size: 1 },
  potential: { offset: 51, size: 1 },
  age: { offset: 52, size: 1 },
  height: { offset: 53, size: 1 },
  weight: { offset: 54, size: 1 },
  // Position fields
  preferredposition1: { offset: 55, size: 1 },
  preferredposition2: { offset: 56, size: 1 },
  preferredposition3: { offset: 57, size: 1 },
  preferredposition4: { offset: 58, size: 1 },
  // Nationality
  nationality: { offset: 12, size: 2 },
  // Pace (60-61)
  acceleration: { offset: 60, size: 1 },
  sprintspeed: { offset: 61, size: 1 },
  // Shooting (62-67)
  positioning: { offset: 62, size: 1 },
  finishing: { offset: 63, size: 1 },
  shotpower: { offset: 64, size: 1 },
  longshots: { offset: 65, size: 1 },
  volleys: { offset: 66, size: 1 },
  penalties: { offset: 67, size: 1 },
  // Passing (68-73)
  vision: { offset: 68, size: 1 },
  crossing: { offset: 69, size: 1 },
  freekickaccuracy: { offset: 70, size: 1 },
  shortpassing: { offset: 71, size: 1 },
  longpassing: { offset: 72, size: 1 },
  curve: { offset: 73, size: 1 },
  // Dribbling (74-79)
  agility: { offset: 74, size: 1 },
  balance: { offset: 75, size: 1 },
  reactions: { offset: 76, size: 1 },
  ballcontrol: { offset: 77, size: 1 },
  dribbling: { offset: 78, size: 1 },
  composure: { offset: 79, size: 1 },
  // Defending (80-84)
  interceptions: { offset: 80, size: 1 },
  headingaccuracy: { offset: 81, size: 1 },
  defawareness: { offset: 82, size: 1 },
  standingtackle: { offset: 83, size: 1 },
  slidingtackle: { offset: 84, size: 1 },
  // Physical (85-88)
  jumping: { offset: 85, size: 1 },
  stamina: { offset: 86, size: 1 },
  strength: { offset: 87, size: 1 },
  aggression: { offset: 88, size: 1 },
  // GK (89-93)
  gkdiving: { offset: 89, size: 1 },
  gkhandling: { offset: 90, size: 1 },
  gkkicking: { offset: 91, size: 1 },
  gkpositioning: { offset: 92, size: 1 },
  gkreflexes: { offset: 93, size: 1 },
  // Additional
  weakfootabilitytypecode: { offset: 94, size: 1 },
  skillmoves: { offset: 95, size: 1 },
  preferredfoot: { offset: 96, size: 1 },
};

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
   * Parse chunk directory - scan header for chunk table location
   */
  private parseChunkDirectory(): Chunk[] {
    const chunks: Chunk[] = [];
    
    // FBCHUNKS header structure:
    // 0x00-0x07: "FBCHUNKS" magic
    // 0x08-0x0B: Version/flags
    // 0x0C-0x0F: Total file size or chunk count
    // 0x10+: Variable header data, chunk directory location varies
    
    // Try to find chunk count from header
    let chunkCount = 0;
    let dirOffset = 0;
    
    // Method 1: Check common header positions for chunk count
    if (this.buffer.byteLength >= 0x20) {
      // Try offset 0x0C (common location for count)
      const potentialCount1 = this.view.getUint32(0x0C, true);
      // Try offset 0x10
      const potentialCount2 = this.view.getUint32(0x10, true);
      // Try offset 0x14
      const potentialCount3 = this.view.getUint32(0x14, true);
      
      // Use reasonable count (1-1000 chunks expected)
      if (potentialCount1 > 0 && potentialCount1 < 1000) {
        chunkCount = potentialCount1;
        dirOffset = 0x18; // Directory likely starts after this
      } else if (potentialCount2 > 0 && potentialCount2 < 1000) {
        chunkCount = potentialCount2;
        dirOffset = 0x20;
      } else if (potentialCount3 > 0 && potentialCount3 < 1000) {
        chunkCount = potentialCount3;
        dirOffset = 0x20;
      }
    }
    
    console.log(`[FBCHUNKSParser] Header analysis: potentialChunkCount=${chunkCount}, dirOffset=0x${dirOffset.toString(16)}`);
    
    // Method 2: Scan for chunk directory by looking for valid offset patterns
    // Chunk entries typically have: [flags, offset, uncompressed_size, compressed_size]
    if (chunkCount === 0 || dirOffset === 0) {
      // Scan the first 32KB for directory-like patterns
      const SCAN_LIMIT = Math.min(0x8000, this.buffer.byteLength);
      const ENTRY_SIZE = 16;
      
      for (let pos = 0x10; pos < SCAN_LIMIT - ENTRY_SIZE * 10; pos += 4) {
        // Check if this looks like a chunk directory start
        let validEntries = 0;
        for (let i = 0; i < 10 && pos + (i + 1) * ENTRY_SIZE <= this.buffer.byteLength; i++) {
          const entryPos = pos + i * ENTRY_SIZE;
          const offset = this.view.getUint32(entryPos + 4, true);
          const size = this.view.getUint32(entryPos + 8, true);
          
          // Valid chunk: offset > header, size reasonable, within file bounds
          if (offset >= 0x1000 && offset < this.buffer.byteLength && 
              size > 0 && size < 0x100000 && offset + size <= this.buffer.byteLength) {
            validEntries++;
          }
        }
        
        if (validEntries >= 5) {
          dirOffset = pos;
          console.log(`[FBCHUNKSParser] Found likely chunk directory at 0x${pos.toString(16)} (${validEntries} valid entries)`);
          break;
        }
      }
    }
    
    // If still no directory found, fall back to original fixed offset
    if (dirOffset === 0) {
      dirOffset = 0x1530;
      console.log(`[FBCHUNKSParser] Using fallback directory offset 0x${dirOffset.toString(16)}`);
    }
    
    // Parse chunk directory entries
    const MAX_CHUNKS = 600;
    const ENTRY_SIZE = 16;

    for (let i = 0; i < MAX_CHUNKS; i++) {
      const entryOffset = dirOffset + i * ENTRY_SIZE;
      
      if (entryOffset + ENTRY_SIZE > this.buffer.byteLength) break;

      try {
        const chunkOffset = this.view.getUint32(entryOffset + 4, true);
        const chunkSize = this.view.getUint32(entryOffset + 8, true);
        const compressedSize = this.view.getUint32(entryOffset + 12, true);

        // Stop at first null/invalid entry
        if (chunkOffset === 0 && chunkSize === 0) break;

        // Validate chunk bounds
        if (
          chunkOffset > 0 &&
          chunkSize > 0 &&
          chunkOffset < this.buffer.byteLength &&
          chunkOffset + Math.min(chunkSize, compressedSize || chunkSize) <= this.buffer.byteLength
        ) {
          chunks.push({
            index: i,
            offset: chunkOffset,
            size: chunkSize,
            compressedSize: compressedSize,
            isCompressed: compressedSize > 0 && compressedSize < chunkSize,
          });
        }
      } catch {
        // Skip invalid entries
      }
    }
    
    // Method 3: If directory parsing failed, scan file for player data directly
    if (chunks.length === 0) {
      console.log('[FBCHUNKSParser] Directory parsing failed, scanning for player data patterns...');
      return this.scanForPlayerChunks();
    }

    return chunks;
  }
  
  /**
   * Scan file for player data patterns when directory parsing fails
   */
  private scanForPlayerChunks(): Chunk[] {
    const chunks: Chunk[] = [];
    const SCAN_STEP = 0x1000; // 4KB steps
    const MARKER = [0xdf, 0x00];
    
    // Look for regions with DF 00 markers (player record delimiters)
    for (let pos = 0x1000; pos < this.buffer.byteLength - 0x1000; pos += SCAN_STEP) {
      const region = this.bytes.slice(pos, Math.min(pos + 0x2000, this.buffer.byteLength));
      let markerCount = 0;
      
      for (let i = 0; i < region.length - 1; i++) {
        if (region[i] === MARKER[0] && region[i + 1] === MARKER[1]) {
          markerCount++;
        }
      }
      
      // If this region has multiple DF 00 markers, it likely contains player data
      if (markerCount >= 3) {
        chunks.push({
          index: chunks.length,
          offset: pos,
          size: 0x2000, // Scan 8KB region
          isCompressed: false,
        });
        console.log(`[FBCHUNKSParser] Found player data region at 0x${pos.toString(16)} (${markerCount} markers)`);
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
   * Looks for DF 00 record delimiters
   */
  private extractPlayerRecords(chunk: Chunk): ParsedPlayer[] {
    const players: ParsedPlayer[] = [];
    const RECORD_SIZE = 144;
    const MARKER = [0xdf, 0x00];

    // Get chunk data
    const actualSize = chunk.isCompressed
      ? chunk.compressedSize ?? chunk.size
      : chunk.size;
    
    if (chunk.offset + actualSize > this.buffer.byteLength) {
      return players;
    }

    const chunkData = this.bytes.slice(chunk.offset, chunk.offset + actualSize);

    // Scan for DF 00 markers
    for (let i = 0; i < chunkData.length - RECORD_SIZE - 2; i++) {
      if (chunkData[i] === MARKER[0] && chunkData[i + 1] === MARKER[1]) {
        const recordStart = i + 2;
        if (recordStart + RECORD_SIZE <= chunkData.length) {
          const recordBytes = chunkData.slice(recordStart, recordStart + RECORD_SIZE);
          const player = this.parsePlayerRecord(recordBytes);
          
          // Validate player data
          if (this.isValidPlayer(player)) {
            players.push(player);
          }
          
          i += RECORD_SIZE; // Skip to next potential record
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
          if (schema.size === 1) {
            (player as Record<string, number>)[field] = bytes[schema.offset];
          } else if (schema.size === 2) {
            (player as Record<string, number>)[field] = view.getUint16(schema.offset, true);
          } else if (schema.size === 4) {
            (player as Record<string, number>)[field] = view.getUint32(schema.offset, true);
          }
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
    const chunksToProcess = [...mediumChunks, ...smallChunks];
    const allPlayers: ParsedPlayer[] = [];

    console.log(`[FBCHUNKSParser] Found ${chunks.length} chunks, ${mediumChunks.length} MEDIUM, ${smallChunks.length} SMALL`);

    onProgress?.({
      stage: "parsing",
      progress: 30,
      totalChunks: chunks.length,
      processedChunks: 0,
      playersFound: 0,
      detail: `Found ${chunks.length} chunks (${mediumChunks.length} MEDIUM, ${smallChunks.length} SMALL)`,
    });

    // Extract players from MEDIUM and SMALL chunks
    let processedCount = 0;
    for (const chunk of chunksToProcess) {
      const players = this.extractPlayerRecords(chunk);
      allPlayers.push(...players);
      processedCount++;

      // Report progress every 10 chunks
      if (processedCount % 10 === 0 || processedCount === chunksToProcess.length) {
        const progressPct = 30 + Math.floor((processedCount / chunksToProcess.length) * 50);
        onProgress?.({
          stage: "extracting",
          progress: progressPct,
          totalChunks: chunks.length,
          processedChunks: processedCount,
          playersFound: allPlayers.length,
          detail: `Processing chunk ${processedCount}/${chunksToProcess.length}...`,
        });
      }
    }

    onProgress?.({
      stage: "extracting",
      progress: 85,
      totalChunks: chunks.length,
      processedChunks: chunksToProcess.length,
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
      processedChunks: chunksToProcess.length,
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
