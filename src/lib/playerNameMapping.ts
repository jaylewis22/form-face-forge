/**
 * Player Name Mapping Utility
 * Maps player IDs to real names using reference files from FIFA Editor Tool (FET)
 * 
 * Supports multiple reference file formats:
 * - players.txt: Full player table with playerid and name fields
 * - playernames.txt: Name lookup table with nameid, commentaryid, name
 * - editedplayernames.txt: Direct mapping with playerid, firstname, surname, commonname
 */

export interface PlayerName {
  playerid: number;
  firstname?: string;
  surname?: string;
  commonname?: string;
  fullname?: string;
}

export interface PlayerNameMap {
  names: Map<number, PlayerName>;
  totalEntries: number;
  source: string;
}

// Storage key for persisted name mappings
const STORAGE_KEY = 'fc_player_name_map';

/**
 * Parse a tab-separated or comma-separated reference file
 */
function parseDelimitedFile(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return { headers: [], rows: [] };
  }

  // Detect delimiter (tab or comma)
  const firstLine = lines[0];
  const delimiter = firstLine.includes('\t') ? '\t' : ',';

  const headers = firstLine.split(delimiter).map(h => h.trim().toLowerCase());
  const rows = lines.slice(1).map(line => line.split(delimiter).map(v => v.trim()));

  return { headers, rows };
}

/**
 * Parse players.txt format
 * Expected fields: playerid, firstname, surname, commonname, or just playerid + name
 */
function parsePlayersFile(content: string): PlayerNameMap {
  const { headers, rows } = parseDelimitedFile(content);
  const names = new Map<number, PlayerName>();

  // Find relevant column indices
  const playeridIdx = headers.findIndex(h => h === 'playerid' || h === 'id');
  const firstnameIdx = headers.findIndex(h => h === 'firstname' || h === 'first_name');
  const surnameIdx = headers.findIndex(h => h === 'surname' || h === 'lastname' || h === 'last_name');
  const commonnameIdx = headers.findIndex(h => h === 'commonname' || h === 'common_name' || h === 'known_as');
  const nameIdx = headers.findIndex(h => h === 'name' || h === 'fullname' || h === 'full_name');

  if (playeridIdx === -1) {
    console.warn('[PlayerNameMapping] No playerid column found');
    return { names, totalEntries: 0, source: 'unknown' };
  }

  for (const row of rows) {
    const playerid = parseInt(row[playeridIdx], 10);
    if (isNaN(playerid) || playerid <= 0) continue;

    const entry: PlayerName = { playerid };

    if (firstnameIdx >= 0) entry.firstname = row[firstnameIdx] || undefined;
    if (surnameIdx >= 0) entry.surname = row[surnameIdx] || undefined;
    if (commonnameIdx >= 0) entry.commonname = row[commonnameIdx] || undefined;
    if (nameIdx >= 0) entry.fullname = row[nameIdx] || undefined;

    // Build fullname if not present
    if (!entry.fullname) {
      if (entry.commonname) {
        entry.fullname = entry.commonname;
      } else if (entry.firstname && entry.surname) {
        entry.fullname = `${entry.firstname} ${entry.surname}`;
      } else if (entry.surname) {
        entry.fullname = entry.surname;
      } else if (entry.firstname) {
        entry.fullname = entry.firstname;
      }
    }

    if (entry.fullname) {
      names.set(playerid, entry);
    }
  }

  return { names, totalEntries: names.size, source: 'players.txt' };
}

/**
 * Parse editedplayernames.txt format
 * Fields: firstname, commonname, playerjerseyname, surname, playerid
 */
function parseEditedPlayerNamesFile(content: string): PlayerNameMap {
  const { headers, rows } = parseDelimitedFile(content);
  const names = new Map<number, PlayerName>();

  const playeridIdx = headers.findIndex(h => h === 'playerid');
  const firstnameIdx = headers.findIndex(h => h === 'firstname');
  const surnameIdx = headers.findIndex(h => h === 'surname');
  const commonnameIdx = headers.findIndex(h => h === 'commonname');

  if (playeridIdx === -1) {
    return { names, totalEntries: 0, source: 'unknown' };
  }

  for (const row of rows) {
    const playerid = parseInt(row[playeridIdx], 10);
    if (isNaN(playerid) || playerid <= 0) continue;

    const entry: PlayerName = { playerid };

    if (firstnameIdx >= 0) entry.firstname = row[firstnameIdx] || undefined;
    if (surnameIdx >= 0) entry.surname = row[surnameIdx] || undefined;
    if (commonnameIdx >= 0) entry.commonname = row[commonnameIdx] || undefined;

    // Build fullname
    if (entry.commonname) {
      entry.fullname = entry.commonname;
    } else if (entry.firstname && entry.surname) {
      entry.fullname = `${entry.firstname} ${entry.surname}`;
    } else if (entry.surname) {
      entry.fullname = entry.surname;
    }

    if (entry.fullname) {
      names.set(playerid, entry);
    }
  }

  return { names, totalEntries: names.size, source: 'editedplayernames.txt' };
}

