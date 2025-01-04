import { ProjectSettings } from "@/components/ProjectSettings";

interface SettingsContainerProps {
  project: any;
}

export function SettingsContainer({ project }: SettingsContainerProps) {
  return (
    <div className="h-full">
      <ProjectSettings project={project} />
    </div>
  );
}