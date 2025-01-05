import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import Logger from "@/utils/logger";
import { ContextAlerts } from "@/components/assistant/ContextAlerts";
import { ChatContextProvider } from "./assistant/chat/ChatContextProvider";
import { ChatMessageList } from "./assistant/chat/ChatMessageList";
import { ChatInputForm } from "./assistant/chat/ChatInputForm";
import { Menu, Settings, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ChatInterfaceProps {
  projectId?: string | null;
}

export function ChatInterface({ projectId }: ChatInterfaceProps) {
  const context = Logger.getContextSummary();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ChatContextProvider projectId={projectId}>
      <div className={`h-full flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl rounded-lg border border-border/50 shadow-2xl animate-fade-in overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Header */}
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-md">
          {/* Top Header with Controls */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? (
                  <Minimize2 className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                ) : (
                  <Maximize2 className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Button>
            </div>
          </div>
          
          {/* Title Section */}
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-foreground/90 tracking-tight bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">AI Assistant</h2>
            <p className="text-sm text-muted-foreground mt-1">Ask me anything about your project</p>
          </div>
        </div>

        {/* Menu Panel - Slides in from left */}
        <div className={`absolute top-0 left-0 w-64 h-full bg-card/95 backdrop-blur-xl border-r border-border/50 transform transition-transform duration-300 z-10 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground/90">Menu</h3>
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
                Chat History
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
                Saved Responses
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary">
                Settings
              </Button>
            </nav>
          </div>
        </div>

        <ContextAlerts context={context} />
        <ChatMessageList />
        <ChatInputForm />
      </div>
    </ChatContextProvider>
  );
}