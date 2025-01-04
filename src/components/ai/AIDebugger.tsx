import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle, Code2, Bug } from "lucide-react";
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
      
      toast({
        title: "Analysis Complete",
        description: "Debug results have been generated successfully.",
      });

    } catch (error) {
      console.error('Error in AI analysis:', error);
      setDebugResults([{
        type: 'error',
        title: 'Analysis Failed',
        description: 'Failed to complete the AI analysis. Please try again.',
      }]);
      
      toast({
        title: "Analysis Failed",
        description: "An error occurred during the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-black/75 backdrop-blur-md rounded-lg border border-border/50 shadow-xl animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              AI Debugger
            </h2>
            <p className="text-white/60">
              Analyze your application for potential issues
            </p>
          </div>
        </div>
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || !selectedProject}
          size="lg"
          className="relative group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Code2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Start Analysis
            </>
          )}
        </Button>
      </div>

      <ScrollArea className="h-[500px] rounded-lg">
        <div className="space-y-4 p-4">
          {debugResults.map((result, index) => (
            <Alert
              key={index}
              variant={result.type === 'error' ? 'destructive' : 'default'}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                result.type === 'error' 
                  ? 'hover:shadow-destructive/20' 
                  : result.type === 'warning'
                  ? 'hover:shadow-yellow-500/20'
                  : 'hover:shadow-green-500/20'
              } animate-fade-in`}
              style={{ animationDelay: `${index * 150}ms` }}
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
                <p className="text-sm text-foreground/80">{result.description}</p>
                {result.code && (
                  <pre className="mt-2 p-4 bg-black/50 rounded-md overflow-x-auto border border-border/50 font-mono text-sm">
                    <code className="text-primary/90">{result.code}</code>
                  </pre>
                )}
                {result.suggestion && (
                  <p className="mt-2 text-sm text-foreground/70 italic">
                    Suggestion: {result.suggestion}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          ))}
          {debugResults.length === 0 && !isAnalyzing && (
            <div className="text-center py-12 text-white/60">
              Click "Start Analysis" to begin debugging your application
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}