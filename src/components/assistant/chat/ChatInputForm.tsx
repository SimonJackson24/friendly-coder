import { useState } from "react";
import { ChatInput } from "@/components/assistant/ChatInput";
import { useChat } from "./ChatContextProvider";
import { useToast } from "@/hooks/use-toast";
import { generateResponse } from "@/utils/huggingface";
import Logger from "@/utils/logger";

export function ChatInputForm() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addMessage, project } = useChat();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const timestamp = new Date().toISOString();
    
    setInput("");
    addMessage({ 
      role: "user", 
      content: userMessage,
      timestamp 
    });
    
    setIsLoading(true);
    Logger.log('info', 'Sending prompt to assistant', { prompt: userMessage });

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

      // Remove any trailing colons from the base URL
      const baseUrl = window.location.origin.replace(/:\/?$/, '');
      const response = await generateResponse(contextEnhancedPrompt, baseUrl);
      Logger.log('info', 'Received response from assistant', { response });
      
      addMessage({ 
        role: "assistant", 
        content: response,
        timestamp: new Date().toISOString()
      });
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

  return (
    <ChatInput
      input={input}
      isLoading={isLoading}
      onInputChange={setInput}
      onSubmit={handleSubmit}
    />
  );
}