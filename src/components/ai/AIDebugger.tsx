import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle, Code2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProject } from "@/contexts/ProjectContext";
import Logger from "@/utils/logger";
import { useToast } from "@/components/ui/use-toast";

interface DebugResult {
  type: 'error' | 'warning' | 'success';
  title: string;
  description: string;
  code?: string;
  suggestion?: string;
}

export function AIDebugger() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [debugResults, setDebugResults] = useState<DebugResult[]>([]);
  const { selectedProject } = useProject();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!selectedProject) {
      toast({
        title: "No project selected",
        description: "Please select a project to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Get recent logs and errors
      const logs = Logger.getLogs();
      const lastBuildError = Logger.getLastBuildError();

      // Send to Claude for analysis
      const response = await supabase.functions.invoke('generate-claude-response', {
        body: {
          projectId: selectedProject.id,
          prompt: `Analyze these application logs and errors for debugging purposes. Provide specific recommendations for fixes:
          
          Logs: ${JSON.stringify(logs)}
          Last Build Error: ${JSON.stringify(lastBuildError)}
          
          Format your response as a JSON array of debug results, each with:
          - type: 'error' | 'warning' | 'success'
          - title: string (short description)
          - description: string (detailed explanation)
          - code?: string (example fix if applicable)
          - suggestion?: string (improvement suggestion)
          `
        }
      });

      if (response.error) throw response.error;

      // Parse and display results
      const analysisResults = JSON.parse(response.data.response);
      setDebugResults(analysisResults);

    } catch (error) {
      console.error('Error in AI analysis:', error);
      setDebugResults([{
        type: 'error',
        title: 'Analysis Failed',
        description: 'Failed to complete the AI analysis. Please try again.',
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Debugger</h2>
        <Button onClick={handleAnalyze} disabled={isAnalyzing || !selectedProject}>
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Code2 className="w-4 h-4 mr-2" />
              Start Analysis
            </>
          )}
        </Button>
      </div>

      <ScrollArea className="h-[500px] border rounded-lg p-4">
        <div className="space-y-4">
          {debugResults.map((result, index) => (
            <Alert
              key={index}
              variant={result.type === 'error' ? 'destructive' : 'default'}
              className="relative"
            >
              <AlertTitle className="flex items-center gap-2">
                {result.type === 'error' ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : result.type === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {result.title}
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>{result.description}</p>
                {result.code && (
                  <pre className="mt-2 p-2 bg-muted rounded-md overflow-x-auto">
                    <code>{result.code}</code>
                  </pre>
                )}
                {result.suggestion && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Suggestion: {result.suggestion}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}