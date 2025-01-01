import { useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { FileNode } from "@/hooks/useFileSystem";

interface PreviewProps {
  files: FileNode[];
  onConsoleMessage: (message: string) => void;
  onConsoleError: (error: string) => void;
}

export function Preview({ files, onConsoleMessage, onConsoleError }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const updatePreview = () => {
      if (!iframeRef.current || !files.length) return;

      const htmlFile = files.find(f => f.name === "index.html");
      if (!htmlFile?.content) return;

      const blob = new Blob([htmlFile.content], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      iframeRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    };

    updatePreview();
  }, [files]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "console") {
        onConsoleMessage(event.data.message);
      } else if (event.data.type === "error") {
        onConsoleError(event.data.message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onConsoleMessage, onConsoleError]);

  return (
    <Card>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Preview</h2>
      </div>
      <iframe
        ref={iframeRef}
        title="Live Preview"
        className="w-full h-[600px] rounded-b-lg"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </Card>
  );
}