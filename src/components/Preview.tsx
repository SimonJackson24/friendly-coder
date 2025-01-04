import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { FileNode } from "@/hooks/useFileSystem";
import Logger from "@/utils/logger";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";

interface PreviewProps {
  files: FileNode[];
  onConsoleMessage: (message: string) => void;
  onConsoleError: (error: string) => void;
}

export function Preview({ files, onConsoleMessage, onConsoleError }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [buildState, setBuildState] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [lastSuccessfulState, setLastSuccessfulState] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getEntryFile = (files: FileNode[]) => {
    // Check for different project type entry points
    const entryPoints = [
      { name: "index.html", type: "web" },
      { name: "App.tsx", type: "react" },
      { name: "main.ts", type: "node" },
    ];

    for (const entry of entryPoints) {
      const file = files.find(f => f.name === entry.name);
      if (file) {
        return { file, type: entry.type };
      }
    }
    return null;
  };

  useEffect(() => {
    const updatePreview = () => {
      if (!iframeRef.current || !files.length) return;

      setBuildState('building');
      setErrorMessage(null);
      Logger.log('build', 'Starting preview build', { fileCount: files.length });

      const entry = getEntryFile(files);
      if (!entry?.file) {
        const error = 'No entry file found for preview';
        Logger.log('error', error);
        setBuildState('error');
        setErrorMessage(error);
        return;
      }

      try {
        // Inject session and error handling scripts
        const previewScript = `
          <script>
            // Session handling
            window.addEventListener('message', function(event) {
              if (event.data.type === 'session') {
                window.sessionData = event.data.session;
              }
            });

            // Error handling
            window.onerror = function(msg, url, line, col, error) {
              window.parent.postMessage({
                type: 'error',
                message: \`\${msg} (Line: \${line}, Col: \${col})\`
              }, '*');
              return false;
            };

            // Console interceptor
            const originalConsole = { ...console };
            Object.keys(console).forEach(key => {
              console[key] = (...args) => {
                originalConsole[key](...args);
                if (key === 'error' || key === 'warn' || key === 'log') {
                  window.parent.postMessage({
                    type: 'console',
                    message: args.map(arg => 
                      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                    ).join(' ')
                  }, '*');
                }
              };
            });
          </script>
        `;

        // Insert the script right after the opening body tag
        const modifiedContent = entry.file.content?.replace(
          '<body>',
          '<body>' + previewScript
        );

        if (!modifiedContent) {
          throw new Error('Failed to modify preview content');
        }

        // Store successful state before updating
        if (buildState === 'success') {
          setLastSuccessfulState(modifiedContent);
        }

        const blob = new Blob([modifiedContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        iframeRef.current.src = url;
        setBuildState('success');
        Logger.log('build', 'Preview build successful', { type: entry.type });

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
        const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
        Logger.log('error', 'Preview build failed', { error: errorMsg });
        setBuildState('error');
        setErrorMessage(errorMsg);
        
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
        setErrorMessage(event.data.message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onConsoleMessage, onConsoleError]);

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          {buildState === 'building' && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Building preview...
            </>
          )}
          {buildState === 'success' && 'Preview ready'}
          {buildState === 'error' && 'Build failed'}
          {buildState === 'error' && lastSuccessfulState && ' (showing last working state)'}
        </div>
      </div>
      <div className="flex-grow relative">
        {errorMessage && (
          <Alert variant="destructive" className="m-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
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