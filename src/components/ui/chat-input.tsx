import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t">
      <Input
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button onClick={onSend} size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}