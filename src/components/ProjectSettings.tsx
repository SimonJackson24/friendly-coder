/**
 * Copyright (c) 2024 AI Studio. All rights reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - shadcn/ui components: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * - React Query: MIT License (https://github.com/TanStack/query/blob/main/LICENSE)
 * - @supabase/auth-helpers-react: MIT License (https://github.com/supabase/auth-helpers/blob/main/LICENSE)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description?: string;
}

interface ProjectSettingsProps {
  project: Project;
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || "");

  const handleSave = async () => {
    const { error } = await supabase
      .from("projects")
      .update({ title, description })
      .eq("id", project.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update project settings. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Project settings updated successfully.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Project Settings</h2>
      <div>
        <label className="block text-sm font-medium">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
        />
      </div>
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
