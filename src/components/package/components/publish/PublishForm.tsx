import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface PublishFormProps {
  name: string;
  version: string;
  description: string;
  isPrivate: boolean;
  isValidating: boolean;
  isPublishing: boolean;
  onNameChange: (value: string) => void;
  onVersionChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPrivateChange: (value: boolean) => void;
  onPublish: () => void;
}

export function PublishForm({
  name,
  version,
  description,
  isPrivate,
  isValidating,
  isPublishing,
  onNameChange,
  onVersionChange,
  onDescriptionChange,
  onPrivateChange,
  onPublish,
}: PublishFormProps) {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Package name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      
      <Input
        placeholder="Version (e.g. 1.0.0)"
        value={version}
        onChange={(e) => onVersionChange(e.target.value)}
      />
      
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="private"
          checked={isPrivate}
          onChange={(e) => onPrivateChange(e.target.checked)}
        />
        <label htmlFor="private">Private package</label>
      </div>
      
      <Button 
        onClick={onPublish}
        disabled={!name || !version || isValidating || isPublishing}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isValidating ? "Validating..." : isPublishing ? "Publishing..." : "Publish Package"}
      </Button>
    </div>
  );
}