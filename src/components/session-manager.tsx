"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Save,
  FolderOpen,
  Trash2,
  MoreVertical,
  Download,
  Upload,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { storageService, SavedSession } from "@/lib/storage";
import { Progress } from "@/components/ui/progress";

interface SessionManagerProps {
  onLoadSession?: (sessionId: string) => void;
  onNewSession?: () => void;
  currentSessionId?: string;
}

export function SessionManager({ onLoadSession, onNewSession, currentSessionId }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Array<{
    id: string;
    createdAt: string;
    updatedAt: string;
    metadata: SavedSession["metadata"];
  }>>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: false, sessionCount: 0 });

  // Load sessions on mount
  useEffect(() => {
    refreshSessions();
  }, []);

  const refreshSessions = () => {
    const allSessions = storageService.getAllSessions();
    setSessions(allSessions);
    setStorageInfo(storageService.getStorageInfo());
  };

  const handleLoadSession = (sessionId: string) => {
    if (onLoadSession) {
      onLoadSession(sessionId);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    if (storageService.deleteSession(sessionId)) {
      refreshSessions();
      setIsDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleExportSession = (sessionId: string) => {
    const sessionData = storageService.exportSession(sessionId);
    if (sessionData) {
      const blob = new Blob([sessionData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `interview-session-${sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportSession = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const importedSession = storageService.importSession(content);
        if (importedSession) {
          refreshSessions();
        }
      };
      reader.readAsText(file);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStepLabel = (step: string) => {
    switch (step) {
      case "setup":
        return "Setup";
      case "script":
        return "Script Preparation";
      case "execute":
        return "Interview Execution";
      case "complete":
        return "Completed";
      default:
        return step;
    }
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case "setup":
        return <FileText className="h-4 w-4" />;
      case "script":
        return <AlertCircle className="h-4 w-4" />;
      case "execute":
        return <Clock className="h-4 w-4" />;
      case "complete":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Saved Interviews</CardTitle>
              <CardDescription>
                Resume your work or start a new interview session
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("import-file")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportSession}
              />
              <Button onClick={onNewSession}>
                <Plus className="h-4 w-4 mr-2" />
                New Interview
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Storage info */}
      {storageInfo.available && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                {storageInfo.sessionCount} saved session{storageInfo.sessionCount !== 1 ? "s" : ""} ({storageInfo.used} KB used)
              </span>
              {storageInfo.sessionCount > 15 && (
                <span className="text-yellow-600">
                  Consider exporting old sessions to free up space
                </span>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Save className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No saved interviews yet</p>
            <Button onClick={onNewSession}>
              <Plus className="h-4 w-4 mr-2" />
              Start Your First Interview
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                currentSessionId === session.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleLoadSession(session.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      {session.metadata.companyName || "Untitled Interview"}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {session.metadata.positionTitle || "No position specified"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleLoadSession(session.id);
                      }}>
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Load Session
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleExportSession(session.id);
                      }}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSessionToDelete(session.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{session.metadata.progress}%</span>
                  </div>
                  <Progress value={session.metadata.progress} className="h-2" />
                </div>

                {/* Status badges */}
                <div className="flex items-center gap-2">
                  <Badge variant={session.metadata.completed ? "success" : "secondary"}>
                    <span className="flex items-center gap-1">
                      {getStepIcon(session.metadata.currentStep)}
                      {getStepLabel(session.metadata.currentStep)}
                    </span>
                  </Badge>
                  {currentSessionId === session.id && (
                    <Badge variant="outline">Current</Badge>
                  )}
                </div>

                {/* Timestamps */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{formatDate(session.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updated:</span>
                    <span>{formatDate(session.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Interview Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this saved interview? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}