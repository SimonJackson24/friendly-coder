import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PackageVersion } from "../../types";
import { generateChangelog } from "./changelogUtils";

interface ChangelogEditorProps {
  version: PackageVersion;
  previousVersion?: PackageVersion;
  onSave: (changelog: string) => void;
}

export function ChangelogEditor({ version, previousVersion, onSave }: ChangelogEditorProps) {
  const [changelog, setChangelog] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateChangelog = async () => {
    setIsGenerating(true);
    try {
      const generatedChangelog = await generateChangelog(version, previousVersion);
      setChangelog(generatedChangelog);
    } catch (error) {
      console.error("Error generating changelog:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Changelog for v{version.version}</h3>
        <Button 
          onClick={handleGenerateChangelog}
          disabled={isGenerating}
        >
          Generate Changelog
        </Button>
      </div>
      
      <Textarea
        value={changelog}
        onChange={(e) => setChangelog(e.target.value)}
        placeholder="Enter changelog details..."
        className="min-h-[200px]"
      />
      
      <Button onClick={() => onSave(changelog)}>
        Save Changelog
      </Button>
    </div>
  );
}