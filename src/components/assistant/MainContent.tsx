import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/ChatInterface";
import { FileEditor } from "@/components/FileEditor";
import { Console } from "@/components/Console";
import { ProjectSettings } from "@/components/ProjectSettings";
import { VersionControl } from "@/components/version-control/VersionControl";
import { IssueList } from "@/components/issues/IssueList";
import { FileNode } from "@/hooks/useFileSystem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description?: string;
}

interface MainContentProps {
  projectId: string | null;
  selectedFile: FileNode | null;
  consoleOutput: string[];
  buildErrors: string[];
  onSaveFile: (id: string, content: string) => void;
  onClearConsole: () => void;
  project: Project;
}

export function MainContent({
  projectId,
  selectedFile,
  consoleOutput,
  buildErrors,
  onSaveFile,
  onClearConsole,
  project,
}: MainContentProps) {
  const { data: repository } = useQuery({
    queryKey: ["repository", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const { data, error } = await supabase
        .from("repositories")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  return (
    <Tabs defaultValue="chat" className="h-full flex flex-col">
      <TabsList className="w-full">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="editor">Editor</TabsTrigger>
        <TabsTrigger value="console">Console</TabsTrigger>
        <TabsTrigger value="issues">Issues</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="version-control">Version Control</TabsTrigger>
      </TabsList>
      
      <div className="flex-grow overflow-hidden">
        <TabsContent value="chat" className="h-full m-0">
          <ChatInterface projectId={projectId} />
        </TabsContent>
        
        <TabsContent value="editor" className="h-full m-0">
          <FileEditor
            file={selectedFile}
            onSave={onSaveFile}
            projectId={projectId}
          />
        </TabsContent>
        
        <TabsContent value="console" className="h-full m-0">
          <Console 
            logs={consoleOutput} 
            errors={buildErrors}
            onClear={onClearConsole} 
          />
        </TabsContent>

        <TabsContent value="issues" className="h-full m-0 p-4">
          {repository ? (
            <IssueList repositoryId={repository.id} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No repository found for this project.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="h-full m-0">
          <ProjectSettings project={project} />
        </TabsContent>

        <TabsContent value="version-control" className="h-full m-0">
          <VersionControl projectId={projectId} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
