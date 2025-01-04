import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { generateChangelog } from "../../utils/changelogGenerator";
import { PackageVersion } from "../../types";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface VersionChangelogFormProps {
  currentVersion: PackageVersion;
  previousVersion?: PackageVersion;
  onSave: (changelog: string, type: string) => Promise<void>;
}

export function VersionChangelogForm({
  currentVersion,
  previousVersion,
  onSave
}: VersionChangelogFormProps) {
  const [changelog, setChangelog] = useState("");
  const [changeType, setChangeType] = useState("feature");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleGenerateChangelog = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateChangelog(currentVersion, previousVersion);
      setChangelog(generated);
    } catch (error) {
      console.error("Error generating changelog:", error);
      toast({
        title: "Error",
        description: "Failed to generate changelog",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!changelog.trim()) {
      toast({
        title: "Error",
        description: "Please enter a changelog message",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave(changelog, changeType);
      toast({
        title: "Success",
        description: "Changelog saved successfully"
      });
    } catch (error) {
      console.error("Error saving changelog:", error);
      toast({
        title: "Error",
        description: "Failed to save changelog",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Edit Changelog</h3>
        <Button
          variant="outline"
          onClick={handleGenerateChangelog}
          disabled={isGenerating}
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Automatically
        </Button>
      </div>

      <Select
        value={changeType}
        onValueChange={setChangeType}
      >
        <option value="feature">Feature</option>
        <option value="bugfix">Bug Fix</option>
        <option value="breaking">Breaking Change</option>
        <option value="maintenance">Maintenance</option>
      </Select>

      <Textarea
        value={changelog}
        onChange={(e) => setChangelog(e.target.value)}
        placeholder="Enter changelog details..."
        className="min-h-[200px]"
      />

      <div className="flex justify-end gap-2">
        <Button
          onClick={handleSave}
          disabled={isSaving || !changelog.trim()}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changelog
        </Button>
      </div>
    </Card>
  );
}