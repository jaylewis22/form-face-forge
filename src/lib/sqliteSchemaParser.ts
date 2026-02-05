/* SQLite Schema Parser - API-Based Version
 * Fetches schema metadata from the backend API instead of loading SQL.js
 */

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
  pairedTable: string | null;
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
  pairs: Map<string, string>;
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

// ============ State Management ============

let cachedSchema: LoadedSchema | null = null;
let cachedSamples: Map<string, Record<string, unknown>[]> = new Map();

// ============ API Calls ============

async function fetchTableList(): Promise<string[]> {
  const response = await fetch('/api/tables');
  if (!response.ok) throw new Error('Failed to fetch tables');
  return response.json();
}

async function fetchTableRows(tableName: string, limit = 50): Promise<{
  columns: Array<{ name: string; type: string; pk: boolean }>;
  rows: Record<string, unknown>[];
}> {
  const response = await fetch(`/api/table-rows?table=${encodeURIComponent(tableName)}&limit=${limit}`);
  if (!response.ok) throw new Error(`Failed to fetch rows for ${tableName}`);
  return response.json();
}

// ============ Public API ============

/**
 * Load schema from the backend API
 */
export async function loadSqliteSchema(): Promise<LoadedSchema> {
  console.log('[SchemaParser] Loading schema from API...');
  
  const tableNames = await fetchTableList();
  console.log(`[SchemaParser] Found ${tableNames.length} tables`);
  
  const tables = new Map<string, TableInfo>();
  const groups = new Map<TableGroup, string[]>();
  const pairs = new Map<string, string>();
  
  // Fetch details for each table
  for (const name of tableNames) {
    const group = detectTableGroup(name);
    const variant = detectVariant(name);
    const pairedTable = findPairedTable(name, tableNames);
    
    try {
      const data = await fetchTableRows(name, 10);
      
      const columns: ColumnInfo[] = data.columns.map(col => ({
        name: col.name,
        type: col.type,
        nullable: !col.pk,
        primaryKey: col.pk,
        defaultValue: null,
      }));
      
      const primaryKeys = columns.filter(c => c.primaryKey).map(c => c.name);
      
      tables.set(name, {
        name,
        columns,
        primaryKeys,
        foreignKeys: [],
        indexes: [],
        rowCount: data.rows.length, // Approximation
        group,
        variant,
        pairedTable,
      });
      
      // Cache sample rows
      cachedSamples.set(name, data.rows.slice(0, 5));
      
      // Add to group
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(name);
      
      // Track pairs
      if (pairedTable) {
        pairs.set(name, pairedTable);
      }
    } catch (e) {
      console.warn(`[SchemaParser] Error loading table ${name}:`, e);
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
  
  const schema: LoadedSchema = { tables, groups, pairs, graph };
  cachedSchema = schema;
  
  console.log(`[SchemaParser] Schema loaded: ${tables.size} tables`);
  
  return schema;
}

/**
 * Get the current loaded schema (if any)
 */
export function getCurrentSchema(): LoadedSchema | null {
  return cachedSchema;
}

/**
 * Get detailed info for a specific table
 */
export function getTableDetails(tableName: string): TableInfo | null {
  return cachedSchema?.tables.get(tableName) || null;
}

/**
 * Get sample rows from a table
 */
export function getTableSample(tableName: string, limit = 5): Record<string, unknown>[] {
  const cached = cachedSamples.get(tableName);
  if (cached) return cached.slice(0, limit);
  return [];
}

/**
 * Get all tables as summaries
 */
export function getTableSummaries(): TableSummary[] {
  if (!cachedSchema) return [];
  
  return Array.from(cachedSchema.tables.values()).map(t => ({
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
 * Get relationship hints for a table
 */
export function getTableHints(tableName: string): {
  commonJoins: string[];
  exportHints: string[];
  identifiers: string[];
} {
  const table = cachedSchema?.tables.get(tableName);
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
 * Clear cached schema
 */
export function closeSqliteSchema(): void {
  cachedSchema = null;
  cachedSamples.clear();
}

/**
 * Check if a schema is currently loaded
 */
export function isSchemaLoaded(): boolean {
  return cachedSchema !== null;
}

/**
 * Dummy function for compatibility (not used in API mode)
 */
export function getCurrentDb(): null {
  return null;
}

/**
 * Get the current loaded file name (not available in API mode)
 */
export function getLoadedFileName(): string | null {
  return 'Remote Database';
}
