/**
 * Schema Explorer Page
 * Load and explore SQLite database schemas (compdata_local.sqlite, etc.)
 */

import { useState, useRef } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Upload, 
  FileUp, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Table2,
  Link,
  Layers,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SchemaNavigator } from '@/components/Schema/SchemaNavigator';
import { 
  loadSqliteSchema, 
  getCurrentSchema, 
  closeSqliteSchema,
  isSchemaLoaded,
  getLoadedFileName,
  type LoadedSchema,
} from '@/lib/sqliteSchemaParser';
import { detectSqlite } from '@/lib/sqliteNameParser';

export default function SchemaExplorer() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState<LoadedSchema | null>(getCurrentSchema());
  const [fileName, setFileName] = useState<string | null>(getLoadedFileName());
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (file: File) => {
    setError(null);
    
    // Validate file type
    const isSqlite = await detectSqlite(file);
    if (!isSqlite) {
      setError('Not a valid SQLite database. Please select a .sqlite, .db, or .sqlite3 file.');
      return;
    }
    
    // Check file size
    if (file.size > 500 * 1024 * 1024) {
      setError('File too large. Maximum size is 500MB.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const loadedSchema = await loadSqliteSchema(file);
      setSchema(loadedSchema);
      setFileName(file.name);
      
      toast({
        title: 'Schema Loaded',
        description: `Found ${loadedSchema.tables.size} tables with ${loadedSchema.graph.edges.length} relationships`,
      });
    } catch (err) {
      console.error('Schema load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load schema');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClose = () => {
    closeSqliteSchema();
    setSchema(null);
    setFileName(null);
  };

  // Stats summary
  const stats = schema ? {
    tables: schema.tables.size,
    relationships: schema.graph.edges.length,
    groups: schema.groups.size,
    pairs: schema.pairs.size,
  } : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Database className="h-8 w-8" />
              Schema Explorer
            </h1>
            <p className="text-muted-foreground mt-1">
              Load and explore SQLite database schemas for mapping and export
            </p>
          </div>
          
          {schema && (
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {fileName}
              </Badge>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <FileUp className="h-4 w-4 mr-2" />
                Load Different
              </Button>
              <Button variant="ghost" onClick={handleClose}>
                Close
              </Button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* File Upload or Schema Navigator */}
        {!schema ? (
          <Card>
            <CardHeader>
              <CardTitle>Load SQLite Database</CardTitle>
              <CardDescription>
                Upload a compdata_local.sqlite or other EA FC database file to explore its schema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                  transition-colors
                  ${isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".sqlite,.db,.sqlite3"
                  onChange={handleInputChange}
                  className="hidden"
                />
                
                {isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg font-medium">Loading schema...</p>
                    <p className="text-sm text-muted-foreground">
                      Analyzing tables, columns, and relationships
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="text-lg font-medium">
                        Drop SQLite file here or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Supports .sqlite, .db, .sqlite3 files up to 500MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Supported files */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  compdata_local.sqlite
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  FET database exports
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Custom SQLite databases
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Summary */}
            {stats && (
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Table2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.tables}</p>
                        <p className="text-xs text-muted-foreground">Tables</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Link className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.relationships}</p>
                        <p className="text-xs text-muted-foreground">Relationships</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Layers className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.groups}</p>
                        <p className="text-xs text-muted-foreground">Entity Groups</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/10">
                        <Database className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.pairs}</p>
                        <p className="text-xs text-muted-foreground">Raw/Work Pairs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Schema Navigator */}
            <SchemaNavigator schema={schema} />
          </>
        )}
      </div>
    </AppLayout>
  );
}