/**
 * Parse JSON format (FET export)
 * Can be an array of player objects or an object with players array
 */
function parseJsonFile(content: string): PlayerNameMap {
  const names = new Map<number, PlayerName>();
  
  try {
    const data = JSON.parse(content);
    let players: Record<string, unknown>[] = [];

    // Handle different JSON structures
    if (Array.isArray(data)) {
      players = data;
    } else if (data.players && Array.isArray(data.players)) {
      players = data.players;
    } else if (data.data && Array.isArray(data.data)) {
      players = data.data;
    }

    for (const player of players) {
      const playerid = Number(player.playerid || player.id || player.player_id);
      if (isNaN(playerid) || playerid <= 0) continue;

      const entry: PlayerName = { playerid };

      entry.firstname = String(player.firstname || player.first_name || '') || undefined;
      entry.surname = String(player.surname || player.lastname || player.last_name || '') || undefined;
      entry.commonname = String(player.commonname || player.common_name || player.known_as || '') || undefined;
      entry.fullname = String(player.name || player.fullname || player.full_name || '') || undefined;

      // Build fullname if not present
      if (!entry.fullname) {
        if (entry.commonname) {
          entry.fullname = entry.commonname;
        } else if (entry.firstname && entry.surname) {
          entry.fullname = `${entry.firstname} ${entry.surname}`;
        } else if (entry.surname) {
          entry.fullname = entry.surname;
        }
      }

      if (entry.fullname) {
        names.set(playerid, entry);
      }
    }
  } catch (e) {
    console.error('[PlayerNameMapping] Failed to parse JSON:', e);
  }

  return { names, totalEntries: names.size, source: 'json' };
}

/**
 * Auto-detect file format and parse accordingly
 */
export function parsePlayerNamesFile(content: string, filename?: string): PlayerNameMap {
  const lowerFilename = (filename || '').toLowerCase();

  // Try to detect format from filename
  if (lowerFilename.includes('editedplayernames')) {
    return parseEditedPlayerNamesFile(content);
  }

  // Try JSON first if content starts with [ or {
  const trimmed = content.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    return parseJsonFile(content);
  }

  // Default to players.txt format (tab/comma delimited)
  return parsePlayersFile(content);
}

/**
 * Load name mapping from a File object
 */
export async function loadPlayerNamesFromFile(file: File): Promise<PlayerNameMap> {
  const content = await file.text();
  return parsePlayerNamesFile(content, file.name);
}

/**
 * Save name mapping to localStorage for persistence
 */
export function savePlayerNameMap(map: PlayerNameMap): void {
  try {
    const serializable = {
      entries: Array.from(map.names.entries()),
      totalEntries: map.totalEntries,
      source: map.source,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    console.log(`[PlayerNameMapping] Saved ${map.totalEntries} names to localStorage`);
  } catch (e) {
    console.error('[PlayerNameMapping] Failed to save to localStorage:', e);
  }
}

/**
 * Load name mapping from localStorage
 */
export function loadPlayerNameMap(): PlayerNameMap | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);
    const names = new Map<number, PlayerName>(data.entries);

    console.log(`[PlayerNameMapping] Loaded ${names.size} names from localStorage`);

    return {
      names,
      totalEntries: data.totalEntries || names.size,
      source: data.source || 'localStorage',
    };
  } catch (e) {
    console.error('[PlayerNameMapping] Failed to load from localStorage:', e);
    return null;
  }
}

/**
 * Clear stored name mapping
 */
export function clearPlayerNameMap(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log('[PlayerNameMapping] Cleared stored name mapping');
}

/**
 * Get the display name for a player by ID
 */
export function getPlayerName(map: PlayerNameMap | null, playerid: number): string {
  if (!map) return `Player_${playerid}`;
  const entry = map.names.get(playerid);
  return entry?.fullname || `Player_${playerid}`;
}

/**
 * Apply name mapping to an array of player records
 */
export function applyNameMapping<T extends { id?: number; playerid?: number; name?: string }>(
  players: T[],
  map: PlayerNameMap | null
): T[] {
  if (!map || map.names.size === 0) return players;

  return players.map(player => {
    const id = player.playerid ?? player.id;
    if (!id) return player;

    const nameEntry = map.names.get(id);
    if (!nameEntry?.fullname) return player;

    return {
      ...player,
      name: nameEntry.fullname,
    };
  });
}

/**
 * Get statistics about the name mapping coverage
 */
export function getNameMappingStats(
  map: PlayerNameMap | null,
  playerIds: number[]
): { total: number; matched: number; unmatched: number; coverage: number } {
  if (!map) {
    return { total: playerIds.length, matched: 0, unmatched: playerIds.length, coverage: 0 };
  }

  let matched = 0;
  for (const id of playerIds) {
    if (map.names.has(id)) matched++;
  }

  return {
    total: playerIds.length,
    matched,
    unmatched: playerIds.length - matched,
    coverage: playerIds.length > 0 ? (matched / playerIds.length) * 100 : 0,
  };
}
