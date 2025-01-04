import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PackageVersion, ReleaseNote } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { History } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { VersionDiffViewer } from "./version/VersionDiffViewer";
import { ChangelogEditor } from "./changelog/ChangelogEditor";
import { VersionList } from "./version/VersionList";
import { CompareVersions } from "./version/CompareVersions";

interface VersionHistoryProps {
  packageId: string;
}

export function VersionHistory({ packageId }: VersionHistoryProps) {
  const [versions, setVersions] = useState<PackageVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [showDiffViewer, setShowDiffViewer] = useState(false);
  const [showChangelogEditor, setShowChangelogEditor] = useState(false);
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

      const parsedVersions: PackageVersion[] = (data || []).map(version => ({
        ...version,
        dependency_tree: typeof version.dependency_tree === 'string' 
          ? JSON.parse(version.dependency_tree) 
          : version.dependency_tree || {},
        resolved_dependencies: typeof version.resolved_dependencies === 'string'
          ? JSON.parse(version.resolved_dependencies)
          : version.resolved_dependencies || {},
        conflict_status: typeof version.conflict_status === 'string'
          ? JSON.parse(version.conflict_status)
          : version.conflict_status || {},
        package_data: typeof version.package_data === 'string'
          ? JSON.parse(version.package_data)
          : version.package_data || {}
      }));

      setVersions(parsedVersions);
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

  const handleSaveChangelog = async (changelog: string) => {
    if (!selectedVersions[0]) return;
    
    const version = versions.find(v => v.id === selectedVersions[0]);
    if (!version) return;

    try {
      const { error } = await supabase
        .from("release_notes")
        .upsert({
          package_id: packageId,
          version: version.version,
          title: `Release ${version.version}`,
          description: changelog,
          changes: [],
          breaking_changes: []
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Changelog saved successfully",
      });
      
      setShowChangelogEditor(false);
    } catch (error) {
      console.error('Error saving changelog:', error);
      toast({
        title: "Error",
        description: "Failed to save changelog",
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCompareMode(!compareMode)}
          >
            {compareMode ? "Exit Compare" : "Compare Versions"}
          </Button>
          {selectedVersions.length === 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChangelogEditor(true)}
            >
              Edit Changelog
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="h-[200px]">
        <VersionList
          versions={versions}
          selectedVersions={selectedVersions}
          onVersionSelect={handleVersionSelect}
          onViewNotes={(version) => {
            setSelectedVersions([version.id]);
            setShowReleaseNotes(true);
          }}
          onRollback={handleRollback}
        />
      </ScrollArea>

      {compareMode && selectedVersions.length === 2 && (
        <CompareVersions
          selectedVersions={selectedVersions}
          versions={versions}
          onShowDiff={() => setShowDiffViewer(true)}
        />
      )}

      <Dialog open={showDiffViewer} onOpenChange={setShowDiffViewer}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Version Comparison</DialogTitle>
          </DialogHeader>
          {selectedVersions.length === 2 && (
            <VersionDiffViewer
              oldVersion={versions.find(v => v.id === selectedVersions[0])!}
              newVersion={versions.find(v => v.id === selectedVersions[1])!}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showChangelogEditor} onOpenChange={setShowChangelogEditor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Changelog</DialogTitle>
          </DialogHeader>
          {selectedVersions.length === 1 && (
            <ChangelogEditor
              version={versions.find(v => v.id === selectedVersions[0])!}
              previousVersion={versions[versions.findIndex(v => v.id === selectedVersions[0]) + 1]}
              onSave={handleSaveChangelog}
            />
          )}
        </DialogContent>
      </Dialog>

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