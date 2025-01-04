import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { MetricCard } from "./metrics/MetricCard";
import { PerformanceChart } from "./metrics/PerformanceChart";
import { PlatformMetrics } from "./metrics/PlatformMetrics";
import { ConversionMetrics } from "./metrics/ConversionMetrics";
import { CustomReportBuilder } from "./metrics/CustomReportBuilder";
import { CrossPlatformInsights } from "./metrics/CrossPlatformInsights";
import { ROIAnalysis } from "./metrics/ROIAnalysis";
import { AIInsights } from "./metrics/AIInsights";
import { useToast } from "@/components/ui/use-toast";

const PLATFORM_COLORS = {
  facebook: "#4267B2",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  google: "#DB4437"
};

export function AdMetricsDashboard() {
  const { toast } = useToast();

  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ["ad-metrics"],
    queryFn: async () => {
      console.log("Fetching ad metrics...");
      const { data, error } = await supabase
        .from("ad_metrics")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching ad metrics:", error);
        throw error;
      }

      return data;
    },
  });

  const { data: platformMetrics } = useQuery({
    queryKey: ["platform-metrics"],
    queryFn: async () => {
      console.log("Fetching platform metrics...");
      const { data, error } = await supabase
        .from("ad_metrics")
        .select("platform, spend, conversions, revenue")
        .order("platform", { ascending: true });

      if (error) {
        console.error("Error fetching platform metrics:", error);
        throw error;
      }

      return data;
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('ad-metrics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ad_metrics'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          refetch();
          toast({
            title: "Metrics Updated",
            description: "Ad performance metrics have been updated in real-time.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const handleGenerateReport = async (config: any) => {
    console.log("Generating report with config:", config);
    // Implementation for report generation
    toast({
      title: "Report Generated",
      description: "Your custom report has been generated and is ready for download.",
    });
  };

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  const totalSpend = metrics?.reduce((acc, curr) => acc + curr.spend, 0) || 0;
  const totalConversions = metrics?.reduce((acc, curr) => acc + curr.conversions, 0) || 0;
  const averageRoas = metrics?.reduce((acc, curr) => acc + curr.roas, 0) / (metrics?.length || 1);
  const averageCTR = (metrics?.reduce((acc, curr) => acc + curr.ctr, 0) || 0) / (metrics?.length || 1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ad Performance Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Spend"
          value={`$${totalSpend.toFixed(2)}`}
          description="Across all platforms"
          icon={DollarSign}
        />
        <MetricCard
          title="Conversions"
          value={totalConversions}
          description="Total conversions"
          icon={TrendingUp}
        />
        <MetricCard
          title="Avg. ROAS"
          value={`${averageRoas.toFixed(2)}x`}
          description="Return on ad spend"
          icon={Users}
        />
        <MetricCard
          title="CTR"
          value={`${averageCTR.toFixed(2)}%`}
          description="Average click-through rate"
          icon={Target}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platforms">Platform Breakdown</TabsTrigger>
              <TabsTrigger value="conversions">Conversion Analytics</TabsTrigger>
              <TabsTrigger value="custom-reports">Custom Reports</TabsTrigger>
              <TabsTrigger value="cross-platform">Cross-Platform</TabsTrigger>
              <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <PerformanceChart data={metrics || []} />
            </TabsContent>

            <TabsContent value="platforms">
              <PlatformMetrics data={platformMetrics || []} />
            </TabsContent>

            <TabsContent value="conversions">
              <ConversionMetrics 
                data={platformMetrics || []} 
                platformColors={PLATFORM_COLORS}
              />
            </TabsContent>

            <TabsContent value="custom-reports">
              <CustomReportBuilder 
                data={metrics || []}
                onGenerateReport={handleGenerateReport}
              />
            </TabsContent>

            <TabsContent value="cross-platform">
              <CrossPlatformInsights data={metrics || []} />
            </TabsContent>

            <TabsContent value="roi">
              <ROIAnalysis data={metrics || []} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-1">
          <AIInsights />
        </div>
      </div>
    </div>
  );
}