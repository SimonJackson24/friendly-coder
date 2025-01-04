import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Image, Hash, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIRecommendationsProps {
  platform: string;
  adType: string;
  currentPerformance?: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
  };
  industry?: string;
}

export function AIRecommendations({ 
  platform, 
  adType, 
  currentPerformance = {}, 
  industry = "general" 
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ad-recommendations', {
        body: {
          platform,
          adType,
          currentPerformance,
          industry
        }
      });

      if (error) throw error;
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Recommendations</h3>
        </div>
        <Button 
          onClick={generateRecommendations} 
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Recommendations
            </>
          )}
        </Button>
      </div>

      {recommendations && (
        <Tabs defaultValue="creatives" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="creatives">Ad Creatives</TabsTrigger>
            <TabsTrigger value="media">Media Tips</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            <div className="space-y-4 p-4">
              <TabsContent value="creatives" className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Creative Variations</Badge>
                </div>
                <div className="whitespace-pre-wrap">{recommendations}</div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <Badge variant="outline">Media Optimization</Badge>
                </div>
                <div className="whitespace-pre-wrap">{recommendations}</div>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <Badge variant="outline">Suggested Keywords</Badge>
                </div>
                <div className="whitespace-pre-wrap">{recommendations}</div>
              </TabsContent>

              <TabsContent value="optimization" className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <Badge variant="outline">Performance Optimization</Badge>
                </div>
                <div className="whitespace-pre-wrap">{recommendations}</div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      )}
    </Card>
  );
}