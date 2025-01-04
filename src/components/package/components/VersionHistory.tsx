import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PackageVersion, ReleaseNote } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { History, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VersionHistoryProps {
  packageId: string;
}

export function VersionHistory({ packageId }: VersionHistoryProps) {
  const [versions, setVersions] = useState<PackageVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [releaseNotes, setReleaseNotes] = useState<ReleaseNote | null>(null);
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVersions();
  }, [packageId]);

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from("package_versions")
        .select("*")
        .eq("package_id", packageId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch version history",
        variant: "destructive"
      });
    }
  };

  const handleVersionSelect = (versionId: string) => {
    if (compareMode) {
      if (selectedVersions.includes(versionId)) {
        setSelectedVersions(selectedVersions.filter(id => id !== versionId));
      } else if (selectedVersions.length < 2) {
        setSelectedVersions([...selectedVersions, versionId]);
      }
    } else {
      setSelectedVersions([versionId]);
    }
  };

  const handleRollback = async (versionId: string) => {
    try {
      const { error } = await supabase.functions.invoke('package-operations', {
        body: { 
          operation: 'rollback-version',
          data: { packageId, versionId }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully rolled back to previous version",
      });

      fetchVersions();
    } catch (error) {
      console.error('Error rolling back version:', error);
      toast({
        title: "Error",
        description: "Failed to rollback version",
        variant: "destructive"
      });
    }
  };

  const viewReleaseNotes = async (version: PackageVersion) => {
    try {
      const { data, error } = await supabase
        .from("release_notes")
        .select("*")
        .eq("version", version.version)
        .eq("package_id", packageId)
        .single();

      if (error) throw error;
      setReleaseNotes(data);
      setShowReleaseNotes(true);
    } catch (error) {
      console.error('Error fetching release notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch release notes",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <History className="w-5 h-5" />
          Version History
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCompareMode(!compareMode)}
        >
          {compareMode ? "Exit Compare" : "Compare Versions"}
        </Button>
      </div>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`p-2 rounded hover:bg-accent flex justify-between items-center ${
                selectedVersions.includes(version.id) ? "bg-accent" : ""
              }`}
              onClick={() => handleVersionSelect(version.id)}
            >
              <div>
                <div className="font-medium">v{version.version}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(version.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    viewReleaseNotes(version);
                  }}
                >
                  Notes
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRollback(version.id);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {compareMode && selectedVersions.length === 2 && (
        <div className="mt-4 p-4 border rounded">
          <div className="flex justify-between items-center mb-2">
            <div>
              v{versions.find(v => v.id === selectedVersions[0])?.version}
              <ArrowRight className="inline mx-2" />
              v{versions.find(v => v.id === selectedVersions[1])?.version}
            </div>
          </div>
          {/* Add diff viewer here if needed */}
        </div>
      )}

      <Dialog open={showReleaseNotes} onOpenChange={setShowReleaseNotes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Release Notes - v{releaseNotes?.version}</DialogTitle>
          </DialogHeader>
          {releaseNotes && (
            <div className="space-y-4">
              <h4 className="font-medium">{releaseNotes.title}</h4>
              <p>{releaseNotes.description}</p>
              
              {releaseNotes.changes.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Changes</h5>
                  <ul className="list-disc pl-4">
                    {releaseNotes.changes.map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}

              {releaseNotes.breaking_changes.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2 text-destructive">Breaking Changes</h5>
                  <ul className="list-disc pl-4">
                    {releaseNotes.breaking_changes.map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}