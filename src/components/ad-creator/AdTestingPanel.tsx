import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TestVariant {
  id: string;
  content: string;
  impressions: number;
  clicks: number;
  ctr: number;
  confidence: number;
}

interface TestAnalysis {
  winner: string | null;
  confidenceLevel: number;
  improvementPercent: number;
  recommendation: string;
}

export function AdTestingPanel() {
  const { toast } = useToast();
  const [variants, setVariants] = useState<TestVariant[]>([
    {
      id: "A",
      content: "Experience the difference with our premium product line",
      impressions: 1200,
      clicks: 80,
      ctr: 6.67,
      confidence: 95,
    },
    {
      id: "B",
      content: "Discover why customers love our innovative solutions",
      impressions: 1150,
      clicks: 95,
      ctr: 8.26,
      confidence: 97,
    },
  ]);

  // Fetch AI-generated test variations
  const { data: aiSuggestions } = useQuery({
    queryKey: ["ai-test-suggestions"],
    queryFn: async () => {
      console.log("Fetching AI test suggestions...");
      const { data, error } = await supabase.functions.invoke("generate-ad-variations", {
        body: {
          originalContent: variants[0].content,
          targetMetrics: ["CTR", "Conversions"],
          platform: "facebook", // This could be dynamic
        },
      });

      if (error) {
        console.error("Error fetching AI suggestions:", error);
        throw error;
      }

      return data;
    },
  });

  const calculateStatisticalSignificance = (variantA: TestVariant, variantB: TestVariant): TestAnalysis => {
    // Z-score calculation for statistical significance
    const pA = variantA.clicks / variantA.impressions;
    const pB = variantB.clicks / variantB.impressions;
    const nA = variantA.impressions;
    const nB = variantB.impressions;
    
    const pooledStdErr = Math.sqrt((pA * (1 - pA)) / nA + (pB * (1 - pB)) / nB);
    const zScore = Math.abs((pB - pA) / pooledStdErr);
    
    // Convert z-score to confidence level
    const confidence = (1 - 0.5 * Math.erfc(zScore / Math.sqrt(2))) * 100;
    
    const improvementPercent = ((pB - pA) / pA) * 100;
    
    return {
      winner: improvementPercent > 0 ? "B" : (improvementPercent < 0 ? "A" : null),
      confidenceLevel: confidence,
      improvementPercent: Math.abs(improvementPercent),
      recommendation: confidence > 95 
        ? `Variant ${improvementPercent > 0 ? 'B' : 'A'} is the clear winner with ${confidence.toFixed(1)}% confidence`
        : "Continue testing to reach statistical significance",
    };
  };

  const analysis = calculateStatisticalSignificance(variants[0], variants[1]);

  const handleStartTest = async () => {
    if (aiSuggestions?.variations) {
      const newVariants = aiSuggestions.variations.map((variation: string, index: number) => ({
        id: String.fromCharCode(65 + index), // A, B, C, etc.
        content: variation,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        confidence: 0,
      }));

      setVariants(newVariants);
      
      toast({
        title: "A/B Test Started",
        description: "AI-generated variations are now live. Results will update in real-time.",
      });
    }
  };

  const performanceData = variants.map((variant) => ({
    name: `Variant ${variant.id}`,
    CTR: variant.ctr,
    Clicks: variant.clicks,
    Impressions: variant.impressions,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">A/B Testing</h2>
        <Button onClick={handleStartTest}>Start New Test</Button>
      </div>

      <Tabs defaultValue="results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <div className="grid gap-4">
            {variants.map((variant) => (
              <Card key={variant.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Variant {variant.id}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{variant.content}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">CTR</p>
                    <p className="text-2xl font-bold">{variant.ctr}%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Impressions: {variant.impressions}</span>
                    <span>Clicks: {variant.clicks}</span>
                  </div>
                  <Progress value={variant.ctr * 10} className="h-2" />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Statistical Analysis</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Confidence Level</p>
                  <p className="text-2xl font-bold">{analysis.confidenceLevel.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Improvement</p>
                  <p className="text-2xl font-bold">{analysis.improvementPercent.toFixed(1)}%</p>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">Recommendation</p>
                <p className="text-sm mt-1">{analysis.recommendation}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="visualization">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Performance Visualization</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="CTR" stroke="#8884d8" />
                  <Line type="monotone" dataKey="Clicks" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}