import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, Target, RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface InsightRecommendation {
  type: string;
  suggestion?: string;
  prediction?: string;
  insight?: string;
  expectedImpact?: string;
  confidence?: string;
  action?: string;
}

interface InsightContent {
  recommendations: InsightRecommendation[];
  confidenceScore: number;
  impactScore: number;
  [key: string]: unknown;
}

interface AdInsight {
  id: string;
  insight_type: string;
  content: unknown;
  confidence_score: number;
  implemented: boolean;
  impact_score: number;
  created_at: string;
}

function isInsightContent(content: unknown): content is InsightContent {
  if (!content || typeof content !== 'object') return false;
  
  const c = content as any;
  return (
    Array.isArray(c?.recommendations) &&
    typeof c?.confidenceScore === 'number' &&
    typeof c?.impactScore === 'number'
  );
}

export function AIInsights() {
  const { toast } = useToast();
  const { data: insights, isLoading, refetch } = useQuery({
    queryKey: ["ad-insights"],
    queryFn: async () => {
      console.log("Fetching AI insights...");
      const { data, error } = await supabase
        .from("ad_insights")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching insights:", error);
        throw error;
      }
      return data as AdInsight[];
    },
  });

  const generateNewInsights = async (type: string) => {
    console.log(`Generating new ${type} insights...`);
    try {
      const response = await supabase.functions.invoke('generate-ad-insights', {
        body: { insightType: type }
      });

      if (response.error) throw response.error;

      await refetch();
      toast({
        title: "New Insights Generated",
        description: `Successfully generated new ${type} insights.`,
      });
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Error",
        description: "Failed to generate new insights. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "optimization":
        return <Lightbulb className="w-4 h-4" />;
      case "prediction":
        return <TrendingUp className="w-4 h-4" />;
      case "competitive":
        return <Target className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return <div>Loading insights...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => generateNewInsights('optimization')}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh Insights
        </Button>
      </div>
      
      <div className="grid gap-4">
        {insights?.map((insight) => {
          const content = isInsightContent(insight.content) ? insight.content : null;
          
          if (!content) {
            console.warn(`Invalid insight content structure for insight ID: ${insight.id}`);
            return null;
          }

          return content.recommendations.map((recommendation, index) => (
            <Card key={`${insight.id}-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {insight.insight_type.charAt(0).toUpperCase() + insight.insight_type.slice(1)} Insight
                </CardTitle>
                <Badge variant={insight.implemented ? "default" : "secondary"}>
                  {insight.implemented ? "Implemented" : "New"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getInsightIcon(insight.insight_type)}
                  <CardDescription>
                    {recommendation.suggestion || 
                     recommendation.prediction ||
                     recommendation.insight}
                  </CardDescription>
                </div>
                {recommendation.expectedImpact && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Expected Impact: {recommendation.expectedImpact}
                  </div>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  Confidence: {(insight.confidence_score * 100).toFixed(0)}%
                  {insight.impact_score && ` • Impact: ${(insight.impact_score * 100).toFixed(0)}%`}
                </div>
              </CardContent>
            </Card>
          ));
        })}
      </div>
    </div>
  );
}