import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Package Name</Label>
        <Input
          id="name"
          placeholder="e.g., my-awesome-package"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="version">Version</Label>
        <Input
          id="version"
          placeholder="e.g., 1.0.0"
          value={version}
          onChange={(e) => onVersionChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Package description..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full min-h-[100px]"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="private"
          checked={isPrivate}
          onCheckedChange={onPrivateChange}
        />
        <Label htmlFor="private">Private package</Label>
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