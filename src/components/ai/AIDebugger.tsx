import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle, Code2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DebugResult {
  type: 'error' | 'warning' | 'success';
  title: string;
  description: string;
  code?: string;
  suggestion?: string;
}

interface AIDebuggerProps {
  projectId: string;
}

export function AIDebugger({ projectId }: AIDebuggerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [debugResults, setDebugResults] = useState<DebugResult[]>([]);

  const { data: projectFiles } = useQuery({
    queryKey: ["project-files", projectId],
    queryFn: async () => {
      console.log("Fetching project files for analysis:", projectId);
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("project_id", projectId);

      if (error) {
        console.error("Error fetching project files:", error);
        throw error;
      }

      return data;
    },
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // Send project files to Claude for analysis
      const response = await supabase.functions.invoke('generate-claude-response', {
        body: {
          prompt: `Analyze these project files for debugging purposes. Provide specific recommendations for fixes:
          
          Files: ${JSON.stringify(projectFiles)}
          
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
        <Button onClick={handleAnalyze} disabled={isAnalyzing}>
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