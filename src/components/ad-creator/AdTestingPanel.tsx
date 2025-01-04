import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface TestVariant {
  id: string;
  content: string;
  impressions: number;
  clicks: number;
  ctr: number;
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
    },
    {
      id: "B",
      content: "Discover why customers love our innovative solutions",
      impressions: 1150,
      clicks: 95,
      ctr: 8.26,
    },
  ]);

  const handleStartTest = () => {
    toast({
      title: "A/B Test Started",
      description: "Your test variants are now live. Results will update in real-time.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">A/B Testing</h2>
        <Button onClick={handleStartTest}>Start New Test</Button>
      </div>

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
    </div>
  );
}