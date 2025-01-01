import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { FileNode } from "@/hooks/useFileSystem";
import Logger from "@/utils/logger";

interface PreviewProps {
  files: FileNode[];
  onConsoleMessage: (message: string) => void;
  onConsoleError: (error: string) => void;
}

export function Preview({ files, onConsoleMessage, onConsoleError }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [buildState, setBuildState] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [lastSuccessfulState, setLastSuccessfulState] = useState<string | null>(null);

  useEffect(() => {
    const updatePreview = () => {
      if (!iframeRef.current || !files.length) return;

      setBuildState('building');
      Logger.log('build', 'Starting preview build', { fileCount: files.length });

      const htmlFile = files.find(f => f.name === "index.html");
      if (!htmlFile?.content) {
        Logger.log('error', 'No HTML file found for preview');
        setBuildState('error');
        return;
      }

      try {
        // Inject session handling script
        const sessionScript = `
          <script>
            window.addEventListener('message', function(event) {
              if (event.data.type === 'session') {
                window.sessionData = event.data.session;
              }
            });
          </script>
        `;

        // Insert the script right after the opening body tag
        const modifiedContent = htmlFile.content.replace(
          '<body>',
          '<body>' + sessionScript
        );

        const blob = new Blob([modifiedContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        // Store successful state before updating
        if (buildState === 'success') {
          setLastSuccessfulState(modifiedContent);
        }

        iframeRef.current.src = url;
        setBuildState('success');
        Logger.log('build', 'Preview build successful');

        // Send session data to iframe after it loads
        iframeRef.current.onload = () => {
          const session = localStorage.getItem('supabase.auth.token');
          if (session) {
            iframeRef.current?.contentWindow?.postMessage({
              type: 'session',
              session: JSON.parse(session)
            }, '*');
          }
        };

        return () => URL.revokeObjectURL(url);
      } catch (error) {
        Logger.log('error', 'Preview build failed', { error });
        setBuildState('error');
        
        // Revert to last successful state if available
        if (lastSuccessfulState) {
          Logger.log('build', 'Reverting to last successful build');
          const blob = new Blob([lastSuccessfulState], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          iframeRef.current.src = url;
        }
      }
    };

    updatePreview();
  }, [files, buildState]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "console") {
        Logger.log('info', 'Console message from preview', { message: event.data.message });
        onConsoleMessage(event.data.message);
      } else if (event.data.type === "error") {
        Logger.log('error', 'Error from preview', { error: event.data.message });
        onConsoleError(event.data.message);
        setBuildState('error');
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onConsoleMessage, onConsoleError]);

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="text-sm text-muted-foreground">
          Build status: {buildState}
          {buildState === 'error' && lastSuccessfulState && ' (reverted to last working state)'}
        </div>
      </div>
      <div className="flex-grow relative">
        <iframe
          ref={iframeRef}
          title="Live Preview"
          className="w-full h-full absolute inset-0 rounded-b-lg"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </Card>
  );
}