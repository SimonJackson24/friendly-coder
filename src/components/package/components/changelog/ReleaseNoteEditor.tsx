import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReleaseNoteEditorProps {
  packageId: string;
  version: string;
  onSave: () => void;
}

export function ReleaseNoteEditor({ packageId, version, onSave }: ReleaseNoteEditorProps) {
  const [title, setTitle] = useState(`Release ${version}`);
  const [description, setDescription] = useState("");
  const [changelogType, setChangelogType] = useState("feature");
  const [impactLevel, setImpactLevel] = useState("minor");
  const [changes, setChanges] = useState<string[]>([]);
  const [breakingChanges, setBreakingChanges] = useState<string[]>([]);
  const [newChange, setNewChange] = useState("");
  const { toast } = useToast();

  const handleAddChange = (isBreaking: boolean) => {
    if (!newChange) return;
    
    if (isBreaking) {
      setBreakingChanges([...breakingChanges, newChange]);
    } else {
      setChanges([...changes, newChange]);
    }
    setNewChange("");
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('release_notes')
        .upsert({
          package_id: packageId,
          version,
          title,
          description,
          changelog_type: changelogType,
          impact_level: impactLevel,
          changes,
          breaking_changes: breakingChanges,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Release notes saved successfully",
      });
      
      onSave();
    } catch (error) {
      console.error('Error saving release notes:', error);
      toast({
        title: "Error",
        description: "Failed to save release notes",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Release title"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Release description"
        />
      </div>

      <div className="flex gap-4">
        <Select value={changelogType} onValueChange={setChangelogType}>
          <SelectTrigger>
            <SelectValue placeholder="Change type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feature">Feature</SelectItem>
            <SelectItem value="bugfix">Bug Fix</SelectItem>
            <SelectItem value="improvement">Improvement</SelectItem>
            <SelectItem value="breaking">Breaking Change</SelectItem>
          </SelectContent>
        </Select>

        <Select value={impactLevel} onValueChange={setImpactLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Impact level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="major">Major</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={newChange}
            onChange={(e) => setNewChange(e.target.value)}
            placeholder="Add a change"
          />
          <Button onClick={() => handleAddChange(false)}>Add Change</Button>
          <Button 
            variant="destructive" 
            onClick={() => handleAddChange(true)}
          >
            Add Breaking Change
          </Button>
        </div>

        <div className="space-y-4">
          {changes.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Changes</h4>
              <ul className="list-disc pl-4">
                {changes.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </div>
          )}

          {breakingChanges.length > 0 && (
            <div>
              <h4 className="font-medium text-destructive mb-2">Breaking Changes</h4>
              <ul className="list-disc pl-4">
                {breakingChanges.map((change, i) => (
                  <li key={i} className="text-destructive">{change}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Button onClick={handleSave}>Save Release Notes</Button>
    </div>
  );
}