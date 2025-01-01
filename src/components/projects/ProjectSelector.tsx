import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProject } from "@/contexts/ProjectContext";

export function ProjectSelector() {
  const { selectedProject, setSelectedProject } = useProject();

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="w-[200px]">
      <Select
        value={selectedProject?.id || ""}
        onValueChange={(value) => {
          const project = projects.find((p) => p.id === value);
          setSelectedProject(project || null);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}