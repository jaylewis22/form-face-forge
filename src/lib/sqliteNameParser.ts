/**
 * SQLite Name Parser Utility
 * Parses EA FC compdata_local.sqlite files to extract player names
 * 
 * EA FC stores player names using ID references:
 * - Players have commonnameid, firstnameid, lastnameid
 * - These reference separate name tables (typically with language suffixes)
 */

import initSqlJs, { type Database as SqlJsDatabase, type SqlJsStatic } from 'sql.js';
import { type PlayerName, type PlayerNameMap } from './playerNameMapping';

let SQL: SqlJsStatic | null = null;

/**
 * Initialize SQL.js (loads the WASM module)
 */
async function initSQL(): Promise<SqlJsStatic> {
  if (!SQL) {
    SQL = await initSqlJs({
      // Load from CDN
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });
  }
  return SQL;
}

interface NameTableInfo {
  tableName: string;
  nameColumn: string;
  idColumn: string;
}

interface PlayerNameIds {
  playerid: number;
  commonnameid: number | null;
  firstnameid: number | null;
  lastnameid: number | null;
}

/**
 * Find name tables in the database
 * Priority order:
 * 1. work_playernames (EA FC native format)
 * 2. dcplayernames, playernames, etc. (FET export formats)
 */
function findNameTables(db: SqlJsDatabase): NameTableInfo[] {
  const tables: NameTableInfo[] = [];
  
  // Get all table names
  const result = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  if (result.length === 0) return tables;
  
  const tableNames = result[0].values.map(row => String(row[0]));
  
  // Priority-ordered table patterns (work_playernames is preferred)
  const namePatterns = [
    /^work_playernames$/i,    // EA FC native (highest priority)
    /^dcplayernames/i,
    /^playernames/i,
    /^editedplayernames/i,
    /^names/i,
    /language.*name/i,
  ];
  
  // Sort tables by priority
  const sortedTables: { tableName: string; priority: number }[] = [];
  
  for (const tableName of tableNames) {
    for (let i = 0; i < namePatterns.length; i++) {
      if (namePatterns[i].test(tableName)) {
        sortedTables.push({ tableName, priority: i });
        break;
      }
    }
  }
  
  // Sort by priority (lower = better)
  sortedTables.sort((a, b) => a.priority - b.priority);
  
  for (const { tableName } of sortedTables) {
    // Check table structure
    const pragma = db.exec(`PRAGMA table_info("${tableName.replace(/"/g, '""')}")`);
    if (pragma.length > 0) {
      const columns = pragma[0].values.map(row => String(row[1]).toLowerCase());
      
      // Find name and ID columns (nameid is the standard for work_playernames)
      const nameCol = columns.find(c => c === 'name' || c === 'commonname' || c === 'playername');
      const idCol = columns.find(c => c === 'nameid' || c === 'id' || c === 'playerid');
      
      if (nameCol && idCol) {
        tables.push({
          tableName,
          nameColumn: nameCol,
          idColumn: idCol,
        });
        console.log(`[SQLiteParser] Found name table: ${tableName} (id: ${idCol}, name: ${nameCol})`);
      }
    }
  }
  
  return tables;
}

/**
 * Check if a name value is valid (not empty, 'nan', etc.)
 * Based on server logic that filters out invalid names
 */
function isValidName(value: unknown): boolean {
  if (value == null) return false;
  const str = String(value).trim().toLowerCase();
  return str !== '' && str !== 'nan' && str !== 'null' && str !== 'undefined';
}

/**
 * Clean a name value (trim whitespace, filter invalid values)
 */
function cleanName(value: unknown): string | undefined {
  if (!isValidName(value)) return undefined;
  return String(value).trim();
}

/**
 * Build a name lookup map from name tables
 */
function buildNameLookup(db: SqlJsDatabase, nameTable: NameTableInfo): Map<number, string> {
  const lookup = new Map<number, string>();
  
  try {
    // Use properly quoted identifiers
    const idCol = `"${nameTable.idColumn.replace(/"/g, '""')}"`;
    const nameCol = `"${nameTable.nameColumn.replace(/"/g, '""')}"`;
    const tableName = `"${nameTable.tableName.replace(/"/g, '""')}"`;
    
    const result = db.exec(`SELECT ${idCol}, ${nameCol} FROM ${tableName}`);
    if (result.length > 0) {
      for (const row of result[0].values) {
        const id = Number(row[0]);
        const name = cleanName(row[1]);
        if (id > 0 && name) {
          lookup.set(id, name);
        }
      }
    }
    console.log(`[SQLiteParser] Built lookup with ${lookup.size} names from ${nameTable.tableName}`);
  } catch (e) {
    console.warn(`[SQLiteParser] Error reading ${nameTable.tableName}:`, e);
  }
  
  return lookup;
}

/**
 * Find the players table and get player name IDs
 */
