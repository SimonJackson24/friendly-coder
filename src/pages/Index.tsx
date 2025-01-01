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
import { Plus, Package, Bug, Github, Rocket, FolderGit2, Upload, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#1a1f2c] to-gray-900">
      <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-[#9b87f5] animate-pulse" />
              <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6]">
                AI Dashboard
              </h1>
            </div>
            <p className="text-lg text-gray-400">
              Your intelligent project management hub
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsImportOpen(true)}
              size="lg"
              variant="outline"
              className="gap-2 border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"
            >
              <Upload className="w-5 h-5" />
              Import Project
            </Button>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              size="lg"
              className="gap-2 bg-[#9b87f5] hover:bg-[#8B5CF6] transition-colors duration-300"
            >
              <Plus className="w-5 h-5" />
              New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <Card className="p-6 bg-[#1A1F2C]/50 border-[#403E43] backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2 text-white">
                <FolderGit2 className="w-6 h-6 text-[#9b87f5]" />
                Your Projects
              </h2>
              <p className="text-gray-400">
                Access and manage your development projects
              </p>
            </div>
            <ProjectList userId={session.user.id} />
          </Card>

          <Card className="p-6 bg-[#1A1F2C]/50 border-[#403E43] backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">Project Tools</h2>
              <div className="mt-4">
                <ProjectSelector 
                  value={selectedProjectId} 
                  onValueChange={handleProjectSelect} 
                />
              </div>
            </div>

            <Tabs defaultValue="packages" className="space-y-6">
              <TabsList className="grid grid-cols-4 gap-4 bg-[#403E43]/50 p-1">
                <TabsTrigger value="packages" className="gap-2 data-[state=active]:bg-[#9b87f5]">
                  <Package className="w-4 h-4" />
                  Package Manager
                </TabsTrigger>
                <TabsTrigger value="ai-debug" className="gap-2 data-[state=active]:bg-[#9b87f5]">
                  <Bug className="w-4 h-4" />
                  AI Debug
                </TabsTrigger>
                <TabsTrigger value="deployment" className="gap-2 data-[state=active]:bg-[#9b87f5]">
                  <Rocket className="w-4 h-4" />
                  Deployment
                </TabsTrigger>
                <TabsTrigger value="github" className="gap-2 data-[state=active]:bg-[#9b87f5]">
                  <Github className="w-4 h-4" />
                  GitHub Export
                </TabsTrigger>
              </TabsList>

              <TabsContent value="packages" className="space-y-4">
                {selectedProjectId ? (
                  <PackageManager projectId={selectedProjectId} />
                ) : (
                  <div className="text-center py-8 text-gray-400 bg-[#1A1F2C]/30 rounded-lg border border-[#403E43] backdrop-blur-sm">
                    Please select a project to manage packages
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ai-debug" className="space-y-4">
                {selectedProjectId ? (
                  <AIDebugger projectId={selectedProjectId} />
                ) : (
                  <div className="text-center py-8 text-gray-400 bg-[#1A1F2C]/30 rounded-lg border border-[#403E43] backdrop-blur-sm">
                    Please select a project to use AI debugging
                  </div>
                )}
              </TabsContent>

              <TabsContent value="deployment" className="space-y-4">
                {selectedProjectId ? (
                  <DeploymentPanel projectId={selectedProjectId} />
                ) : (
                  <div className="text-center py-8 text-gray-400 bg-[#1A1F2C]/30 rounded-lg border border-[#403E43] backdrop-blur-sm">
                    Please select a project to manage deployment
                  </div>
                )}
              </TabsContent>

              <TabsContent value="github" className="space-y-4">
                {selectedProjectId ? (
                  <GitHubExport projectId={selectedProjectId} />
                ) : (
                  <div className="text-center py-8 text-gray-400 bg-[#1A1F2C]/30 rounded-lg border border-[#403E43] backdrop-blur-sm">
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
    </div>
  );
}