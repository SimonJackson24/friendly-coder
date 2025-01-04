import { createContext, useContext, useState, useEffect } from "react";
import Logger from "@/utils/logger";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  project: any;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatContextProvider({ 
  children, 
  projectId 
}: { 
  children: React.ReactNode;
  projectId?: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);

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

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, project, isLoading: false }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatContextProvider");
  }
  return context;
};

function getInitialMessage(projectType: string) {
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
}