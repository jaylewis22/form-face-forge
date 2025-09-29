import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Settings
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DatabasePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState("");

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
    toast({
      title: "Import Database",
      description: "Select a file to import your database backup.",
    });
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
              <CardDescription>Total Size</CardDescription>
              <CardTitle className="text-2xl">248 MB</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={25} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">25% of 1GB limit</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Total Records</CardDescription>
              <CardTitle className="text-2xl">12,456</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Across all tables</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Last Backup</CardDescription>
              <CardTitle className="text-2xl">2 days ago</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Automatic backup enabled</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-2">
              <CardDescription>Database Health</CardDescription>
              <CardTitle className="text-2xl text-primary">Excellent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">No issues detected</p>
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
      </div>
    </AppLayout>
  );
}