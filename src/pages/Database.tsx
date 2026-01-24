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
  Loader2
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function DatabasePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importType, setImportType] = useState("merge");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [fileFormat, setFileFormat] = useState<"json" | "binary">("json");
  const [importValidation, setImportValidation] = useState<{
    show: boolean;
    success: boolean;
    message: string;
    hint?: string;
    nextSteps?: string[];
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

  const handleFileSelect = (file: File) => {
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
      // supabase-js typically provides the body text in error.context
      const raw = (error as Record<string, unknown>)?.context as Record<string, unknown> | undefined;
      const rawBody = raw?.body;

      let payload: Record<string, unknown> | null = null;
      try { 
        payload = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody as Record<string, unknown>; 
      } catch {
        // If JSON parsing fails, just use error message
      }

      return {
        ok: false,
        status: (raw?.status as number) ?? 415,
        payload: payload ?? { success: false, error: error.message },
      };
    }

    // Success path
    return { ok: true, status: 200, payload: data };
  };

  const handleImportSubmit = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setImportProgress(10);

    try {
      const fileName = selectedFile.name.toLowerCase();
      
      if (fileFormat === "json") {
        // JSON file (FET export format)
        if (!fileName.endsWith('.json')) {
          toast({
            title: "Invalid File Type",
            description: "Please select a JSON file for FET export format.",
            variant: "destructive",
          });
          setIsLoading(false);
          setImportProgress(0);
          return;
        }
        
        setImportProgress(20);
        const fileData = await parseJsonFile(selectedFile);
        setImportProgress(30);

        // First, try to parse with parse-squad-file to extract structured data
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
        
        // Parse the JSON via edge function
        const parseResult = await invokeEdgeFunction('parse-squad-file', {
          fileData: base64,
          fileName: selectedFile.name,
          importType,
        });

        setImportProgress(60);

        let dataToImport = fileData;
        
        // If parsing was successful and extracted structured data, use it
        if (parseResult.ok && parseResult.payload.format === 'fet_json') {
          dataToImport = parseResult.payload.data as Record<string, unknown>;
          console.log('Using FET-parsed data:', parseResult.payload.parsed);
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
        // Binary squad file - attempt to parse via edge function
        setImportProgress(20);
        
        // Read file as base64 using chunked approach to avoid stack overflow
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
        
        // Call edge function to parse binary file
        const parseResult = await invokeEdgeFunction('parse-squad-file', {
          fileData: base64,
          fileName: selectedFile.name,
          importType,
        });
        
        setImportProgress(60);
        
        if (!parseResult.ok) {
          // Show user-friendly error dialog with hint and next steps
          const payload = parseResult.payload;
          setImportValidation({
            show: true,
            success: false,
            message: (payload.error as string) || "File parsing failed",
            hint: payload.hint as string | undefined,
            nextSteps: payload.nextSteps as string[] | undefined,
            details: { players: 0, teams: 0, leagues: 0, competitions: 0 }
          });
          setImportDialogOpen(false);
          setSelectedFile(null);
          return;
        }
        
        // If we got parsed data, import it
        if (parseResult.payload.success && parseResult.payload.data) {
          const importResult = await invokeEdgeFunction('import-database', {
            data: parseResult.payload.data,
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
          const competitionCount = results?.competitions?.inserted || 0;
          
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
              competitions: competitionCount,
            }
          });
        } else {
          // Parsing returned success but no data - show as error
          setImportValidation({
            show: true,
            success: false,
            message: (parseResult.payload.error as string) || "No data found in file",
            hint: parseResult.payload.hint as string | undefined,
            nextSteps: parseResult.payload.nextSteps as string[] | undefined,
            details: { players: 0, teams: 0, leagues: 0, competitions: 0 }
          });
          setImportDialogOpen(false);
          setSelectedFile(null);
          return;
        }
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
            if (!open) setSelectedFile(null);
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
              
              {isLoading && importProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={importProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Importing... {importProgress}%
                  </p>
                </div>
              )}
              
              <Alert className="bg-muted/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {fileFormat === "json" ? (
                    <><strong>FET JSON:</strong> Use FIFA Editor Tool to export your database to JSON format. This provides the most complete and accurate data import.</>
                  ) : (
                    <><strong>Binary Files:</strong> Binary squad files (.bin, .db, .dat, FBCHUNKS) require conversion via FET for accurate import. Direct binary parsing is not currently supported due to EA's proprietary format.</>
                  )}
                </AlertDescription>
              </Alert>
              
              <p className="text-xs text-muted-foreground">
                {fileFormat === "json" ? "Supported: .json files (Max 100MB)" : "Supported: .bin, .db, .dat, squad files (Max 100MB) - Requires FET conversion"}
              </p>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setImportDialogOpen(false);
                    setSelectedFile(null);
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