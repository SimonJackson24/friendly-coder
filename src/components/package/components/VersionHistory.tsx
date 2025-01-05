import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PackageVersion, ReleaseNote } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { History } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { VersionMetadata } from "./version/VersionMetadata";
import { VersionDiff } from "./version/VersionDiff";
import { VersionChangelogForm } from "./version/VersionChangelogForm";
import { VersionList } from "./version/VersionList";

interface VersionHistoryProps {
  packageId: string;
}

export function VersionHistory({ packageId }: VersionHistoryProps) {
  const [versions, setVersions] = useState<PackageVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
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

      // Transform the data to ensure package_data is Record<string, any>
      const transformedData = (data || []).map(version => ({
        ...version,
        package_data: version.package_data as Record<string, any>,
        dependency_tree: version.dependency_tree as Record<string, any>,
        resolved_dependencies: version.resolved_dependencies as Record<string, any>,
        conflict_status: version.conflict_status as Record<string, any>
      }));

      setVersions(transformedData);
    } catch (error) {
      console.error("Error fetching versions:", error);
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

  const handleSaveChangelog = async (changelog: string, type: string) => {
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
          changelog_type: type,
          changes: [],
          breaking_changes: []
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Changelog saved successfully"
      });
      
      setShowChangelogEditor(false);
    } catch (error) {
      console.error("Error saving changelog:", error);
      throw error;
    }
  };

  const selectedVersion = versions.find(v => v.id === selectedVersions[0]);
  const previousVersion = versions[versions.findIndex(v => v.id === selectedVersions[0]) + 1];

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
            onClick={() => setCompareMode(!compareMode)}
          >
            {compareMode ? "Exit Compare" : "Compare Versions"}
          </Button>
          {selectedVersions.length === 1 && (
            <Button
              variant="outline"
              onClick={() => setShowChangelogEditor(true)}
            >
              Edit Changelog
            </Button>
          )}
        </div>
      </div>

      <VersionList
        versions={versions}
        selectedVersions={selectedVersions}
        onVersionSelect={handleVersionSelect}
        onViewNotes={(version) => {
          setSelectedVersions([version.id]);
          setShowReleaseNotes(true);
        }}
        compareMode={compareMode}
      />

      {compareMode && selectedVersions.length === 2 && (
        <VersionDiff
          oldVersion={versions.find(v => v.id === selectedVersions[0])!}
          newVersion={versions.find(v => v.id === selectedVersions[1])!}
        />
      )}

      {showChangelogEditor && selectedVersion && (
        <Dialog open={showChangelogEditor} onOpenChange={setShowChangelogEditor}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Changelog - v{selectedVersion.version}</DialogTitle>
            </DialogHeader>
            <VersionChangelogForm
              currentVersion={selectedVersion}
              previousVersion={previousVersion}
              onSave={handleSaveChangelog}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedVersion && (
        <Dialog open={showReleaseNotes} onOpenChange={setShowReleaseNotes}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Version Details - v{selectedVersion.version}</DialogTitle>
            </DialogHeader>
            <VersionMetadata version={selectedVersion} />
            {releaseNotes && (
              <div className="mt-4 space-y-4">
                <h4 className="font-medium">{releaseNotes.title}</h4>
                <p>{releaseNotes.description}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}