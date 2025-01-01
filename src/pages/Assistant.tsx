import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";

const Assistant = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 flex gap-4">
        <div className="w-1/2">
          <ChatInterface />
        </div>
        <div className="w-1/2 bg-card rounded-lg border">
          <iframe
            title="Live Preview"
            className="w-full h-[600px] rounded-lg"
            src="about:blank"
          />
        </div>
      </div>
    </div>
  );
};

export default Assistant;