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
 */
function findNameTables(db: SqlJsDatabase): NameTableInfo[] {
  const tables: NameTableInfo[] = [];
  
  // Get all table names
  const result = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  if (result.length === 0) return tables;
  
  const tableNames = result[0].values.map(row => String(row[0]));
  
  // Look for tables that might contain names
  const namePatterns = [
    /^dcplayernames/i,
    /^playernames/i,
    /^editedplayernames/i,
    /^names/i,
    /language.*name/i,
  ];
  
  for (const tableName of tableNames) {
    for (const pattern of namePatterns) {
      if (pattern.test(tableName)) {
        // Check table structure
        const pragma = db.exec(`PRAGMA table_info(${tableName})`);
        if (pragma.length > 0) {
          const columns = pragma[0].values.map(row => String(row[1]).toLowerCase());
          
          // Find name and ID columns
          const nameCol = columns.find(c => c === 'name' || c === 'commonname' || c === 'playername');
          const idCol = columns.find(c => c === 'nameid' || c === 'id' || c === 'playerid');
          
          if (nameCol && idCol) {
            tables.push({
              tableName,
              nameColumn: nameCol,
              idColumn: idCol,
            });
          }
        }
        break;
      }
    }
  }
  
  return tables;
}

/**
 * Build a name lookup map from name tables
 */
function buildNameLookup(db: SqlJsDatabase, nameTable: NameTableInfo): Map<number, string> {
  const lookup = new Map<number, string>();
  
  try {
    const result = db.exec(`SELECT ${nameTable.idColumn}, ${nameTable.nameColumn} FROM ${nameTable.tableName}`);
    if (result.length > 0) {
      for (const row of result[0].values) {
        const id = Number(row[0]);
        const name = String(row[1] || '').trim();
        if (id > 0 && name) {
          lookup.set(id, name);
        }
      }
    }
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
  
  // Try different player table names
  const playerTables = ['work_players', 'players', 'dcplayers', 'player'];
  
  for (const tableName of playerTables) {
    try {
      // Check if table exists
      const exists = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`);
      if (exists.length === 0 || exists[0].values.length === 0) continue;
      
      // Get column info
      const pragma = db.exec(`PRAGMA table_info(${tableName})`);
      if (pragma.length === 0) continue;
      
      const columns = pragma[0].values.map(row => String(row[1]).toLowerCase());
      
      // Check for required columns
      const playeridCol = columns.find(c => c === 'playerid' || c === 'id');
      const commonnameCol = columns.find(c => c === 'commonnameid');
      const firstnameCol = columns.find(c => c === 'firstnameid');
      const lastnameCol = columns.find(c => c === 'lastnameid');
      
      if (!playeridCol) continue;
      
      // Build query
      const selectCols = [playeridCol];
      if (commonnameCol) selectCols.push(commonnameCol);
      if (firstnameCol) selectCols.push(firstnameCol);
      if (lastnameCol) selectCols.push(lastnameCol);
      
      const result = db.exec(`SELECT ${selectCols.join(', ')} FROM ${tableName}`);
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
      const exists = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`);
      if (exists.length === 0 || exists[0].values.length === 0) continue;
      
      const pragma = db.exec(`PRAGMA table_info(${tableName})`);
      if (pragma.length === 0) continue;
      
      const columns = pragma[0].values.map(row => String(row[1]).toLowerCase());
      
      const playeridCol = columns.find(c => c === 'playerid');
      const firstnameCol = columns.find(c => c === 'firstname');
      const surnameCol = columns.find(c => c === 'surname');
      const commonnameCol = columns.find(c => c === 'commonname');
      
      if (!playeridCol) continue;
      
      const selectCols = [playeridCol];
      if (firstnameCol) selectCols.push(firstnameCol);
      if (surnameCol) selectCols.push(surnameCol);
      if (commonnameCol) selectCols.push(commonnameCol);
      
      const result = db.exec(`SELECT ${selectCols.join(', ')} FROM ${tableName}`);
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
        
        const firstname = indexes.firstname >= 0 ? String(row[indexes.firstname] || '').trim() : undefined;
        const surname = indexes.surname >= 0 ? String(row[indexes.surname] || '').trim() : undefined;
        const commonname = indexes.commonname >= 0 ? String(row[indexes.commonname] || '').trim() : undefined;
        
        // Build fullname
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
            firstname: firstname || undefined,
            surname: surname || undefined,
            commonname: commonname || undefined,
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
