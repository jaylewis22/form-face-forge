/**
 * Schema Explorer Page
 * Load and explore SQLite database schemas via backend API
 */

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Loader2, 
  XCircle,
  Table2,
  Link,
  Layers,
  RefreshCw,
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

export default function SchemaExplorer() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState<LoadedSchema | null>(getCurrentSchema());
  const [fileName, setFileName] = useState<string | null>(getLoadedFileName());
  const [error, setError] = useState<string | null>(null);

  const loadSchema = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const loadedSchema = await loadSqliteSchema();
      setSchema(loadedSchema);
      setFileName(getLoadedFileName());
      
      toast({
        title: 'Schema Loaded',
        description: `Found ${loadedSchema.tables.size} tables`,
      });
    } catch (err) {
      console.error('Schema load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load schema');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load on mount if not already loaded
  useEffect(() => {
    if (!isSchemaLoaded()) {
      loadSchema();
    }
  }, []);

  const handleRefresh = () => {
    closeSqliteSchema();
    setSchema(null);
    loadSchema();
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
              Explore database schema for mapping and export
            </p>
          </div>
          
          {schema && (
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {fileName}
              </Badge>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
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

        {/* Loading State */}
        {isLoading && !schema && (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium">Loading schema from API...</p>
                <p className="text-sm text-muted-foreground">
                  Fetching tables, columns, and relationships
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Schema & Not Loading */}
        {!schema && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>No Schema Loaded</CardTitle>
              <CardDescription>
                Click the button below to load the database schema from the API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={loadSchema}>
                <Database className="h-4 w-4 mr-2" />
                Load Schema
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Schema Loaded */}
        {schema && (
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
