import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectList } from "@/components/projects/ProjectList";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { ImportProjectDialog } from "@/components/projects/ImportProjectDialog";
import { PackageManager } from "@/components/package/PackageManager";
import { DeploymentPanel } from "@/components/deployment/DeploymentPanel";
import { AIDebugger } from "@/components/ai/AIDebugger";
import { GitHubExport } from "@/components/github/GitHubExport";
import { ProjectSelector } from "@/components/projects/ProjectSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Package, Bug, Github, Rocket, FolderGit2, Upload } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const session = useSession();
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const { toast } = useToast();

  if (!session) {
    navigate("/login");
    return null;
  }

  const handleProjectSelect = (projectId: string) => {
    console.log("Selected project:", projectId);
    setSelectedProjectId(projectId);
  };

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your projects and development tools
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsImportOpen(true)}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Upload className="w-5 h-5" />
            Import Project
          </Button>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            size="lg"
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FolderGit2 className="w-6 h-6 text-primary" />
              Your Projects
            </h2>
            <p className="text-muted-foreground">
              Access and manage your development projects
            </p>
          </div>
          <ProjectList userId={session.user.id} />
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Project Tools</h2>
            <div className="mt-4">
              <ProjectSelector 
                value={selectedProjectId} 
                onValueChange={handleProjectSelect} 
              />
            </div>
          </div>

          <Tabs defaultValue="packages" className="space-y-6">
            <TabsList className="grid grid-cols-4 gap-4 bg-muted/50 p-1">
              <TabsTrigger value="packages" className="gap-2">
                <Package className="w-4 h-4" />
                Package Manager
              </TabsTrigger>
              <TabsTrigger value="ai-debug" className="gap-2">
                <Bug className="w-4 h-4" />
                AI Debug
              </TabsTrigger>
              <TabsTrigger value="deployment" className="gap-2">
                <Rocket className="w-4 h-4" />
                Deployment
              </TabsTrigger>
              <TabsTrigger value="github" className="gap-2">
                <Github className="w-4 h-4" />
                GitHub Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="packages" className="space-y-4">
              {selectedProjectId ? (
                <PackageManager projectId={selectedProjectId} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Please select a project to manage packages
                </div>
              )}
            </TabsContent>

            <TabsContent value="ai-debug" className="space-y-4">
              {selectedProjectId ? (
                <AIDebugger projectId={selectedProjectId} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Please select a project to use AI debugging
                </div>
              )}
            </TabsContent>

            <TabsContent value="deployment" className="space-y-4">
              {selectedProjectId ? (
                <DeploymentPanel projectId={selectedProjectId} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Please select a project to manage deployment
                </div>
              )}
            </TabsContent>

            <TabsContent value="github" className="space-y-4">
              {selectedProjectId ? (
                <GitHubExport projectId={selectedProjectId} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Please select a project to export to GitHub
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <CreateProjectDialog 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
        userId={session.user.id}
      />
      <ImportProjectDialog
        isOpen={isImportOpen}
        onOpenChange={setIsImportOpen}
        userId={session.user.id}
      />
    </div>
  );
}
