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
      case 'responsive-pwa':
        return "I'll help you create a responsive website with PWA capabilities! Let's start by defining the core features. What kind of website would you like to build? I'll help you set up the service worker, manifest, and ensure it works offline.";
      
      case 'fullstack':
        return "Let's build your full-stack web application! We'll set up both the frontend with React and Tailwind, and the backend using Supabase for authentication, database, and APIs. What features would you like to implement first?";
      
      case 'android':
        return "I'll help you create your Android app from scratch! We'll use best practices for Android development. What kind of Android app would you like to build? Let's start by defining the main screens and functionality.";
      
      case 'web-to-android':
        return "I'll help you convert your web app to a native Android app! First, let's analyze your web app's structure and plan the Android conversion. What are the main features we need to preserve in the Android version?";
      
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

Project Type Instructions:
${getProjectTypeInstructions(project?.project_type)}
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

  const getProjectTypeInstructions = (projectType: string | undefined) => {
    switch (projectType) {
      case 'responsive-pwa':
        return `
- Use React with Vite for the frontend
- Implement responsive design using Tailwind CSS
- Set up PWA capabilities with service workers
- Use shadcn/ui components for the UI
- Ensure offline functionality
- Implement proper meta tags and manifest`;
      
      case 'fullstack':
        return `
- Use React with Vite for the frontend
- Implement Supabase for backend functionality
- Set up authentication flows
- Create necessary database tables
- Implement proper data validation
- Use React Query for data fetching
- Use shadcn/ui components for the UI`;
      
      case 'android':
        return `
- Create native Android app structure
- Set up proper Android build configuration
- Implement Material Design components
- Handle Android lifecycle methods
- Set up proper navigation
- Implement data persistence`;
      
      case 'web-to-android':
        return `
- Analyze web app structure
- Convert web routes to Android activities/fragments
- Implement proper state management
- Handle Android-specific features
- Ensure proper data persistence
- Maintain UI consistency`;
      
      default:
        return '';
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