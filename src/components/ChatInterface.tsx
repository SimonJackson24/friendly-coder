import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import Logger from "@/utils/logger";
import { ContextAlerts } from "@/components/assistant/ContextAlerts";
import { ChatContextProvider } from "./assistant/chat/ChatContextProvider";
import { ChatMessageList } from "./assistant/chat/ChatMessageList";
import { ChatInputForm } from "./assistant/chat/ChatInputForm";

interface ChatInterfaceProps {
  projectId?: string | null;
}

export function ChatInterface({ projectId }: ChatInterfaceProps) {
  const context = Logger.getContextSummary();

  return (
    <ChatContextProvider projectId={projectId}>
      <div className="h-full flex flex-col bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-xl rounded-lg border border-border/50 shadow-2xl animate-fade-in">
        <div className="p-4 border-b border-border/50 bg-card/30 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-foreground/90">AI Assistant</h2>
          <p className="text-sm text-muted-foreground">Ask me anything about your project</p>
        </div>
        <ContextAlerts context={context} />
        <ChatMessageList />
        <ChatInputForm />
      </div>
    </ChatContextProvider>
  );
}