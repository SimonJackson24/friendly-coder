import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { generateResponse } from "@/utils/huggingface";
import Logger from "@/utils/logger";
import { ChatMessage } from "@/components/assistant/ChatMessage";
import { ChatInput } from "@/components/assistant/ChatInput";
import { ContextAlerts } from "@/components/assistant/ContextAlerts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId
  });

  useEffect(() => {
    const logs = Logger.getLogs();
    if (logs.length > 0) {
      Logger.log('info', 'Loaded previous logs into AI context', { count: logs.length });
    }

    // Add initial message based on project type
    if (project?.project_type && messages.length === 0) {
      const initialMessage = getInitialMessage(project.project_type);
      if (initialMessage) {
        setMessages([{
          role: "assistant",
          content: initialMessage,
          timestamp: new Date().toISOString()
        }]);
      }
    }
  }, [project]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getInitialMessage = (projectType: string) => {
    switch (projectType) {
      case 'android':
        return "I'll help you create your Android app! Let's start by defining the basic structure. What kind of Android app would you like to build?";
      case 'web-to-android':
        return "I'll help you convert your web app to an Android app. First, let's review your web app's structure and plan the Android conversion. What are the main features of your web app?";
      case 'fullstack':
        return "Let's build your full-stack application! We'll set up both the frontend and backend. What kind of application would you like to create?";
      default:
        return "How can I help you with your project today?";
    }
  };

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
      const context = Logger.getContextSummary();
      const projectTypeContext = project?.project_type ? 
        `Project Type: ${project.project_type}\n` : '';
      
      const contextEnhancedPrompt = `
[System Context:
${projectTypeContext}
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

  const context = Logger.getContextSummary();

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-lg rounded-lg border border-border/50 shadow-xl animate-fade-in">
      <ContextAlerts context={context} />

      <ScrollArea className="flex-1 p-4 space-y-6">
        <div className="space-y-6 pb-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} {...message} />
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}