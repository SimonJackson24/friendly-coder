import { ChatInterface } from "@/components/ChatInterface";

interface ChatContainerProps {
  projectId: string | null;
}

export function ChatContainer({ projectId }: ChatContainerProps) {
  return (
    <div className="h-full">
      <ChatInterface projectId={projectId} />
    </div>
  );
}