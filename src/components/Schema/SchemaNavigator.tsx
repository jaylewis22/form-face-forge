/**
 * Schema Navigator Component
 * Three-panel layout for exploring SQLite database schema:
 * - Left: Table tree grouped by domain
 * - Center: Table inspector with columns, FKs, sample rows
 * - Right: Reference cheatsheet with common joins and hints
 */

import { useState, useMemo } from 'react';
import { 
  Database, 
  Table2, 
  Link, 
  Globe, 
  Users, 
  Trophy, 
  Shirt, 
  Building2, 
  Settings, 
  FileText,
  Search,
  ChevronRight,
  ChevronDown,
  ArrowRightLeft,
  Key,
  Hash,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  type TableInfo,
  type TableSummary,
  type TableGroup,
  type LoadedSchema,
  getTableDetails,
  getTableSample,
  getTableHints,
} from '@/lib/sqliteSchemaParser';

// ============ Types ============

interface SchemaNavigatorProps {
  schema: LoadedSchema;
  onTableSelect?: (tableName: string) => void;
}

// ============ Group Icons ============

const GROUP_ICONS: Record<TableGroup, typeof Database> = {
  players: Users,
  teams: Shirt,
  leagues: Trophy,
  nations: Globe,
  formations: Table2,
  kits: Shirt,
  stadiums: Building2,
  links: Link,
  language: FileText,
  meta: Settings,
  other: Database,
};

const GROUP_LABELS: Record<TableGroup, string> = {
  players: 'Players',
  teams: 'Teams',
  leagues: 'Leagues',
  nations: 'Nations',
  formations: 'Formations',
  kits: 'Kits',
  stadiums: 'Stadiums',
  links: 'Links',
  language: 'Language',
  meta: 'Meta/Config',
  other: 'Other',
};

