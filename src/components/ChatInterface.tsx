import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
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
      <div className="h-full flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl rounded-lg border border-border/50 shadow-2xl animate-fade-in overflow-hidden transition-all duration-300">
        {/* Title Section */}
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-md p-6">
          <h2 className="text-2xl font-semibold text-foreground/90 tracking-tight bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">AI Assistant</h2>
          <p className="text-sm text-muted-foreground mt-1">Ask me anything about your project</p>
        </div>

        <ContextAlerts context={context} />
        <ChatMessageList />
        <ChatInputForm />
      </div>
    </ChatContextProvider>
  );
}