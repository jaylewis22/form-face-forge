import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Upload, CheckCircle2, AlertCircle, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { loadPlayerNameMap, loadPlayerNamesFromFile, savePlayerNameMap, type PlayerNameMap } from "@/lib/playerNameMapping";
import { toast } from "sonner";

export function ApplyNameMapping() {
  const [nameMap, setNameMap] = useState<PlayerNameMap | null>(() => loadPlayerNameMap());
  const [isApplying, setIsApplying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ updated: number; errors: number } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const map = await loadPlayerNamesFromFile(file);
      setNameMap(map);
      savePlayerNameMap(map);
      toast.success(`Loaded ${map.totalEntries} player names from ${file.name}`);
    } catch (error) {
      toast.error("Failed to load name mapping file");
      console.error(error);
    }
  };

  const applyToDatabase = async () => {
    if (!nameMap || nameMap.names.size === 0) {
      toast.error("No name mapping loaded");
      return;
    }

    setIsApplying(true);
    setProgress(0);
    setResult(null);

    try {
      // Convert Map to array for the edge function
      const mappings = Array.from(nameMap.names.values());
      
      // Send to edge function in chunks to avoid payload limits
      const chunkSize = 500;
      let totalUpdated = 0;
      let totalErrors = 0;

      for (let i = 0; i < mappings.length; i += chunkSize) {
        const chunk = mappings.slice(i, i + chunkSize);
        
        const { data, error } = await supabase.functions.invoke("update-player-names", {
          body: { nameMappings: chunk },
        });

        if (error) {
          console.error("Chunk error:", error);
          totalErrors += chunk.length;
        } else if (data) {
          totalUpdated += data.updated || 0;
          totalErrors += data.errors || 0;
        }

        setProgress(Math.round(((i + chunk.length) / mappings.length) * 100));
      }

      setResult({ updated: totalUpdated, errors: totalErrors });
      
      if (totalUpdated > 0) {
        toast.success(`Updated ${totalUpdated} player names in the database`);
      }
      if (totalErrors > 0) {
        toast.warning(`${totalErrors} updates failed`);
      }
    } catch (error) {
      toast.error("Failed to apply name mapping");
      console.error(error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Apply Player Name Mapping
        </CardTitle>
        <CardDescription>
          Replace placeholder names (Player_ID) with real names from a reference file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current mapping status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Loaded mapping:</span>
            {nameMap ? (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {nameMap.totalEntries.toLocaleString()} names
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                None
              </Badge>
            )}
          </div>
          {nameMap && (
            <span className="text-xs text-muted-foreground">
              Source: {nameMap.source}
            </span>
          )}
        </div>

        {/* File upload */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Load Reference File
              <input
                type="file"
                className="hidden"
                accept=".txt,.csv,.json,.sqlite,.db"
                onChange={handleFileUpload}
              />
            </label>
          </Button>
          <Button
            onClick={applyToDatabase}
            disabled={!nameMap || isApplying}
            className="flex-1"
          >
            {isApplying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Apply to Database
              </>
            )}
          </Button>
        </div>

        {/* Progress */}
        {isApplying && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">
              Updating players... {progress}%
            </p>
          </div>
        )}

        {/* Result */}
        {result && !isApplying && (
          <div className="flex items-center justify-center gap-4 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium">{result.updated}</span>
              <span className="text-sm">updated</span>
            </div>
            {result.errors > 0 && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">{result.errors}</span>
                <span className="text-sm">failed</span>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Supports: players.txt, editedplayernames.txt, JSON exports, or SQLite files with player name tables.
          The mapping is saved locally and persists across sessions.
        </p>
      </CardContent>
    </Card>
  );
}
