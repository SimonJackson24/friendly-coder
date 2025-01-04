import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function AIInsights() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ["ad-insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_insights")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading insights...</div>;
  }

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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
      <div className="grid gap-4">
        {insights?.map((insight) => (
          <Card key={insight.id}>
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
                  {insight.content.recommendations?.[0]?.suggestion || 
                   insight.content.recommendations?.[0]?.prediction ||
                   insight.content.recommendations?.[0]?.insight}
                </CardDescription>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Confidence: {(insight.confidence_score * 100).toFixed(0)}%
                {insight.impact_score && ` • Impact: ${(insight.impact_score * 100).toFixed(0)}%`}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}