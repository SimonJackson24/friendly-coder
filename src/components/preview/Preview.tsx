import { RefObject } from "react";
import { Card } from "../ui/card";
import { FileNode } from "@/hooks/useFileSystem";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewError } from "./PreviewError";
import { usePreviewBuilder } from "./usePreviewBuilder";

interface PreviewProps {
  files: FileNode[];
  project: any;
  iframeRef: RefObject<HTMLIFrameElement>;
  buildState: 'idle' | 'building' | 'success' | 'error';
  lastSuccessfulState: string | null;
  errorMessage: string | null;
  onMessage: (event: MessageEvent) => void;
}

export function Preview({ 
  files,
  project,
  iframeRef,
  buildState,
  lastSuccessfulState,
  errorMessage,
  onMessage
}: PreviewProps) {
  const isAndroidProject = project?.project_type === 'android' || project?.project_type === 'web-to-android';

  usePreviewBuilder({
    files,
    isAndroidProject,
    iframeRef,
    buildState,
    lastSuccessfulState
  });

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