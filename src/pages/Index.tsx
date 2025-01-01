import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectList } from "@/components/projects/ProjectList";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { PackageManager } from "@/components/package/PackageManager";
import { DeploymentPanel } from "@/components/deployment/DeploymentPanel";
import { AIDebugger } from "@/components/ai/AIDebugger";
import { ProjectSelector } from "@/components/projects/ProjectSelector";
import { DatabaseDownload } from "@/components/database/DatabaseDownload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, Bug, Rocket, Database, LayoutDashboard, BrainCog } from "lucide-react";
import { useState, useEffect } from "react";
import { ProjectProvider } from "@/contexts/ProjectContext";

export default function Index() {
  const session = useSession();
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    console.log("Session state:", session);
    if (!session) {
      console.log("No session found, redirecting to login");
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) {
    console.log("Rendering null due to no session");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p>Please wait while we initialize your session</p>
        </div>
      </div>
    );
  }

  console.log("Rendering Index page with session:", session?.user?.id);

  return (
    <ProjectProvider>
      <div className="container py-8 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <BrainCog className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                My Projects
              </h1>
              <p className="text-white/80 mt-1">
                Manage and organize your AI-powered projects
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            size="lg"
            className="shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>

        <div className="mb-6">
          <ProjectSelector />
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="w-full justify-start gap-2 p-1 bg-black/40">
            <TabsTrigger value="projects" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Projects
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
              {session.user && <ProjectList userId={session.user.id} />}
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
    </ProjectProvider>
  );
}