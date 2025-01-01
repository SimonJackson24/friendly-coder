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
import { Plus, Package, Bug, Github, Rocket } from "lucide-react";
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
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="packages">
            <Package className="w-4 h-4 mr-2" />
            Package Manager
          </TabsTrigger>
          <TabsTrigger value="ai-debug">
            <Bug className="w-4 h-4 mr-2" />
            AI Debug
          </TabsTrigger>
          <TabsTrigger value="deployment">
            <Rocket className="w-4 h-4 mr-2" />
            Deployment
          </TabsTrigger>
          <TabsTrigger value="github">
            <Github className="w-4 h-4 mr-2" />
            GitHub Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card className="p-4">
            <ProjectList userId={session.user.id} />
          </Card>
        </TabsContent>

        <TabsContent value="packages">
          <Card className="p-4">
            <PackageManager />
          </Card>
        </TabsContent>

        <TabsContent value="ai-debug">
          <Card className="p-4">
            <AIDebugger />
          </Card>
        </TabsContent>

        <TabsContent value="deployment">
          <Card className="p-4">
            <DeploymentPanel />
          </Card>
        </TabsContent>

        <TabsContent value="github">
          <Card className="p-4">
            <GitHubExport />
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