function getPlayerNameIds(db: SqlJsDatabase): PlayerNameIds[] {
  const players: PlayerNameIds[] = [];
  
  // Try different player table names (work_players is EA FC native)
  const playerTables = ['work_players', 'players', 'dcplayers', 'player'];
  
  for (const tableName of playerTables) {
    try {
      // Check if table exists (properly escaped)
      const exists = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName.replace(/'/g, "''")}'`);
      if (exists.length === 0 || exists[0].values.length === 0) continue;
      
      // Get column info
      const pragma = db.exec(`PRAGMA table_info("${tableName.replace(/"/g, '""')}")`);
      if (pragma.length === 0) continue;
      
      const columns = pragma[0].values.map(row => String(row[1]).toLowerCase());
      const originalColumns = pragma[0].values.map(row => String(row[1]));
      
      // Helper to find column (case-insensitive) and return original name
      const findCol = (names: string[]): string | undefined => {
        for (const name of names) {
          const idx = columns.indexOf(name.toLowerCase());
          if (idx !== -1) return originalColumns[idx];
        }
        return undefined;
      };
      
      // Check for required columns
      const playeridCol = findCol(['playerid', 'id']);
      const commonnameCol = findCol(['commonnameid']);
      const firstnameCol = findCol(['firstnameid']);
      const lastnameCol = findCol(['lastnameid']);
      
      if (!playeridCol) continue;
      
      console.log(`[SQLiteParser] Found player table: ${tableName} with columns:`, {
        playerid: playeridCol,
        commonnameid: commonnameCol,
        firstnameid: firstnameCol,
        lastnameid: lastnameCol,
      });
      
      // Build query with properly quoted identifiers
      const selectCols = [playeridCol];
      if (commonnameCol) selectCols.push(commonnameCol);
      if (firstnameCol) selectCols.push(firstnameCol);
      if (lastnameCol) selectCols.push(lastnameCol);
      
      const quotedCols = selectCols.map(c => `"${c.replace(/"/g, '""')}"`);
      const result = db.exec(`SELECT ${quotedCols.join(', ')} FROM "${tableName.replace(/"/g, '""')}"`);
      if (result.length === 0) continue;
      
      const colIndexes = {
        playerid: 0,
        commonname: commonnameCol ? selectCols.indexOf(commonnameCol) : -1,
        firstname: firstnameCol ? selectCols.indexOf(firstnameCol) : -1,
        lastname: lastnameCol ? selectCols.indexOf(lastnameCol) : -1,
      };
      
      for (const row of result[0].values) {
        const playerid = Number(row[colIndexes.playerid]);
        if (playerid <= 0) continue;
        
        players.push({
          playerid,
          commonnameid: colIndexes.commonname >= 0 ? Number(row[colIndexes.commonname]) || null : null,
          firstnameid: colIndexes.firstname >= 0 ? Number(row[colIndexes.firstname]) || null : null,
          lastnameid: colIndexes.lastname >= 0 ? Number(row[colIndexes.lastname]) || null : null,
        });
      }
      
      console.log(`[SQLiteParser] Found ${players.length} players in ${tableName}`);
      break; // Found players, stop looking
      
    } catch (e) {
      console.warn(`[SQLiteParser] Error reading ${tableName}:`, e);
    }
  }
  
  return players;
}

/**
 * Check if there's a direct player-to-name mapping table
 */
