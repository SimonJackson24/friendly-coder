import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useChat(projectId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (content: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      role: "user",
      content
    }]);

    // TODO: Implement actual message handling with AI
    // For now, just echo back
    setMessages(prev => [...prev, {
      role: "assistant",
      content: `You said: ${content}`
    }]);
  };

  return {
    messages,
    sendMessage
  };
}