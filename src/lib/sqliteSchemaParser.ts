/**
 * SQLite Schema Parser
 * Introspects loaded SQLite databases to extract schema metadata:
 * - Tables (with raw/work pairing detection)
 * - Columns (name, type, nullable, primary key)
 * - Foreign keys
 * - Row counts
 * - Entity groupings (players, teams, leagues, nations)
 */

import initSqlJs, { type Database as SqlJsDatabase, type SqlJsStatic } from 'sql.js';

let SQL: SqlJsStatic | null = null;

async function initSQL(): Promise<SqlJsStatic> {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });
  }
  return SQL;
}

// ============ Types ============

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  defaultValue: string | null;
}

export interface ForeignKey {
  fromColumn: string;
  toTable: string;
  toColumn: string;
}

export interface IndexInfo {
  name: string;
  columns: string[];
  unique: boolean;
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  primaryKeys: string[];
  foreignKeys: ForeignKey[];
  indexes: IndexInfo[];
  rowCount: number;
  group: TableGroup;
  variant: 'raw' | 'work' | 'app' | 'meta';
  pairedTable: string | null; // raw_X <-> work_X pairing
}

export interface TableSummary {
  name: string;
  rowCount: number;
  group: TableGroup;
  variant: 'raw' | 'work' | 'app' | 'meta';
  pairedTable: string | null;
}

export type TableGroup = 
  | 'players'
  | 'teams'
  | 'leagues'
  | 'nations'
  | 'formations'
  | 'links'
  | 'language'
  | 'kits'
  | 'stadiums'
  | 'meta'
  | 'other';

export interface SchemaGraph {
  nodes: { id: string; label: string; group: TableGroup }[];
  edges: { from: string; to: string; label: string }[];
}

export interface LoadedSchema {
  tables: Map<string, TableInfo>;
  groups: Map<TableGroup, string[]>;
  pairs: Map<string, string>; // raw_X -> work_X or vice versa
  graph: SchemaGraph;
}

// ============ Entity Detection ============

const GROUP_PATTERNS: { group: TableGroup; patterns: RegExp[] }[] = [
  { group: 'players', patterns: [/player/i, /^(raw_|work_)?players$/i, /playernames/i] },
  { group: 'teams', patterns: [/^(raw_|work_)?teams$/i, /^team(?!player)/i] },
  { group: 'leagues', patterns: [/league/i] },
  { group: 'nations', patterns: [/nation/i, /country/i] },
  { group: 'formations', patterns: [/formation/i, /tactic/i] },
  { group: 'kits', patterns: [/kit/i, /jersey/i] },
  { group: 'stadiums', patterns: [/stadium/i] },
  { group: 'links', patterns: [/link/i, /teamplayer/i, /leagueteam/i, /teamnation/i] },
  { group: 'language', patterns: [/language/i, /string/i, /locale/i] },
  { group: 'meta', patterns: [/^export_/i, /^audit/i, /^config/i, /^setting/i, /^mapping/i] },
];

function detectTableGroup(tableName: string): TableGroup {
  const lowerName = tableName.toLowerCase();
  
  for (const { group, patterns } of GROUP_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(lowerName)) {
        return group;
      }
    }
  }
  
  return 'other';
}

function detectVariant(tableName: string): 'raw' | 'work' | 'app' | 'meta' {
  const lower = tableName.toLowerCase();
  if (lower.startsWith('raw_')) return 'raw';
  if (lower.startsWith('work_')) return 'work';
  if (/^(export_|audit_|config_|setting_|mapping)/.test(lower)) return 'meta';
  return 'app';
}

function findPairedTable(tableName: string, allTables: string[]): string | null {
  const lower = tableName.toLowerCase();
  
  if (lower.startsWith('raw_')) {
    const workName = 'work_' + lower.slice(4);
    const match = allTables.find(t => t.toLowerCase() === workName);
    return match || null;
  }
  
  if (lower.startsWith('work_')) {
    const rawName = 'raw_' + lower.slice(5);
    const match = allTables.find(t => t.toLowerCase() === rawName);
    return match || null;
  }
  
  return null;
}

