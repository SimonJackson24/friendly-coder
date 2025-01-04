import { Loader2, Smartphone } from "lucide-react";

interface PreviewHeaderProps {
  buildState: 'idle' | 'building' | 'success' | 'error';
  isAndroidProject: boolean;
  lastSuccessfulState: string | null;
}

export function PreviewHeader({ buildState, isAndroidProject, lastSuccessfulState }: PreviewHeaderProps) {
  return (
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
  );
}