function tryDirectNameTable(db: SqlJsDatabase): PlayerNameMap | null {
  // Some FET exports have editedplayernames with direct mapping
  const directTables = ['editedplayernames', 'customplayernames'];
  
  for (const tableName of directTables) {
    try {
      const escapedName = tableName.replace(/'/g, "''");
      const exists = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${escapedName}'`);
      if (exists.length === 0 || exists[0].values.length === 0) continue;
      
      const quotedTable = `"${tableName.replace(/"/g, '""')}"`;
      const pragma = db.exec(`PRAGMA table_info(${quotedTable})`);
      if (pragma.length === 0) continue;
      
      const columns = pragma[0].values.map(row => String(row[1]).toLowerCase());
      const originalColumns = pragma[0].values.map(row => String(row[1]));
      
      // Helper to find column and return original name
      const findCol = (names: string[]): string | undefined => {
        for (const name of names) {
          const idx = columns.indexOf(name.toLowerCase());
          if (idx !== -1) return originalColumns[idx];
        }
        return undefined;
      };
      
      const playeridCol = findCol(['playerid']);
      const firstnameCol = findCol(['firstname']);
      const surnameCol = findCol(['surname']);
      const commonnameCol = findCol(['commonname']);
      
      if (!playeridCol) continue;
      
      const selectCols = [playeridCol];
      if (firstnameCol) selectCols.push(firstnameCol);
      if (surnameCol) selectCols.push(surnameCol);
      if (commonnameCol) selectCols.push(commonnameCol);
      
      const quotedCols = selectCols.map(c => `"${c.replace(/"/g, '""')}"`);
      const result = db.exec(`SELECT ${quotedCols.join(', ')} FROM ${quotedTable}`);
      if (result.length === 0 || result[0].values.length === 0) continue;
      
      const names = new Map<number, PlayerName>();
      
      const indexes = {
        playerid: 0,
        firstname: firstnameCol ? selectCols.indexOf(firstnameCol) : -1,
        surname: surnameCol ? selectCols.indexOf(surnameCol) : -1,
        commonname: commonnameCol ? selectCols.indexOf(commonnameCol) : -1,
      };
      
      for (const row of result[0].values) {
        const playerid = Number(row[indexes.playerid]);
        if (playerid <= 0) continue;
        
        const firstname = cleanName(row[indexes.firstname]);
        const surname = cleanName(row[indexes.surname]);
        const commonname = cleanName(row[indexes.commonname]);
        
        // Build fullname (prioritize commonname like the server does)
        let fullname: string | undefined;
        if (commonname) {
          fullname = commonname;
        } else if (firstname && surname) {
          fullname = `${firstname} ${surname}`;
        } else if (surname) {
          fullname = surname;
        } else if (firstname) {
          fullname = firstname;
        }
        
        if (fullname) {
          names.set(playerid, {
            playerid,
            firstname,
            surname,
            commonname,
            fullname,
          });
        }
      }
      
      if (names.size > 0) {
        console.log(`[SQLiteParser] Found ${names.size} direct name mappings in ${tableName}`);
        return {
          names,
          totalEntries: names.size,
          source: `sqlite:${tableName}`,
        };
      }
      
    } catch (e) {
      console.warn(`[SQLiteParser] Error reading ${tableName}:`, e);
    }
  }
  
  return null;
}

/**
 * Parse an SQLite file and extract player names
 */
export async function parseSqliteFile(file: File): Promise<PlayerNameMap> {
  console.log(`[SQLiteParser] Parsing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  
  // Initialize SQL.js
  const SQL = await initSQL();
  
  // Read file as ArrayBuffer
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  
  // Open database
  const db = new SQL.Database(data);
  
  try {
    // First, try direct name tables (editedplayernames, etc.)
    const directResult = tryDirectNameTable(db);
    if (directResult && directResult.totalEntries > 0) {
      return directResult;
    }
    
    // Find name tables
    const nameTables = findNameTables(db);
    console.log(`[SQLiteParser] Found ${nameTables.length} name tables:`, nameTables.map(t => t.tableName));
    
    if (nameTables.length === 0) {
      throw new Error('No name tables found in SQLite database');
    }
    
    // Build name lookup from first (best) table
    const nameLookup = buildNameLookup(db, nameTables[0]);
    console.log(`[SQLiteParser] Built lookup with ${nameLookup.size} names`);
    
    // Get player name IDs
    const playerIds = getPlayerNameIds(db);
    console.log(`[SQLiteParser] Found ${playerIds.length} players with name IDs`);
    
    // Build player name map
    const names = new Map<number, PlayerName>();
    
    for (const player of playerIds) {
      let fullname: string | undefined;
      let commonname: string | undefined;
      let firstname: string | undefined;
      let surname: string | undefined;
      
      // Try common name first (preferred)
      if (player.commonnameid && nameLookup.has(player.commonnameid)) {
        commonname = nameLookup.get(player.commonnameid);
        fullname = commonname;
      }
      
      // Get first and last names
      if (player.firstnameid && nameLookup.has(player.firstnameid)) {
        firstname = nameLookup.get(player.firstnameid);
      }
      if (player.lastnameid && nameLookup.has(player.lastnameid)) {
        surname = nameLookup.get(player.lastnameid);
      }
      
      // Build fullname if not from common name
      if (!fullname) {
        if (firstname && surname) {
          fullname = `${firstname} ${surname}`;
        } else if (surname) {
          fullname = surname;
        } else if (firstname) {
          fullname = firstname;
        }
      }
      
      if (fullname) {
        names.set(player.playerid, {
          playerid: player.playerid,
          firstname,
          surname,
          commonname,
          fullname,
        });
      }
    }
    
    console.log(`[SQLiteParser] Resolved ${names.size} player names`);
    
    return {
      names,
      totalEntries: names.size,
      source: `sqlite:${file.name}`,
    };
    
  } finally {
    db.close();
  }
}

/**
 * Check if a file is an SQLite database
 */
export function isSqliteFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith('.sqlite') || name.endsWith('.db') || name.endsWith('.sqlite3');
}

/**
 * Detect SQLite by reading the file header
 */
export async function detectSqlite(file: File): Promise<boolean> {
  try {
    const header = await file.slice(0, 16).arrayBuffer();
    const view = new Uint8Array(header);
    
    // SQLite header: "SQLite format 3\0"
    const signature = String.fromCharCode(...view.slice(0, 15));
    return signature === 'SQLite format 3';
  } catch {
    return false;
  }
}
