import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/assistant/ChatMessage";
import { useChat } from "./ChatContextProvider";
import { useEffect, useRef } from "react";

export function ChatMessageList() {
  const { messages } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 space-y-6">
      <div className="space-y-6 pb-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}