// ============ Schema Extraction ============

function getTableColumns(db: SqlJsDatabase, tableName: string): ColumnInfo[] {
  const columns: ColumnInfo[] = [];
  
  try {
    const quoted = `"${tableName.replace(/"/g, '""')}"`;
    const result = db.exec(`PRAGMA table_info(${quoted})`);
    
    if (result.length > 0) {
      for (const row of result[0].values) {
        columns.push({
          name: String(row[1]),
          type: String(row[2]) || 'TEXT',
          nullable: row[3] === 0,
          primaryKey: row[5] === 1,
          defaultValue: row[4] != null ? String(row[4]) : null,
        });
      }
    }
  } catch (e) {
    console.warn(`[SchemaParser] Error reading columns for ${tableName}:`, e);
  }
  
  return columns;
}

function getTableForeignKeys(db: SqlJsDatabase, tableName: string): ForeignKey[] {
  const fks: ForeignKey[] = [];
  
  try {
    const quoted = `"${tableName.replace(/"/g, '""')}"`;
    const result = db.exec(`PRAGMA foreign_key_list(${quoted})`);
    
    if (result.length > 0) {
      for (const row of result[0].values) {
        fks.push({
          toTable: String(row[2]),
          fromColumn: String(row[3]),
          toColumn: String(row[4]),
        });
      }
    }
  } catch (e) {
    console.warn(`[SchemaParser] Error reading FKs for ${tableName}:`, e);
  }
  
  return fks;
}

function getTableIndexes(db: SqlJsDatabase, tableName: string): IndexInfo[] {
  const indexes: IndexInfo[] = [];
  
  try {
    const quoted = `"${tableName.replace(/"/g, '""')}"`;
    const result = db.exec(`PRAGMA index_list(${quoted})`);
    
    if (result.length > 0) {
      for (const row of result[0].values) {
        const indexName = String(row[1]);
        const unique = row[2] === 1;
        
        // Get columns in this index
        const colResult = db.exec(`PRAGMA index_info("${indexName.replace(/"/g, '""')}")`);
        const columns: string[] = [];
        
        if (colResult.length > 0) {
          for (const colRow of colResult[0].values) {
            columns.push(String(colRow[2]));
          }
        }
        
        if (columns.length > 0) {
          indexes.push({ name: indexName, columns, unique });
        }
      }
    }
  } catch (e) {
    console.warn(`[SchemaParser] Error reading indexes for ${tableName}:`, e);
  }
  
  return indexes;
}

function getTableRowCount(db: SqlJsDatabase, tableName: string): number {
  try {
    const quoted = `"${tableName.replace(/"/g, '""')}"`;
    const result = db.exec(`SELECT COUNT(*) FROM ${quoted}`);
    
    if (result.length > 0 && result[0].values.length > 0) {
      return Number(result[0].values[0][0]) || 0;
    }
  } catch (e) {
    console.warn(`[SchemaParser] Error counting rows for ${tableName}:`, e);
  }
  
  return 0;
}

function getAllTableNames(db: SqlJsDatabase): string[] {
  const result = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  
  if (result.length === 0) return [];
  return result[0].values.map(row => String(row[0]));
}

function getSampleRows(db: SqlJsDatabase, tableName: string, limit = 3): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  
  try {
    const quoted = `"${tableName.replace(/"/g, '""')}"`;
    const result = db.exec(`SELECT * FROM ${quoted} LIMIT ${limit}`);
    
    if (result.length > 0 && result[0].values.length > 0) {
      const columns = result[0].columns;
      
      for (const row of result[0].values) {
        const obj: Record<string, unknown> = {};
        columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        rows.push(obj);
      }
    }
  } catch (e) {
    console.warn(`[SchemaParser] Error getting sample rows for ${tableName}:`, e);
  }
  
  return rows;
}

// ============ Relationship Inference ============

/**
 * Infer relationships based on naming conventions when explicit FKs aren't defined
 */
