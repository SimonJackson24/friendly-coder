import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { FileNode } from "@/hooks/useFileSystem";
import Logger from "@/utils/logger";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, Smartphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PreviewProps {
  files: FileNode[];
  onConsoleMessage: (message: string) => void;
  onConsoleError: (error: string) => void;
  projectId?: string | null;
}

export function Preview({ files, onConsoleMessage, onConsoleError, projectId }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [buildState, setBuildState] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [lastSuccessfulState, setLastSuccessfulState] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch project type
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId
  });

  const isAndroidProject = project?.project_type === 'android' || project?.project_type === 'web-to-android';

  const getEntryFile = (files: FileNode[]) => {
    if (isAndroidProject) {
      // For Android projects, look for activity_main.xml or MainActivity.kt
      const androidEntryPoints = [
        { name: "activity_main.xml", type: "layout" },
        { name: "MainActivity.kt", type: "activity" }
      ];

      for (const entry of androidEntryPoints) {
        const file = files.find(f => f.name === entry.name);
        if (file) {
          return { file, type: entry.type };
        }
      }
    } else {
      // Web project entry points
      const webEntryPoints = [
        { name: "index.html", type: "web" },
        { name: "App.tsx", type: "react" },
        { name: "main.ts", type: "node" },
      ];

      for (const entry of webEntryPoints) {
        const file = files.find(f => f.name === entry.name);
        if (file) {
          return { file, type: entry.type };
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const updatePreview = () => {
      if (!files.length) return;

      setBuildState('building');
      setErrorMessage(null);
      Logger.log('build', 'Starting preview build', { fileCount: files.length });

      const entry = getEntryFile(files);
      if (!entry?.file) {
        const error = isAndroidProject ? 
          'No Android layout file found. Create activity_main.xml to see the preview.' :
          'No entry file found for preview';
        Logger.log('error', error);
        setBuildState('error');
        setErrorMessage(error);
        return;
      }

      try {
        if (isAndroidProject) {
          // Handle Android layout preview
          const layoutContent = entry.file.content;
          if (!layoutContent) {
            throw new Error('Empty layout file');
          }

          // Create a simplified Android-like preview
          const previewContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { 
                    margin: 0; 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: #f5f5f5;
                  }
                  .android-frame {
                    width: 360px;
                    height: 640px;
                    background: white;
                    border-radius: 20px;
                    position: relative;
                    border: 12px solid #1a1a1a;
                    overflow: hidden;
                  }
                  .android-content {
                    padding: 16px;
                    height: 100%;
                    overflow: auto;
                  }
                  .status-bar {
                    height: 24px;
                    background: #2196F3;
                    width: 100%;
                  }
                </style>
              </head>
              <body>
                <div class="android-frame">
                  <div class="status-bar"></div>
                  <div class="android-content">
                    <pre>${layoutContent}</pre>
                  </div>
                </div>
                <script>
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
              </body>
            </html>
          `;

          const blob = new Blob([previewContent], { type: "text/html" });
          const url = URL.createObjectURL(blob);

          if (iframeRef.current) {
            iframeRef.current.src = url;
          }
          setBuildState('success');
          Logger.log('build', 'Android preview build successful');

          return () => URL.revokeObjectURL(url);
        } else {
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

        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
        Logger.log('error', 'Preview build failed', { error: errorMsg });
        setBuildState('error');
        setErrorMessage(errorMsg);
        
        if (lastSuccessfulState && iframeRef.current) {
          Logger.log('build', 'Reverting to last successful build');
          const blob = new Blob([lastSuccessfulState], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          iframeRef.current.src = url;
        }
      }
    };

    updatePreview();
  }, [files, isAndroidProject]);

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
          {isAndroidProject && <Smartphone className="h-4 w-4" />}
          {buildState === 'building' && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Building preview...
            </>
          )}
          {buildState === 'success' && (
            isAndroidProject ? 'Android layout preview ready' : 'Preview ready'
          )}
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
