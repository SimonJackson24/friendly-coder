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
        "flex gap-4 text-sm md:text-base animate-fade-in",
        role === "assistant" ? "justify-start" : "justify-end"
      )}
    >
      {role === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 shadow-lg animate-scale-in">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-lg transition-all duration-200 hover:shadow-xl",
          role === "assistant" 
            ? "bg-card/90 text-card-foreground backdrop-blur-md border border-border/50" 
            : "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
        )}
      >
        <div className="text-xs opacity-70 mb-2 font-medium">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
        <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert">
          {content}
        </div>
      </div>
      {role === "user" && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg animate-scale-in">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}