function inferRelationships(tables: Map<string, TableInfo>): ForeignKey[] {
  const inferred: ForeignKey[] = [];
  const tableNames = Array.from(tables.keys());
  
  // Common ID column patterns -> target table
  const idPatterns: { pattern: RegExp; targetSuffix: string }[] = [
    { pattern: /^playerid$/i, targetSuffix: 'players' },
    { pattern: /^teamid$/i, targetSuffix: 'teams' },
    { pattern: /^leagueid$/i, targetSuffix: 'leagues' },
    { pattern: /^nationid$/i, targetSuffix: 'nations' },
    { pattern: /^stadiumid$/i, targetSuffix: 'stadiums' },
    { pattern: /^formationid$/i, targetSuffix: 'formations' },
    { pattern: /^kitid$/i, targetSuffix: 'kits' },
    { pattern: /^nameid$/i, targetSuffix: 'playernames' },
    { pattern: /^commonnameid$/i, targetSuffix: 'playernames' },
    { pattern: /^firstnameid$/i, targetSuffix: 'playernames' },
    { pattern: /^lastnameid$/i, targetSuffix: 'playernames' },
  ];
  
  for (const [tableName, tableInfo] of tables) {
    const prefix = tableName.match(/^(raw_|work_)/i)?.[0] || '';
    
    for (const column of tableInfo.columns) {
      for (const { pattern, targetSuffix } of idPatterns) {
        if (pattern.test(column.name)) {
          // Look for matching target table with same prefix
          const targetWithPrefix = prefix + targetSuffix;
          const targetTable = tableNames.find(
            t => t.toLowerCase() === targetWithPrefix.toLowerCase() ||
                 t.toLowerCase() === targetSuffix.toLowerCase()
          );
          
          if (targetTable && targetTable !== tableName) {
            // Find the ID column in target
            const targetInfo = tables.get(targetTable);
            const targetIdCol = targetInfo?.columns.find(c => 
              c.primaryKey || 
              c.name.toLowerCase() === column.name.toLowerCase() ||
              c.name.toLowerCase() === 'id'
            );
            
            if (targetIdCol) {
              inferred.push({
                fromColumn: column.name,
                toTable: targetTable,
                toColumn: targetIdCol.name,
              });
            }
          }
        }
      }
    }
  }
  
  return inferred;
}

// ============ Public API ============

export interface SqliteSchemaState {
  db: SqlJsDatabase | null;
  schema: LoadedSchema | null;
  fileName: string | null;
}

let schemaState: SqliteSchemaState = {
  db: null,
  schema: null,
  fileName: null,
};

/**
 * Load an SQLite file and parse its schema
 */