const VARIANT_COLORS: Record<string, string> = {
  raw: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  work: 'bg-green-500/10 text-green-500 border-green-500/20',
  app: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  meta: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

// ============ Components ============

function TableTreeItem({ 
  table, 
  isSelected, 
  onSelect 
}: { 
  table: TableSummary; 
  isSelected: boolean; 
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
        isSelected 
          ? "bg-primary/10 text-primary" 
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      <span className="truncate flex-1 text-left">{table.name}</span>
      <Badge variant="outline" className={cn("text-xs", VARIANT_COLORS[table.variant])}>
        {table.variant.toUpperCase()}
      </Badge>
      <span className="text-xs text-muted-foreground">{table.rowCount.toLocaleString()}</span>
    </button>
  );
}

function TableGroup({ 
  group, 
  tables, 
  selectedTable, 
  onSelectTable,
  defaultExpanded = false,
}: { 
  group: TableGroup; 
  tables: TableSummary[]; 
  selectedTable: string | null;
  onSelectTable: (name: string) => void;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const Icon = GROUP_ICONS[group];
  
  if (tables.length === 0) return null;
  
  return (
    <div className="space-y-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium hover:bg-muted rounded-md transition-colors"
      >
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <Icon className="h-4 w-4" />
        <span>{GROUP_LABELS[group]}</span>
        <Badge variant="secondary" className="ml-auto text-xs">{tables.length}</Badge>
      </button>
      
      {expanded && (
        <div className="ml-4 space-y-0.5">
          {tables.map(table => (
            <TableTreeItem
              key={table.name}
              table={table}
              isSelected={selectedTable === table.name}
              onSelect={() => onSelectTable(table.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TableInspector({ 
  table,
  sampleRows,
  onJumpToTable,
}: { 
  table: TableInfo;
  sampleRows: Record<string, unknown>[];
  onJumpToTable: (name: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Table2 className="h-5 w-5" />
            {table.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {table.rowCount.toLocaleString()} rows • {table.columns.length} columns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn(VARIANT_COLORS[table.variant])}>
            {table.variant.toUpperCase()}
          </Badge>
          <Badge variant="outline">{GROUP_LABELS[table.group]}</Badge>
        </div>
      </div>

      {/* Paired table */}
      {table.pairedTable && (
        <Card className="bg-muted/50">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <ArrowRightLeft className="h-4 w-4" />
              <span>Paired with:</span>
              <code className="font-mono text-primary">{table.pairedTable}</code>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onJumpToTable(table.pairedTable!)}>
              Jump →
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Columns */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Columns</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Nullable</TableHead>
                <TableHead>Default</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.columns.map(col => (
                <TableRow key={col.name}>
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      {col.primaryKey && <Key className="h-3 w-3 text-amber-500" />}
                      {col.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{col.type}</TableCell>
                  <TableCell>{col.nullable ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {col.defaultValue || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Foreign Keys */}
      {table.foreignKeys.length > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Link className="h-4 w-4" />
              Foreign Keys ({table.foreignKeys.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>References</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.foreignKeys.map((fk, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-sm">{fk.fromColumn}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-primary">{fk.toTable}</span>
                      <span className="text-muted-foreground">.{fk.toColumn}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => onJumpToTable(fk.toTable)}>
                        View →
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Sample Rows */}
      {sampleRows.length > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Sample Data</CardTitle>
            <CardDescription>First {sampleRows.length} rows</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(sampleRows[0]).slice(0, 8).map(key => (
                    <TableHead key={key} className="whitespace-nowrap">{key}</TableHead>
                  ))}
                  {Object.keys(sampleRows[0]).length > 8 && (
                    <TableHead>...</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleRows.map((row, i) => (
                  <TableRow key={i}>
                    {Object.values(row).slice(0, 8).map((val, j) => (
                      <TableCell key={j} className="text-xs max-w-[150px] truncate">
                        {val == null ? <span className="text-muted-foreground">null</span> : String(val)}
                      </TableCell>
                    ))}
                    {Object.keys(row).length > 8 && (
                      <TableCell className="text-muted-foreground">...</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ReferenceCheatsheet({ 
  table,
  hints,
}: { 
  table: TableInfo;
  hints: ReturnType<typeof getTableHints>;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Reference</h3>
      
      {/* Identifiers */}
      {hints.identifiers.length > 0 && (
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-xs flex items-center gap-1">
              <Hash className="h-3 w-3" /> Primary Identifiers
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="flex flex-wrap gap-1">
              {hints.identifiers.map(id => (
                <Badge key={id} variant="secondary" className="font-mono text-xs">{id}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Common Joins */}
      {hints.commonJoins.length > 0 && (
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-xs flex items-center gap-1">
              <Link className="h-3 w-3" /> Common Joins
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-1">
            {hints.commonJoins.map((join, i) => (
              <code key={i} className="block text-xs font-mono text-muted-foreground break-all">
                {join}
              </code>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Export Hints */}
      {hints.exportHints.length > 0 && (
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-xs">💡 Export Hints</CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-1">
            {hints.exportHints.map((hint, i) => (
              <p key={i} className="text-xs text-muted-foreground">{hint}</p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-xs">Stats</CardTitle>
        </CardHeader>
        <CardContent className="py-2 space-y-1 text-xs text-muted-foreground">
          <p>Rows: {table.rowCount.toLocaleString()}</p>
          <p>Columns: {table.columns.length}</p>
          <p>Foreign Keys: {table.foreignKeys.length}</p>
          <p>Indexes: {table.indexes.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ Main Component ============

export function SchemaNavigator({ schema, onTableSelect }: SchemaNavigatorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [sampleRows, setSampleRows] = useState<Record<string, unknown>[]>([]);
  
  // Filter tables by search
  const filteredTables = useMemo(() => {
    const summaries = Array.from(schema.tables.values()).map(t => ({
      name: t.name,
      rowCount: t.rowCount,
      group: t.group,
      variant: t.variant,
      pairedTable: t.pairedTable,
    }));
    
    if (!searchQuery.trim()) return summaries;
    
    const query = searchQuery.toLowerCase();
    return summaries.filter(t => t.name.toLowerCase().includes(query));
  }, [schema, searchQuery]);
  
  // Group tables
  const tablesByGroup = useMemo(() => {
    const grouped = new Map<TableGroup, TableSummary[]>();
    
    for (const table of filteredTables) {
      if (!grouped.has(table.group)) {
        grouped.set(table.group, []);
      }
      grouped.get(table.group)!.push(table);
    }
    
    return grouped;
  }, [filteredTables]);
  
  // Selected table details
  const selectedTableInfo = useMemo(() => {
    if (!selectedTable) return null;
    return getTableDetails(selectedTable);
  }, [selectedTable]);
  
  const selectedTableHints = useMemo(() => {
    if (!selectedTable) return null;
    return getTableHints(selectedTable);
  }, [selectedTable]);
  
  const handleSelectTable = (name: string) => {
    setSelectedTable(name);
    setSampleRows(getTableSample(name, 5));
    onTableSelect?.(name);
  };
  
  const handleJumpToTable = (name: string) => {
    handleSelectTable(name);
  };
  
  // Order groups for display
  const groupOrder: TableGroup[] = [
    'players', 'teams', 'leagues', 'nations', 
    'links', 'formations', 'kits', 'stadiums',
    'language', 'meta', 'other'
  ];
  
  return (
    <div className="grid grid-cols-[280px_1fr_240px] gap-4 h-[calc(100vh-200px)]">
      {/* Left Panel - Table Tree */}
      <Card className="flex flex-col">
        <CardHeader className="py-3 space-y-3">
          <CardTitle className="text-sm">Tables</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          <CardContent className="py-2 space-y-2">
            {groupOrder.map(group => (
              <TableGroup
                key={group}
                group={group}
                tables={tablesByGroup.get(group) || []}
                selectedTable={selectedTable}
                onSelectTable={handleSelectTable}
                defaultExpanded={group === 'players' || group === 'teams'}
              />
            ))}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Center Panel - Table Inspector */}
      <Card className="flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <CardContent className="py-4">
            {selectedTableInfo ? (
              <TableInspector
                table={selectedTableInfo}
                sampleRows={sampleRows}
                onJumpToTable={handleJumpToTable}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <Table2 className="h-12 w-12 mx-auto opacity-50" />
                  <p>Select a table to inspect</p>
                </div>
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Right Panel - Reference Cheatsheet */}
      <Card className="flex flex-col">
        <ScrollArea className="flex-1">
          <CardContent className="py-4">
            {selectedTableInfo && selectedTableHints ? (
              <ReferenceCheatsheet
                table={selectedTableInfo}
                hints={selectedTableHints}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p className="text-sm">Reference info will appear here</p>
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
