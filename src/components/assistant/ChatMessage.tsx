import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-3 text-sm md:text-base animate-fade-in",
        role === "assistant" ? "justify-start" : "justify-end"
      )}
    >
      {role === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-lg p-4 shadow-lg transition-colors",
          role === "assistant" 
            ? "bg-card/50 text-card-foreground backdrop-blur-sm" 
            : "bg-primary text-primary-foreground"
        )}
      >
        <div className="text-xs opacity-70 mb-2">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
        <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert">
          {content}
        </div>
      </div>
      {role === "user" && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}