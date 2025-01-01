import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileNode } from "@/hooks/useFileSystem";
import Editor from "@monaco-editor/react";
import { saveVersion, getFileVersions, VersionEntry } from "@/utils/versionControl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Save } from "lucide-react";
import Logger from "@/utils/logger";

interface FileEditorProps {
  file: FileNode | null;
  onSave?: (id: string, content: string) => void;
  projectId?: string;
}

export function FileEditor({ file, onSave, projectId }: FileEditorProps) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (file?.content) {
      setContent(file.content);
      setOriginalContent(file.content);
      loadVersions();
    }
  }, [file]);

  const loadVersions = async () => {
    if (!file || !projectId) return;
    
    try {
      setIsLoadingVersions(true);
      const fileVersions = await getFileVersions(projectId, file.id);
      setVersions(fileVersions);
    } catch (error) {
      Logger.log('error', 'Failed to load versions', { error });
      toast({
        title: "Error",
        description: "Failed to load file versions",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleSave = async () => {
    if (!file || !projectId) return;
    
    try {
      // Save the current version
      await saveVersion(projectId, file.id, content, "Manual save");
      
      // Update the file
      onSave?.(file.id, content);
      setOriginalContent(content);
      
      // Reload versions
      await loadVersions();
      
      toast({
        title: "Success",
        description: "File saved and version created",
      });
    } catch (error) {
      Logger.log('error', 'Failed to save file and create version', { error });
      toast({
        title: "Error",
        description: "Failed to save file",
        variant: "destructive",
      });
    }
  };

  const handleVersionSelect = (version: VersionEntry) => {
    setContent(version.content);
    toast({
      title: "Version loaded",
      description: `Loaded version ${version.version_number}`,
    });
  };

  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      default:
        return 'plaintext';
    }
  };

  const hasChanges = content !== originalContent;

  if (!file) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground">Select a file to edit</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{file.name}</h2>
            {hasChanges && (
              <span className="text-sm text-yellow-500">
                (Unsaved changes)
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowVersions(!showVersions)}
              disabled={isLoadingVersions}
            >
              <History className="h-4 w-4 mr-2" />
              {isLoadingVersions ? "Loading..." : "History"}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
        <Editor
          height="500px"
          language={getLanguage(file.name)}
          value={content}
          onChange={(value) => setContent(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </Card>

      {showVersions && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Version History</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-2 hover:bg-accent rounded-lg cursor-pointer"
                  onClick={() => handleVersionSelect(version)}
                >
                  <div>
                    <div className="font-medium">Version {version.version_number}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(version.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm">
                    {version.build_status === 'success' ? (
                      <span className="text-green-500">✓</span>
                    ) : version.build_status === 'error' ? (
                      <span className="text-red-500">✗</span>
                    ) : (
                      <span className="text-yellow-500">⋯</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}