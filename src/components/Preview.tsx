import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { FileNode } from "@/hooks/useFileSystem";
import Logger from "@/utils/logger";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PreviewHeader } from "./preview/PreviewHeader";
import { PreviewError } from "./preview/PreviewError";
import { AndroidPreview } from "./preview/AndroidPreview";
import { WebPreview } from "./preview/WebPreview";

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
          const layoutContent = entry.file.content;
          if (!layoutContent) {
            throw new Error('Empty layout file');
          }

          const previewContent = AndroidPreview({ layoutContent });
          const blob = new Blob([previewContent], { type: "text/html" });
          const url = URL.createObjectURL(blob);

          if (iframeRef.current) {
            iframeRef.current.src = url;
          }
          setBuildState('success');
          Logger.log('build', 'Android preview build successful');

          return () => URL.revokeObjectURL(url);
        } else {
          const modifiedContent = WebPreview({ content: entry.file.content || '' });

          if (!modifiedContent) {
            throw new Error('Failed to modify preview content');
          }

          if (buildState === 'success') {
            setLastSuccessfulState(modifiedContent);
          }

          const blob = new Blob([modifiedContent], { type: "text/html" });
          const url = URL.createObjectURL(blob);

          if (iframeRef.current) {
            iframeRef.current.src = url;
          }
          setBuildState('success');
          Logger.log('build', 'Preview build successful', { type: entry.type });

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
      <PreviewHeader 
        buildState={buildState}
        isAndroidProject={isAndroidProject}
        lastSuccessfulState={lastSuccessfulState}
      />
      <div className="flex-grow relative">
        {errorMessage && <PreviewError message={errorMessage} />}
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