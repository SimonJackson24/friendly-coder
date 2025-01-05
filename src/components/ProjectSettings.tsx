import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { BrainCog } from "lucide-react";

interface ProjectSettingsProps {
  project: {
    id: string;
    title: string;
    description?: string;
  };
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Studio Project Settings</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Project Name</label>
          <input 
            type="text" 
            className="mt-1 p-2 border rounded" 
            placeholder="Enter project name"
            defaultValue={project.title}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Description</label>
          <textarea 
            className="mt-1 p-2 border rounded" 
            placeholder="Enter project description" 
            rows={3}
            defaultValue={project.description}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="default">Save Changes</Button>
      </div>
    </div>
  );
}