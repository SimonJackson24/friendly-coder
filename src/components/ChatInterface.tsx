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
      <div className="h-full flex flex-col bg-background/50 backdrop-blur-lg rounded-lg border border-border/50 shadow-xl animate-fade-in">
        <ContextAlerts context={context} />
        <ChatMessageList />
        <ChatInputForm />
      </div>
    </ChatContextProvider>
  );
}