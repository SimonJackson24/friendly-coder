import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { generateResponse } from "@/utils/huggingface";
import Logger from "@/utils/logger";

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

  // Load console logs into context
  useEffect(() => {
    const logs = Logger.getLogs();
    if (logs.length > 0) {
      Logger.log('info', 'Loaded previous logs into AI context', { count: logs.length });
    }
  }, []);

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
      // Include build context and logs in the prompt
      const lastBuildError = Logger.getLastBuildError();
      const contextEnhancedPrompt = lastBuildError 
        ? `[Context: Last build error: ${JSON.stringify(lastBuildError)}]\n${userMessage}`
        : userMessage;

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

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-background">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "assistant"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <div className="text-sm opacity-70 mb-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}