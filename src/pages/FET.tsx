import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Download, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FET() {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [validationStatus, setValidationStatus] = useState<"idle" | "valid" | "invalid" | "warning">("idle");
  const [dbUpdateAvailable, setDbUpdateAvailable] = useState(true);

  // Mock current versions
  const [currentFETVersion] = useState("24.1.5");
  const [currentDBVersion] = useState("24.1.4");
  const [latestDBVersion] = useState("24.1.5");

  const handleValidate = async () => {
    setIsValidating(true);
    setValidationStatus("idle");

    // Simulate validation
    setTimeout(() => {
      setValidationStatus("valid");
      setIsValidating(false);
      toast({
        title: "Validation Complete",
        description: "FIFA Editor Tool is compatible with current database.",
      });
    }, 2000);
  };

  const handleUpdateDatabase = async () => {
    setIsUpdating(true);
    setUpdateProgress(0);

    // Simulate database update with progress
    const interval = setInterval(() => {
      setUpdateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUpdating(false);
          setDbUpdateAvailable(false);
          toast({
            title: "Database Updated",
            description: "Successfully updated to version 24.1.5",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const updateChanges = [
    { category: "Player Attributes", description: "Updated player stats for Winter transfers" },
    { category: "Team Rosters", description: "Added new team formations and tactics" },
    { category: "Stadium Data", description: "Updated stadium capacities and attributes" },
    { category: "Player Faces", description: "New face IDs for January signings" },
    { category: "Leagues", description: "Updated league structure for 2024/25 season" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">FIFA Editor Tool Validation</h1>
          <p className="text-muted-foreground">
            Validate FET compatibility and update database with latest title updates
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Version Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Version Information
              </CardTitle>
              <CardDescription>Current tool and database versions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">FET Version</span>
                <Badge variant="default">{currentFETVersion}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Database Version</span>
                <Badge variant={dbUpdateAvailable ? "secondary" : "default"}>
                  {currentDBVersion}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Latest DB Version</span>
                <Badge variant="outline">{latestDBVersion}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Validation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {validationStatus === "valid" && <CheckCircle className="w-5 h-5 text-success" />}
                {validationStatus === "invalid" && <XCircle className="w-5 h-5 text-destructive" />}
                {validationStatus === "warning" && <AlertCircle className="w-5 h-5 text-warning" />}
                Validation Status
              </CardTitle>
              <CardDescription>Check FET compatibility with database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {validationStatus === "idle" && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Click validate to check compatibility between FET and database versions.
                  </AlertDescription>
                </Alert>
              )}

              {validationStatus === "valid" && (
                <Alert className="border-success">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    FET version {currentFETVersion} is fully compatible with the current database.
                  </AlertDescription>
                </Alert>
              )}

              {validationStatus === "invalid" && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Compatibility issues detected. Please update your database or FET version.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleValidate} 
                disabled={isValidating}
                className="w-full"
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Validate Compatibility
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Database Update Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Database Update
              </span>
              {dbUpdateAvailable && (
                <Badge variant="destructive">Update Available</Badge>
              )}
            </CardTitle>
            <CardDescription>
              {dbUpdateAvailable 
                ? "A new title update is available with database changes"
                : "Database is up to date"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dbUpdateAvailable && (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Title Update 24.1.5 includes changes that affect database records. Update recommended.
                  </AlertDescription>
                </Alert>

                <div>
                  <h4 className="font-semibold mb-3">Changes in this update:</h4>
                  <div className="space-y-2">
                    {updateChanges.map((change, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium">{change.category}:</span>
                          <span className="text-muted-foreground ml-1">{change.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {isUpdating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Updating database...</span>
                      <span>{updateProgress}%</span>
                    </div>
                    <Progress value={updateProgress} />
                  </div>
                )}

                <Button 
                  onClick={handleUpdateDatabase} 
                  disabled={isUpdating}
                  className="w-full"
                  size="lg"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Updating Database... {updateProgress}%
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Update Database to v{latestDBVersion}
                    </>
                  )}
                </Button>
              </>
            )}

            {!dbUpdateAvailable && (
              <Alert className="border-success">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  Your database is up to date with version {currentDBVersion}. No updates required.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Update History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Database update history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { version: "24.1.4", date: "2024-03-15", changes: "Winter transfer window updates" },
                { version: "24.1.3", date: "2024-02-28", changes: "Player attribute rebalancing" },
                { version: "24.1.2", date: "2024-02-10", changes: "New stadium data and team kits" },
              ].map((update, index) => (
                <div key={index} className="flex justify-between items-start p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">v{update.version}</Badge>
                      <span className="text-sm font-medium">{update.changes}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{update.date}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
