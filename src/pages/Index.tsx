import { ProjectProvider } from "@/contexts/ProjectContext";
import { ProjectsLayout } from "@/modules/projects/components/layout/ProjectsLayout";

export default function Index() {
  return (
    <ProjectProvider>
      <ProjectsLayout />
    </ProjectProvider>
  );
}