import { RefObject, useEffect } from "react";
import { FileNode } from "@/hooks/useFileSystem";
import Logger from "@/utils/logger";
import { AndroidPreview } from "./AndroidPreview";
import { WebPreview } from "./WebPreview";

interface UsePreviewBuilderProps {
  files: FileNode[];
  isAndroidProject: boolean;
  iframeRef: RefObject<HTMLIFrameElement>;
  buildState: string;
  lastSuccessfulState: string | null;
}

export function usePreviewBuilder({
  files,
  isAndroidProject,
  iframeRef,
  buildState,
  lastSuccessfulState
}: UsePreviewBuilderProps) {
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

      Logger.log('build', 'Starting preview build', { fileCount: files.length });

      const entry = getEntryFile(files);
      if (!entry?.file) {
        const error = isAndroidProject ? 
          'No Android layout file found. Create activity_main.xml to see the preview.' :
          'No entry file found for preview';
        Logger.log('error', error);
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
          Logger.log('build', 'Android preview build successful');

          return () => URL.revokeObjectURL(url);
        } else {
          const modifiedContent = WebPreview({ content: entry.file.content || '' });

          if (!modifiedContent) {
            throw new Error('Failed to modify preview content');
          }

          const blob = new Blob([modifiedContent], { type: "text/html" });
          const url = URL.createObjectURL(blob);

          if (iframeRef.current) {
            iframeRef.current.src = url;
          }
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
}