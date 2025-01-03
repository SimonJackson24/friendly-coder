import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { generateResponse } from "@/utils/huggingface";
import Logger from "@/utils/logger";
import { Loader2, Send, Bot, User, AlertTriangle, Package, Database, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  projectId?: string | null;
}

export function ChatInterface({ projectId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logs = Logger.getLogs();
    if (logs.length > 0) {
      Logger.log('info', 'Loaded previous logs into AI context', { count: logs.length });
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const timestamp = new Date().toISOString();
    
    setInput("");
    setMessages((prev) => [...prev, { 
      role: "user", 
      content: userMessage,
      timestamp 
    }]);
    
    setIsLoading(true);
    Logger.log('info', 'Sending prompt to Claude', { prompt: userMessage });

    try {
      // Get enhanced context
      const context = Logger.getContextSummary();
      const contextEnhancedPrompt = `
[System Context:
Build Status: ${context.buildErrorCount} recent errors
Schema Changes: ${context.schemaChangeCount} recent changes
Package Operations: ${context.packageOperationCount} recent operations
File Operations: ${context.fileOperationCount} recent operations

Recent Build Errors: ${JSON.stringify(context.recentBuildErrors)}
Recent Schema Changes: ${JSON.stringify(context.recentSchemaChanges)}
Recent Package Operations: ${JSON.stringify(context.recentPackageOperations)}
Recent File Operations: ${JSON.stringify(context.recentFileOperations)}
]

${userMessage}`;

      const response = await generateResponse(contextEnhancedPrompt);
      Logger.log('info', 'Received response from Claude', { response });
      
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: response,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      Logger.log('error', 'Failed to generate response', { error });
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get context for alerts
  const context = Logger.getContextSummary();
  const hasRecentIssues = context.buildErrorCount > 0 || 
                         context.schemaChangeCount > 0 || 
                         context.packageOperationCount > 0;

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm rounded-lg">
      {hasRecentIssues && (
        <div className="space-y-2 p-4">
          {context.buildErrorCount > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Build Errors</AlertTitle>
              <AlertDescription>
                There are {context.buildErrorCount} recent build errors that might affect the AI's responses.
              </AlertDescription>
            </Alert>
          )}
          
          {context.schemaChangeCount > 0 && (
            <Alert>
              <Database className="h-4 w-4" />
              <AlertTitle>Schema Changes</AlertTitle>
              <AlertDescription>
                {context.schemaChangeCount} recent database schema changes detected.
              </AlertDescription>
            </Alert>
          )}
          
          {context.packageOperationCount > 0 && (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertTitle>Package Changes</AlertTitle>
              <AlertDescription>
                {context.packageOperationCount} recent package operations performed.
              </AlertDescription>
            </Alert>
          )}

          {context.fileOperationCount > 0 && (
            <Alert>
              <FileCode className="h-4 w-4" />
              <AlertTitle>File System Changes</AlertTitle>
              <AlertDescription>
                {context.fileOperationCount} recent file operations performed.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3 text-sm md:text-base",
                message.role === "assistant" ? "justify-start" : "justify-end"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] md:max-w-[75%] rounded-lg p-4",
                  message.role === "assistant" 
                    ? "bg-card/50 text-card-foreground" 
                    : "bg-primary/90 text-primary-foreground"
                )}
              >
                <div className="text-xs opacity-70 mb-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-card/30">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-background/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !input.trim()}
            className="h-[60px] w-[60px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}