import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectList } from "@/components/projects/ProjectList";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { PackageManager } from "@/components/package/PackageManager";
import { DeploymentPanel } from "@/components/deployment/DeploymentPanel";
import { AIDebugger } from "@/components/ai/AIDebugger";
import { GitHubExport } from "@/components/github/GitHubExport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Package, Bug, Github, Rocket, FolderGit2 } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const session = useSession();
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  if (!session) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your projects and development tools
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          New Project
        </Button>
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
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Package Manager</h3>
                <p className="text-muted-foreground">
                  Install, update, and manage your project dependencies
                </p>
              </div>
              <PackageManager />
            </TabsContent>

            <TabsContent value="ai-debug" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">AI Debugger</h3>
                <p className="text-muted-foreground">
                  Get intelligent insights and fixes for your code
                </p>
              </div>
              <AIDebugger />
            </TabsContent>

            <TabsContent value="deployment" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Deployment</h3>
                <p className="text-muted-foreground">
                  Deploy your projects to various platforms
                </p>
              </div>
              <DeploymentPanel />
            </TabsContent>

            <TabsContent value="github" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">GitHub Export</h3>
                <p className="text-muted-foreground">
                  Export your projects directly to GitHub repositories
                </p>
              </div>
              <GitHubExport />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <CreateProjectDialog 
        isOpen={isCreateOpen} 
        onOpenChange={setIsCreateOpen}
        userId={session.user.id}
      />
    </div>
  );
}