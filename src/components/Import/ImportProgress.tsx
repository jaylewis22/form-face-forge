import { Progress } from "@/components/ui/progress";
import { Loader2, FileSearch, Cpu, Database, CheckCircle, AlertCircle } from "lucide-react";

export interface ImportStage {
  id: string;
  label: string;
  status: "pending" | "active" | "complete" | "error";
  detail?: string;
}

interface ImportProgressProps {
  stages: ImportStage[];
  currentProgress: number;
  totalChunks?: number;
  processedChunks?: number;
  playersFound?: number;
}

export function ImportProgress({
  stages,
  currentProgress,
  totalChunks,
  processedChunks,
  playersFound,
}: ImportProgressProps) {
  const getIcon = (status: ImportStage["status"]) => {
    switch (status) {
      case "pending":
        return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />;
      case "active":
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
      case "complete":
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <Progress value={currentProgress} className="h-2" />
        <p className="text-xs text-muted-foreground text-center">
          {currentProgress}% Complete
        </p>
      </div>

      {/* Stage List */}
      <div className="space-y-2">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
              stage.status === "active"
                ? "bg-primary/10"
                : stage.status === "complete"
                ? "bg-primary/5"
                : ""
            }`}
          >
            {getIcon(stage.status)}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  stage.status === "active"
                    ? "text-primary"
                    : stage.status === "complete"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {stage.label}
              </p>
              {stage.detail && (
                <p className="text-xs text-muted-foreground truncate">
                  {stage.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chunk Stats */}
      {totalChunks !== undefined && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{totalChunks}</p>
            <p className="text-xs text-muted-foreground">Total Chunks</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{processedChunks ?? 0}</p>
            <p className="text-xs text-muted-foreground">Processed</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{playersFound ?? 0}</p>
            <p className="text-xs text-muted-foreground">Players Found</p>
          </div>
        </div>
      )}
    </div>
  );
}