export async function loadSqliteSchema(file: File): Promise<LoadedSchema> {
  console.log(`[SchemaParser] Loading schema from ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  
  const sql = await initSQL();
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const db = new sql.Database(data);
  
  // Close previous DB if any
  if (schemaState.db) {
    schemaState.db.close();
  }
  
  const tableNames = getAllTableNames(db);
  console.log(`[SchemaParser] Found ${tableNames.length} tables`);
  
  const tables = new Map<string, TableInfo>();
  const groups = new Map<TableGroup, string[]>();
  const pairs = new Map<string, string>();
  
  // First pass: gather basic info
  for (const name of tableNames) {
    const group = detectTableGroup(name);
    const variant = detectVariant(name);
    const pairedTable = findPairedTable(name, tableNames);
    
    const columns = getTableColumns(db, name);
    const foreignKeys = getTableForeignKeys(db, name);
    const indexes = getTableIndexes(db, name);
    const rowCount = getTableRowCount(db, name);
    
    const primaryKeys = columns.filter(c => c.primaryKey).map(c => c.name);
    
    tables.set(name, {
      name,
      columns,
      primaryKeys,
      foreignKeys,
      indexes,
      rowCount,
      group,
      variant,
      pairedTable,
    });
    
    // Add to group
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)!.push(name);
    
    // Track pairs
    if (pairedTable) {
      pairs.set(name, pairedTable);
    }
  }
  
  // Second pass: infer relationships
  const inferredFKs = inferRelationships(tables);
  for (const fk of inferredFKs) {
    // Find which table this FK belongs to
    for (const [tableName, tableInfo] of tables) {
      if (tableInfo.columns.some(c => c.name === fk.fromColumn)) {
        // Check if this FK already exists
        const exists = tableInfo.foreignKeys.some(
          existing => existing.fromColumn === fk.fromColumn && existing.toTable === fk.toTable
        );
        if (!exists) {
          tableInfo.foreignKeys.push(fk);
        }
      }
    }
  }
  
  // Build graph
  const graph: SchemaGraph = {
    nodes: Array.from(tables.values()).map(t => ({
      id: t.name,
      label: t.name,
      group: t.group,
    })),
    edges: [],
  };
  
  for (const [tableName, tableInfo] of tables) {
    for (const fk of tableInfo.foreignKeys) {
      graph.edges.push({
        from: tableName,
        to: fk.toTable,
        label: `${fk.fromColumn} → ${fk.toColumn}`,
      });
    }
  }
  
  const schema: LoadedSchema = { tables, groups, pairs, graph };
  
  // Store state
  schemaState = { db, schema, fileName: file.name };
  
  console.log(`[SchemaParser] Schema loaded: ${tables.size} tables, ${graph.edges.length} relationships`);
  
  return schema;
}

/**
 * Get the current loaded schema (if any)
 */
export function getCurrentSchema(): LoadedSchema | null {
  return schemaState.schema;
}

/**
 * Get detailed info for a specific table
 */
export function getTableDetails(tableName: string): TableInfo | null {
  return schemaState.schema?.tables.get(tableName) || null;
}

/**
 * Get sample rows from a table
 */
export function getTableSample(tableName: string, limit = 5): Record<string, unknown>[] {
  if (!schemaState.db) return [];
  return getSampleRows(schemaState.db, tableName, limit);
}

/**
 * Get all tables as summaries
 */
export function getTableSummaries(): TableSummary[] {
  if (!schemaState.schema) return [];
  
  return Array.from(schemaState.schema.tables.values()).map(t => ({
    name: t.name,
    rowCount: t.rowCount,
    group: t.group,
    variant: t.variant,
    pairedTable: t.pairedTable,
  }));
}

/**
 * Get tables by group
 */
export function getTablesByGroup(group: TableGroup): TableSummary[] {
  return getTableSummaries().filter(t => t.group === group);
}

/**
 * Get relationship hints for a table (common joins, export hints)
 */
export function getTableHints(tableName: string): {
  commonJoins: string[];
  exportHints: string[];
  identifiers: string[];
} {
  const table = schemaState.schema?.tables.get(tableName);
  if (!table) {
    return { commonJoins: [], exportHints: [], identifiers: [] };
  }
  
  const commonJoins = table.foreignKeys.map(fk => 
    `${tableName}.${fk.fromColumn} → ${fk.toTable}.${fk.toColumn}`
  );
  
  const identifiers = table.primaryKeys.length > 0 
    ? table.primaryKeys 
    : table.columns.filter(c => c.name.toLowerCase().endsWith('id')).map(c => c.name);
  
  const exportHints: string[] = [];
  
  // Generate hints based on table group
  if (table.group === 'players') {
    exportHints.push('Include playernames table for display names');
    exportHints.push('Join with teamplayerlinks for team associations');
  } else if (table.group === 'teams') {
    exportHints.push('Include teamkits for kit information');
    exportHints.push('Join with leagueteamlinks for league associations');
  } else if (table.group === 'links') {
    exportHints.push('This is a junction table - join both referenced tables');
  }
  
  return { commonJoins, exportHints, identifiers };
}

/**
 * Close the loaded database and clear state
 */
export function closeSqliteSchema(): void {
  if (schemaState.db) {
    schemaState.db.close();
  }
  schemaState = { db: null, schema: null, fileName: null };
}

/**
 * Check if a schema is currently loaded
 */
export function isSchemaLoaded(): boolean {
  return schemaState.schema !== null;
}

/**
 * Get the current loaded file name
 */
export function getLoadedFileName(): string | null {
  return schemaState.fileName;
}
