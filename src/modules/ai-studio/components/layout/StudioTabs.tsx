import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileNode } from "@/hooks/useFileSystem";
import { ChatContainer } from "../chat/ChatContainer";
import { EditorContainer } from "../editor/EditorContainer";
import { ConsoleContainer } from "../console/ConsoleContainer";
import { SettingsContainer } from "../settings/SettingsContainer";
import { GitHubContainer } from "../github/GitHubContainer";

interface StudioTabsProps {
  projectId: string | null;
  selectedFile: FileNode | null;
  consoleOutput: string[];
  buildErrors: string[];
  onSaveFile: (id: string, content: string) => void;
  onClearConsole: () => void;
  project: any;
}

export function StudioTabs({
  projectId,
  selectedFile,
  consoleOutput,
  buildErrors,
  onSaveFile,
  onClearConsole,
  project,
}: StudioTabsProps) {
  return (
    <Tabs defaultValue="chat" className="h-full flex flex-col">
      <TabsList className="w-full">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="editor">Editor</TabsTrigger>
        <TabsTrigger value="console">Console</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="github">GitHub</TabsTrigger>
      </TabsList>
      
      <div className="flex-grow overflow-hidden">
        <TabsContent value="chat" className="h-full m-0">
          <ChatContainer projectId={projectId} />
        </TabsContent>
        
        <TabsContent value="editor" className="h-full m-0">
          <EditorContainer
            file={selectedFile}
            onSave={onSaveFile}
            projectId={projectId}
          />
        </TabsContent>
        
        <TabsContent value="console" className="h-full m-0">
          <ConsoleContainer 
            logs={consoleOutput} 
            errors={buildErrors}
            onClear={onClearConsole} 
          />
        </TabsContent>
        
        <TabsContent value="settings" className="h-full m-0">
          <SettingsContainer project={project} />
        </TabsContent>

        <TabsContent value="github" className="h-full m-0">
          <GitHubContainer />
        </TabsContent>
      </div>
    </Tabs>
  );
}