import { useState } from "react";
import { ProjectsHeader } from "./ProjectsHeader";
import { ProjectList } from "@/components/projects/ProjectList";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { useSession } from "@supabase/auth-helpers-react";
import { ProjectSelector } from "@/components/projects/ProjectSelector";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Bug, Rocket, Database, LayoutDashboard, GitBranch } from "lucide-react";
import { PackageManager } from "@/components/package/PackageManager";
import { AIDebugger } from "@/components/ai/AIDebugger";
import { DeploymentPanel } from "@/components/deployment/DeploymentPanel";
import { DatabaseDownload } from "@/components/database/DatabaseDownload";
import { WorkflowDashboard } from "@/components/workflow/WorkflowDashboard";
import { useProject } from "@/contexts/ProjectContext";

export function ProjectsLayout() {
  const session = useSession();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { selectedProject } = useProject();

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p>Please wait while we initialize your session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <ProjectsHeader onCreateProject={() => setIsCreateOpen(true)} />

      <div className="mb-6">
        <ProjectSelector />
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="w-full justify-start gap-2 p-1 bg-black/40">
          <TabsTrigger value="projects" className="gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="workflow" className="gap-2">
            <GitBranch className="w-4 h-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="packages" className="gap-2">
            <Package className="w-4 h-4" />
            Packages
          </TabsTrigger>
          <TabsTrigger value="ai-debug" className="gap-2">
            <Bug className="w-4 h-4" />
            AI Debug
          </TabsTrigger>
          <TabsTrigger value="deployment" className="gap-2">
            <Rocket className="w-4 h-4" />
            Deployment
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card className="p-6 bg-black/75 backdrop-blur-md border-white/10">
            <ProjectList userId={session.user.id} />
          </Card>
        </TabsContent>

        <TabsContent value="workflow">
          <Card className="p-6 bg-black/75 backdrop-blur-md border-white/10">
            {selectedProject ? (
              <WorkflowDashboard projectId={selectedProject.id} />
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-400">
                  Please select a project to view workflow management
                </p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="packages">
          <Card className="p-6 bg-black/75 backdrop-blur-md border-white/10">
            <PackageManager />
          </Card>
        </TabsContent>

        <TabsContent value="ai-debug">
          <Card className="p-6 bg-black/75 backdrop-blur-md border-white/10">
            <AIDebugger />
          </Card>
        </TabsContent>

        <TabsContent value="deployment">
          <Card className="p-6 bg-black/75 backdrop-blur-md border-white/10">
            <DeploymentPanel />
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card className="p-6 bg-black/75 backdrop-blur-md border-white/10">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Database Management</h2>
              <DatabaseDownload />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateProjectDialog 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
        userId={session.user.id}
      />
    </div>
  );
}