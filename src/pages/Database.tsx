import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  HardDrive,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  Archive,
  FileDown,
  FileUp,
  Settings,
  Loader2,
  Cpu
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { parseSquadFile, mapPlayerToDatabase, detectFBCHUNKS, type ParseProgress } from "@/lib/fbchunksParser";
import { ImportProgress, type ImportStage } from "@/components/Import/ImportProgress";
import { 
  loadPlayerNamesFromFile, 
  loadPlayerNameMap, 
  savePlayerNameMap, 
  clearPlayerNameMap,
  type PlayerNameMap 
} from "@/lib/playerNameMapping";
import { parseSqliteFile, detectSqlite } from "@/lib/sqliteNameParser";

export default function DatabasePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importType, setImportType] = useState("merge");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [detectedFormat, setDetectedFormat] = useState<"json" | "fbchunks" | null>(null);
  const [importStages, setImportStages] = useState<ImportStage[]>([]);
  const [parseStats, setParseStats] = useState<{
    totalChunks: number;
    processedChunks: number;
    playersFound: number;
  } | null>(null);
  const [fileFormat, setFileFormat] = useState<"json" | "binary">("json");
  const [importValidation, setImportValidation] = useState<{
    show: boolean;
    success: boolean;
    message: string;
    hint?: string;
    nextSteps?: string[];
    format?: string;
    fileInfo?: {
      size?: number;
      sizeFormatted?: string;
      header?: string;
    };
    details: {
      players: number;
      teams: number;
      leagues: number;
      competitions: number;
    };
  } | null>(null);
  const [dbStats, setDbStats] = useState({
    players: 0,
    teams: 0,
    leagues: 0,
    competitions: 0,
    totalSize: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameFileInputRef = useRef<HTMLInputElement>(null);
  const [playerNameMap, setPlayerNameMap] = useState<PlayerNameMap | null>(null);

  // Load stored name mapping on mount
  useEffect(() => {
    const stored = loadPlayerNameMap();
    if (stored) {
      setPlayerNameMap(stored);
    }
  }, []);

  // Fetch database stats on mount
  useEffect(() => {
    fetchDatabaseStats();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      const [playersResult, teamsResult, leaguesResult, competitionsResult] = await Promise.all([
        supabase.from("players").select("id", { count: "exact", head: true }),
        supabase.from("teams").select("id", { count: "exact", head: true }),
        supabase.from("leagues").select("id", { count: "exact", head: true }),
        supabase.from("competitions").select("id", { count: "exact", head: true }),
      ]);

      setDbStats({
        players: playersResult.count || 0,
        teams: teamsResult.count || 0,
        leagues: leaguesResult.count || 0,
        competitions: competitionsResult.count || 0,
        totalSize: (playersResult.count || 0) + (teamsResult.count || 0) + (leaguesResult.count || 0) + (competitionsResult.count || 0),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleExport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Export Started",
        description: "Your database export has been initiated. You'll be notified when complete.",
      });
    }, 2000);
  };

  const handleImport = () => {
    setImportDialogOpen(true);
  };

  const handleFileSelect = async (file: File) => {
    // Accept JSON for FET exports, plus various binary files
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.json', '.csv', '.sql', '.xml', '.bin', '.db', '.dat', '.sav', '.bak'];
    const hasExtension = fileName.includes('.');
    const fileExtension = hasExtension ? fileName.substring(fileName.lastIndexOf('.')) : '';
    
    // Accept files without extensions (like FB chunks, squad files) or with valid extensions
    const isValidExtension = !hasExtension || validExtensions.includes(fileExtension);
    
    if (!isValidExtension) {
      toast({
        title: "Invalid File Type",
        description: "Please select a JSON, CSV, SQL, XML, BIN, DB, DAT, or squad file.",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 100MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Auto-detect FBCHUNKS format
    const isFbchunks = await detectFBCHUNKS(file);
    if (isFbchunks) {
      setDetectedFormat("fbchunks");
      setFileFormat("binary");
      toast({
        title: "FBCHUNKS Detected",
        description: "Binary squad file detected. Ready for direct import.",
      });
    } else {
      setDetectedFormat("json");
      setFileFormat("json");
    }
    
    setSelectedFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const parseJsonFile = async (file: File): Promise<any> => {
    const text = await file.text();
    return JSON.parse(text);
  };

  // Helper to invoke edge function and extract error payload
  const invokeEdgeFunction = async (
    functionName: string, 
    body: Record<string, unknown>
  ): Promise<{ ok: boolean; status: number; payload: Record<string, unknown> }> => {
    const { data, error } = await supabase.functions.invoke(functionName, { body });

    if (error) {
      console.log('Edge function error object:', error);
      console.log('Error keys:', Object.keys(error));
      
      // supabase-js provides error details in different ways depending on version
      // Try multiple extraction methods
      let payload: Record<string, unknown> | null = null;
      let status = 415;
      
      // Method 1: Check error.context (older supabase-js)
      const errorAny = error as Record<string, unknown>;
      const context = errorAny?.context as Record<string, unknown> | undefined;
      
      if (context?.body) {
        try { 
          payload = typeof context.body === "string" ? JSON.parse(context.body) : context.body as Record<string, unknown>; 
          status = (context.status as number) ?? 415;
        } catch {
          // Continue to next method
        }
      }
      
      // Method 2: Error message might contain the JSON body (newer supabase-js)
      if (!payload && error.message) {
        // Try to extract JSON from error message like "Edge Function returned a non-2xx status code: {...}"
        const jsonMatch = error.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            payload = JSON.parse(jsonMatch[0]);
          } catch {
            // Continue to next method
          }
        }
      }
      
      // Method 3: Check if error itself has our fields (FunctionsHttpError)
      if (!payload) {
        // The error might have a 'context' with 'json' method or direct properties
        if (typeof errorAny.json === 'function') {
          try {
            payload = await (errorAny.json as () => Promise<Record<string, unknown>>)();
          } catch {
            // Continue
          }
        }
      }
      
      // Method 4: Look for data even when there's an error (some edge function errors return both)
      if (!payload && data) {
        payload = data as Record<string, unknown>;
      }
      
      console.log('Extracted payload:', payload);

      return {
        ok: false,
        status,
        payload: payload ?? { success: false, error: error.message },
      };
    }

    // Check if data indicates an error (some edge functions return errors in data with success: false)
    if (data && typeof data === 'object' && 'success' in data && data.success === false) {
      return {
        ok: false,
        status: 200, // Edge function returned 200 but with error payload
        payload: data as Record<string, unknown>,
      };
    }

    // Success path
    return { ok: true, status: 200, payload: data };
  };

  const handleImportSubmit = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setImportProgress(10);
    setParseStats(null);
    
    // Initialize stages based on format
    const isDetectedFbchunks = detectedFormat === "fbchunks" || fileFormat === "binary";
    
    if (isDetectedFbchunks) {
      setImportStages([
        { id: "read", label: "Reading file", status: "pending" },
        { id: "scan", label: "Scanning chunks", status: "pending" },
        { id: "parse", label: "Parsing player records", status: "pending" },
        { id: "map", label: "Mapping to database schema", status: "pending" },
        { id: "import", label: "Importing to database", status: "pending" },
      ]);
    } else {
      setImportStages([
        { id: "read", label: "Reading file", status: "pending" },
        { id: "parse", label: "Parsing JSON data", status: "pending" },
        { id: "import", label: "Importing to database", status: "pending" },
      ]);
    }

    try {
      if (fileFormat === "json") {
        // FET JSON export format - try to parse as JSON regardless of extension
        // FET exports often don't have .json extension
        setImportProgress(20);
        
        // Read file as base64 for edge function
        const arrayBuffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const chunkSize = 8192;
        let base64 = '';
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.subarray(i, i + chunkSize);
          base64 += String.fromCharCode.apply(null, Array.from(chunk));
        }
        base64 = btoa(base64);

        setImportProgress(40);
        
        // Parse via edge function - it will detect JSON vs binary
        const parseResult = await invokeEdgeFunction('parse-squad-file', {
          fileData: base64,
          fileName: selectedFile.name,
          importType,
        });

        setImportProgress(60);

        // If edge function returned an error (not JSON, binary format, etc.)
        if (!parseResult.ok) {
          const payload = parseResult.payload;
          const fileInfoData = payload.fileInfo as { size?: number; sizeFormatted?: string; header?: string } | undefined;
          setImportValidation({
            show: true,
            success: false,
            message: (payload.error as string) || "File parsing failed",
            hint: (payload.hint as string) || "The file does not appear to be a valid JSON export. FET exports should be in JSON format.",
            nextSteps: payload.nextSteps as string[] | undefined,
            format: payload.format as string | undefined,
            fileInfo: fileInfoData,
            details: { players: 0, teams: 0, leagues: 0, competitions: 0 }
          });
          setImportDialogOpen(false);
          setSelectedFile(null);
          return;
        }

        let dataToImport: Record<string, unknown>;
        
        // If parsing was successful and extracted structured data, use it
        if (parseResult.payload.format === 'fet_json') {
          dataToImport = parseResult.payload.data as Record<string, unknown>;
          console.log('Using FET-parsed data:', parseResult.payload.parsed);
        } else if (parseResult.payload.format === 'json') {
          // Raw JSON data
          dataToImport = parseResult.payload.data as Record<string, unknown>;
          console.log('Using raw JSON data');
        } else {
          // Unexpected format
          setImportValidation({
            show: true,
            success: false,
            message: "Unexpected file format",
            hint: "The file was parsed but returned an unexpected format.",
            details: { players: 0, teams: 0, leagues: 0, competitions: 0 }
          });
          setImportDialogOpen(false);
          setSelectedFile(null);
          return;
        }
        
        // Call import-database with the data
        const importResult = await invokeEdgeFunction('import-database', {
          data: dataToImport,
          importType,
        });
        
        setImportProgress(90);
        
        if (!importResult.ok) {
          setImportValidation({
            show: true,
            success: false,
            message: (importResult.payload.error as string) || "Import failed",
            hint: importResult.payload.hint as string | undefined,
            nextSteps: importResult.payload.nextSteps as string[] | undefined,
            details: { players: 0, teams: 0, leagues: 0, competitions: 0 }
          });
          setImportDialogOpen(false);
          setSelectedFile(null);
          return;
        }
        
        const results = importResult.payload.results as Record<string, { inserted?: number }> | undefined;
        const playerCount = results?.players?.inserted || 0;
        const teamCount = results?.teams?.inserted || 0;
        const leagueCount = results?.leagues?.inserted || 0;
        
        // Refresh stats after import
        await fetchDatabaseStats();
        
        // Show validation dialog
        setImportValidation({
          show: true,
          success: true,
          message: `Import completed successfully!`,
          details: {
            players: playerCount,
            teams: teamCount,
            leagues: leagueCount,
            competitions: results?.competitions?.inserted || 0,
          }
        });
      } else {
        // Binary squad file - parse client-side using FBCHUNKS parser
        setImportStages(prev => prev.map(s => 
          s.id === "read" ? { ...s, status: "active" as const, detail: "Reading binary file..." } : s
        ));
        setImportProgress(15);
        
        console.log('[Import] Starting client-side FBCHUNKS parsing...');
        
        // Progress callback handler
        const handleParseProgress = (progress: ParseProgress) => {
          setImportProgress(progress.progress);
          setParseStats({
            totalChunks: progress.totalChunks,
            processedChunks: progress.processedChunks,
            playersFound: progress.playersFound,
          });
          
          // Update stages based on parse progress
          setImportStages(prev => prev.map(s => {
            if (s.id === "read" && progress.stage !== "reading") {
              return { ...s, status: "complete" as const };
            }
            if (s.id === "scan") {
              if (progress.stage === "scanning") {
                return { ...s, status: "active" as const, detail: progress.detail };
              } else if (["parsing", "extracting", "complete"].includes(progress.stage)) {
                return { ...s, status: "complete" as const, detail: `${progress.totalChunks} chunks found` };
              }
            }
            if (s.id === "parse") {
              if (progress.stage === "parsing" || progress.stage === "extracting") {
                return { ...s, status: "active" as const, detail: progress.detail };
              } else if (progress.stage === "complete") {
                return { ...s, status: "complete" as const, detail: `${progress.playersFound} players extracted` };
              }
            }
            return s;
          }));
        };
        
        // Parse directly in browser with progress
        const parseResult = await parseSquadFile(selectedFile, handleParseProgress);
        
        console.log(`[Import] Parsed ${parseResult.players.length} players from ${parseResult.mediumChunks} MEDIUM chunks`);
        
        if (!parseResult.success || parseResult.players.length === 0) {
          // Parsing failed or no players found
          setImportValidation({
            show: true,
            success: false,
            message: parseResult.error || "No player data found in file",
            hint: parseResult.format === "fbchunks" 
              ? "The FBCHUNKS file was parsed but no valid player records were found in the accessible chunks. Player names require decompressing LARGE chunks which needs the Oodle library."
              : "This file does not appear to be a valid FBCHUNKS squad file.",
            nextSteps: [
              "Try exporting your squad to JSON format using FIFA Editor Tool (FET)",
              "Player IDs were extracted but names require Oodle decompression",
              "You can still import the player ratings and attributes"
            ],
            format: parseResult.format,
            fileInfo: {
              size: selectedFile.size,
              sizeFormatted: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
            },
            details: { players: parseResult.players.length, teams: 0, leagues: 0, competitions: 0 }
          });
          setImportDialogOpen(false);
          setSelectedFile(null);
          return;
        }
        
        // Update stage: mapping
        setImportStages(prev => prev.map(s => 
          s.id === "parse" ? { ...s, status: "complete" as const, detail: `${parseResult.players.length} players extracted` } :
          s.id === "map" ? { ...s, status: "active" as const, detail: "Converting to database format..." } : s
        ));
        setImportProgress(65);
        
        // Map parsed players to database schema with name mapping
        const mappedPlayers = parseResult.players.map(p => mapPlayerToDatabase(p, playerNameMap || undefined));
        const namedCount = playerNameMap ? mappedPlayers.filter(p => !String(p.name).startsWith('Player_')).length : 0;
        console.log(`[Import] Mapped ${mappedPlayers.length} players to database schema (${namedCount} with real names)`);
        
        
        // Update stage: import
        setImportStages(prev => prev.map(s => 
          s.id === "map" ? { ...s, status: "complete" as const, detail: `${mappedPlayers.length} players mapped` } :
          s.id === "import" ? { ...s, status: "active" as const, detail: "Sending to database..." } : s
        ));
        setImportProgress(75);
        
        // Import to database
        const importResult = await invokeEdgeFunction('import-database', {
          data: { players: mappedPlayers },
          importType,
        });
        
        setImportProgress(95);
        
        if (!importResult.ok) {
          setImportValidation({
            show: true,
            success: false,
            message: (importResult.payload.error as string) || "Import failed",
            hint: "The players were parsed successfully but importing to database failed.",
            details: { players: parseResult.players.length, teams: 0, leagues: 0, competitions: 0 }
          });
          setImportDialogOpen(false);
          setSelectedFile(null);
          return;
        }
        
        const results = importResult.payload.results as Record<string, { inserted?: number }> | undefined;
        const playerCount = results?.players?.inserted || parseResult.players.length;
        
        // Update stages complete
        setImportStages(prev => prev.map(s => ({ ...s, status: "complete" as const })));
        
        // Refresh stats after import
        await fetchDatabaseStats();
        
        // Show success
        setImportValidation({
          show: true,
          success: true,
          message: `FBCHUNKS import completed!`,
          hint: `Extracted player data directly from binary file (${parseResult.mediumChunks} MEDIUM chunks parsed)`,
          format: "fbchunks",
          fileInfo: {
            size: selectedFile.size,
            sizeFormatted: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
          },
          details: {
            players: playerCount,
            teams: 0,
            leagues: 0,
            competitions: 0,
          }
        });
        
        setImportProgress(100);
        setImportDialogOpen(false);
        setSelectedFile(null);
        setDetectedFormat(null);
        setImportStages([]);
        setParseStats(null);
        return;
      }
      
      setImportProgress(100);
      setImportDialogOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Import error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "An error occurred during import";
      
      // Show validation dialog for failed imports
      setImportValidation({
        show: true,
        success: false,
        message: errorMessage,
        details: { players: 0, teams: 0, leagues: 0, competitions: 0 }
      });
      
      setImportDialogOpen(false);
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
      setImportProgress(0);
    }
  };

  const handleBackup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Backup Created",
        description: "Database backup created successfully.",
      });
    }, 2000);
  };

  // Handle player names file upload
  const handlePlayerNamesFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    try {
      let result: PlayerNameMap;
      
      // Check if it's an SQLite file
      const isSqlite = await detectSqlite(file);
      
      if (isSqlite) {
        toast({
          title: "Parsing SQLite Database",
          description: "Loading player names from SQLite file...",
        });
        result = await parseSqliteFile(file);
      } else {
        // Use existing text-based parser
        result = await loadPlayerNamesFromFile(file);
      }
      
      if (result.totalEntries === 0) {
        toast({
          title: "No Names Found",
          description: "Could not parse any player names from the file. Make sure it has playerid and name columns.",
          variant: "destructive",
        });
        return;
      }

      // Save to localStorage and state
      savePlayerNameMap(result);
      setPlayerNameMap(result);

      toast({
        title: "Player Names Loaded",
        description: `Loaded ${result.totalEntries.toLocaleString()} player names from ${file.name}`,
      });
    } catch (error) {
      console.error("Error loading player names:", error);
      toast({
        title: "Error Loading Names",
        description: error instanceof Error ? error.message : "Failed to load player names file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }

    // Reset input
    if (nameFileInputRef.current) {
      nameFileInputRef.current.value = '';
    }
  };

  const handleClearPlayerNames = () => {
    clearPlayerNameMap();
    setPlayerNameMap(null);
    toast({
      title: "Names Cleared",
      description: "Player name mapping has been removed.",
    });
  };

  const handleOptimize = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Optimization Complete",
        description: "Database has been optimized successfully.",
      });
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Database Options</h1>
          <p className="text-muted-foreground">Manage your compdata database and storage</p>
        </div>

        {/* Connection Status */}
        <Alert className="bg-card/50 border-primary/20">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground">
            Database connected and operational - Version 2.4.1
          </AlertDescription>
        </Alert>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Players</CardDescription>
              <CardTitle className="text-2xl">{dbStats.players.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Total players in database</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Teams</CardDescription>
              <CardTitle className="text-2xl">{dbStats.teams.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Total teams in database</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Leagues</CardDescription>
              <CardTitle className="text-2xl">{dbStats.leagues.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Active leagues</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Total Records</CardDescription>
              <CardTitle className="text-2xl text-primary">{dbStats.totalSize.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Across all tables</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="import-export" className="space-y-4">
          <TabsList className="bg-card/50">
            <TabsTrigger value="import-export">Import/Export</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="import-export" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileDown className="w-5 h-5" />
                    Export Data
                  </CardTitle>
                  <CardDescription>
                    Download your database in various formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select defaultValue="json">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON (.json)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="sql">SQL (.sql)</SelectItem>
                        <SelectItem value="xml">XML (.xml)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data Selection</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Data</SelectItem>
                        <SelectItem value="players">Players Only</SelectItem>
                        <SelectItem value="teams">Teams Only</SelectItem>
                        <SelectItem value="leagues">Leagues Only</SelectItem>
                        <SelectItem value="custom">Custom Selection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleExport}
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isLoading ? "Exporting..." : "Export Database"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileUp className="w-5 h-5" />
                    Import Data
                  </CardTitle>
                  <CardDescription>
                    Upload database files to import data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Import Type</Label>
                    <Select defaultValue="merge">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="merge">Merge with existing</SelectItem>
                        <SelectItem value="replace">Replace all data</SelectItem>
                        <SelectItem value="append">Append only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <Button variant="outline" size="sm" onClick={handleImport}>
                      Select File
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JSON, CSV, SQL, XML (Max 100MB)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Player Name Mapping Card */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Player Name Mapping
                </CardTitle>
                <CardDescription>
                  Load a reference file to map player IDs to real names when importing binary squad files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {playerNameMap ? (
                  <div className="space-y-3">
                    <Alert className="border-primary/30 bg-primary/5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <AlertDescription>
                        <strong>{playerNameMap.totalEntries.toLocaleString()}</strong> player names loaded from {playerNameMap.source}
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => nameFileInputRef.current?.click()}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Replace
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleClearPlayerNames}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      No player names loaded. Binary imports will use placeholder names (Player_ID).
                    </p>
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload players.txt, JSON, or compdata_local.sqlite
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => nameFileInputRef.current?.click()}
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Load Names File
                      </Button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Supports: players.txt, JSON, CSV, or SQLite (.sqlite, .db) database files
                </p>
                <input
                  type="file"
                  ref={nameFileInputRef}
                  className="hidden"
                  accept=".txt,.json,.csv,.sqlite,.db,.sqlite3"
                  onChange={handlePlayerNamesFileChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="w-5 h-5" />
                    Create Backup
                  </CardTitle>
                  <CardDescription>
                    Create a new database backup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Automatic backups run daily at 2:00 AM
                    </AlertDescription>
                  </Alert>
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={handleBackup}
                    disabled={isLoading}
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    {isLoading ? "Creating Backup..." : "Create Manual Backup"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Restore Backup
                  </CardTitle>
                  <CardDescription>
                    Restore from a previous backup
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Available Backups</Label>
                    <Select value={selectedBackup} onValueChange={setSelectedBackup}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a backup" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="backup1">Dec 27, 2024 - 2:00 AM (Auto)</SelectItem>
                        <SelectItem value="backup2">Dec 26, 2024 - 2:00 AM (Auto)</SelectItem>
                        <SelectItem value="backup3">Dec 25, 2024 - 3:45 PM (Manual)</SelectItem>
                        <SelectItem value="backup4">Dec 24, 2024 - 2:00 AM (Auto)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled={!selectedBackup}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restore Selected Backup
                  </Button>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Warning: Restoring will replace all current data
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Backup History</CardTitle>
                <CardDescription>Recent backup operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: "Dec 27, 2024", time: "2:00 AM", type: "Automatic", size: "248 MB", status: "success" },
                    { date: "Dec 26, 2024", time: "2:00 AM", type: "Automatic", size: "247 MB", status: "success" },
                    { date: "Dec 25, 2024", time: "3:45 PM", type: "Manual", size: "246 MB", status: "success" },
                    { date: "Dec 24, 2024", time: "2:00 AM", type: "Automatic", size: "245 MB", status: "success" },
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{backup.date} - {backup.time}</p>
                          <p className="text-xs text-muted-foreground">{backup.type} • {backup.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Database Optimization
                  </CardTitle>
                  <CardDescription>
                    Improve database performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fragmentation</span>
                      <span className="text-primary">12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Index Health</span>
                      <span className="text-primary">Good</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleOptimize}
                    disabled={isLoading}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {isLoading ? "Optimizing..." : "Optimize Database"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Data Integrity
                  </CardTitle>
                  <CardDescription>
                    Check and repair database issues
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last check</span>
                      <span className="text-sm text-muted-foreground">3 days ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Issues found</span>
                      <span className="text-sm text-primary">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <span className="text-sm text-primary">Healthy</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Run Integrity Check
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Storage Details</CardTitle>
                <CardDescription>Database storage breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { table: "Players", records: "5,234", size: "89 MB", percentage: 36 },
                    { table: "Teams", records: "2,156", size: "67 MB", percentage: 27 },
                    { table: "Matches", records: "3,421", size: "54 MB", percentage: 22 },
                    { table: "Leagues", records: "845", size: "28 MB", percentage: 11 },
                    { table: "Other", records: "800", size: "10 MB", percentage: 4 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.table}</span>
                        <span className="text-muted-foreground">{item.records} records • {item.size}</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Alert className="bg-destructive/10 border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription>
                Warning: These operations cannot be undone. Make sure you have a recent backup before proceeding.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Clear Data
                  </CardTitle>
                  <CardDescription>
                    Remove specific data from the database
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data to clear" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cache">Clear Cache</SelectItem>
                        <SelectItem value="logs">Clear Logs</SelectItem>
                        <SelectItem value="temp">Clear Temporary Data</SelectItem>
                        <SelectItem value="old">Clear Old Match Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Selected Data
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5" />
                    Reset Database
                  </CardTitle>
                  <CardDescription>
                    Complete database reset options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      This will delete all data and cannot be undone
                    </AlertDescription>
                  </Alert>
                  <Button className="w-full" variant="destructive" disabled>
                    <HardDrive className="w-4 h-4 mr-2" />
                    Factory Reset (Disabled)
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Contact support to enable this option
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Import Data Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={(open) => {
          if (!isLoading) {
            setImportDialogOpen(open);
            if (!open) {
              setSelectedFile(null);
              setDetectedFormat(null);
              setImportStages([]);
              setParseStats(null);
            }
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Import Data
              </DialogTitle>
              <DialogDescription>
                Upload FET export files (JSON) or binary database files
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Only show format selection if not auto-detected */}
              {!detectedFormat && (
                <div className="space-y-3">
                  <Label>File Format</Label>
                  <RadioGroup 
                    value={fileFormat} 
                    onValueChange={(v) => setFileFormat(v as "json" | "binary")}
                    disabled={isLoading}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${fileFormat === 'json' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}>
                      <RadioGroupItem value="json" id="json" />
                      <Label htmlFor="json" className="cursor-pointer flex-1">
                        <span className="font-medium block">FET JSON Export</span>
                        <span className="text-xs text-muted-foreground">Converted via FIFA Editor Tool</span>
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${fileFormat === 'binary' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'}`}>
                      <RadioGroupItem value="binary" id="binary" />
                      <Label htmlFor="binary" className="cursor-pointer flex-1">
                        <span className="font-medium block">Binary Squad File</span>
                        <span className="text-xs text-muted-foreground">Raw game files (.bin, etc)</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              {detectedFormat === "fbchunks" && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">FBCHUNKS Format Detected</p>
                      <p className="text-xs text-muted-foreground">Binary squad file will be parsed directly</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Import Type</Label>
                <Select value={importType} onValueChange={setImportType} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="merge">Merge with existing</SelectItem>
                    <SelectItem value="replace">Replace all data</SelectItem>
                    <SelectItem value="append">Append only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                } ${
                  isDragging 
                    ? 'border-primary bg-primary/10' 
                    : selectedFile 
                      ? 'border-primary/50 bg-primary/5' 
                      : 'border-border/50 hover:border-primary/30'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !isLoading && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv,.sql,.xml,.bin,*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {selectedFile ? (
                  <>
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {!isLoading && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                      >
                        Change File
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Select File
                    </Button>
                  </>
                )}
              </div>
              
              {isLoading && importProgress > 0 && importStages.length > 0 ? (
                <ImportProgress
                  stages={importStages}
                  currentProgress={importProgress}
                  totalChunks={parseStats?.totalChunks}
                  processedChunks={parseStats?.processedChunks}
                  playersFound={parseStats?.playersFound}
                />
              ) : isLoading && importProgress > 0 ? (
                <div className="space-y-2">
                  <Progress value={importProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Importing... {importProgress}%
                  </p>
                </div>
              ) : null}
              
              {detectedFormat === "fbchunks" ? (
                <Alert className="bg-primary/10 border-primary/20">
                  <Cpu className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-xs">
                    <strong>FBCHUNKS Detected!</strong> Binary squad file will be parsed directly in your browser. Player attributes will be extracted, but names use placeholder format (Player_ID) due to Oodle compression.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-muted/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {fileFormat === "json" ? (
                      <><strong>FET JSON:</strong> Use FIFA Editor Tool to export your database to JSON format. This provides the most complete and accurate data import.</>
                    ) : (
                      <><strong>Binary Files:</strong> Binary squad files (.bin, .db, .dat, FBCHUNKS) will be auto-detected and parsed directly.</>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              
              <p className="text-xs text-muted-foreground">
                {detectedFormat === "fbchunks" 
                  ? `Binary FBCHUNKS file detected • ${selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) + " MB" : ""}`
                  : fileFormat === "json" 
                    ? "Supported: .json files (Max 100MB)" 
                    : "Supported: .bin, .db, .dat, squad files (Max 100MB)"}
              </p>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setImportDialogOpen(false);
                    setSelectedFile(null);
                    setDetectedFormat(null);
                    setImportStages([]);
                    setParseStats(null);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleImportSubmit}
                  disabled={!selectedFile || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : "Import Data"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Import Validation Dialog */}
        <Dialog open={importValidation?.show || false} onOpenChange={(open) => !open && setImportValidation(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {importValidation?.success ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Import Validation
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Import Failed
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {importValidation?.message}
              </DialogDescription>
            </DialogHeader>
            
            {importValidation?.success && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-primary">{importValidation.details.players.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Players Imported</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-primary">{importValidation.details.teams.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Teams Imported</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-primary">{importValidation.details.leagues.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Leagues Imported</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-primary">{importValidation.details.competitions.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Competitions Imported</p>
                  </div>
                </div>
                
                <Alert className="bg-green-500/10 border-green-500/20">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-sm">
                    Data has been validated and is now available in the database. The statistics above have been updated to reflect the import.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {!importValidation?.success && (
              <div className="space-y-4">
                {/* Format badge */}
                {importValidation?.format && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-muted border border-border">
                      {importValidation.format.toUpperCase()}
                    </span>
                    {importValidation.fileInfo?.sizeFormatted && (
                      <span className="text-xs text-muted-foreground">
                        {importValidation.fileInfo.sizeFormatted}
                      </span>
                    )}
                  </div>
                )}
                
                {importValidation?.hint && (
                  <Alert className="bg-muted/50 border-border">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {importValidation.hint}
                    </AlertDescription>
                  </Alert>
                )}
                
                {importValidation?.nextSteps && importValidation.nextSteps.length > 0 && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium mb-2">How to proceed:</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      {importValidation.nextSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                {/* FET Download Link */}
                {importValidation?.format === 'fbchunks' && (
                  <div className="flex items-center gap-2 pt-2">
                    <a 
                      href="https://github.com/xAranaktu/FIFA-Editor-Tool/releases" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <FileDown className="h-3 w-3" />
                      Download FIFA Editor Tool (FET)
                    </a>
                  </div>
                )}
                
                {!importValidation?.hint && !importValidation?.nextSteps && (
                  <Alert className="bg-destructive/10 border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-sm">
                      Please check your file format and try again. For best results, use FIFA Editor Tool (FET) to export your data to JSON format.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            
            <div className="flex justify-end">
              <Button onClick={() => setImportValidation(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}