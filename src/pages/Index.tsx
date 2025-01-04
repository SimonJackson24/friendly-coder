import { useSession } from "@supabase/auth-helpers-react";
import { WorkflowDashboard } from "@/components/workflow/WorkflowDashboard";
import { useProject } from "@/contexts/ProjectContext";

export default function Index() {
  const session = useSession();
  const { selectedProject } = useProject();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
          <p className="text-xl text-gray-400">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Select a Project</h1>
          <p className="text-xl text-gray-400">Choose a project from the dropdown above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Dashboard</h1>
      <WorkflowDashboard projectId={selectedProject.id} />
    </div>
  );
}