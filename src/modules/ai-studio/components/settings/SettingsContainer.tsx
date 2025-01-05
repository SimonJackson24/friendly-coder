import { ProjectSettings } from "@/components/ProjectSettings";

interface Project {
  id: string;
  title: string;
  description?: string;
}

interface SettingsContainerProps {
  project: Project;
}

export function SettingsContainer({ project }: SettingsContainerProps) {
  return (
    <div className="h-full">
      <ProjectSettings project={project} />
    </div>
  );
}