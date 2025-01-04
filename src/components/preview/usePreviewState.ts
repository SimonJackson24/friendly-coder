import { useEffect, useRef, useState } from "react";
import Logger from "@/utils/logger";

export function usePreviewState(
  onConsoleMessage: (message: string) => void,
  onConsoleError: (error: string) => void
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [buildState, setBuildState] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [lastSuccessfulState, setLastSuccessfulState] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onConsoleMessage, onConsoleError]);

  return {
    iframeRef,
    buildState,
    setBuildState,
    lastSuccessfulState,
    setLastSuccessfulState,
    errorMessage,
    setErrorMessage,
    handleMessage
  };
}