import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export function AdMetricsDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["ad-metrics"],
    queryFn: async () => {
      // This would be replaced with actual API calls to ad platforms
      const sampleData = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        impressions: Math.floor(Math.random() * 1000),
        clicks: Math.floor(Math.random() * 100),
        conversions: Math.floor(Math.random() * 20),
      })).reverse();
      
      return sampleData;
    },
  });

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ad Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2">Total Impressions</h3>
          <p className="text-2xl font-bold">
            {metrics?.reduce((acc, curr) => acc + curr.impressions, 0)}
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2">Total Clicks</h3>
          <p className="text-2xl font-bold">
            {metrics?.reduce((acc, curr) => acc + curr.clicks, 0)}
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2">Total Conversions</h3>
          <p className="text-2xl font-bold">
            {metrics?.reduce((acc, curr) => acc + curr.conversions, 0)}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Performance Over Time</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="impressions" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="clicks" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="conversions" stroke="#ffc658" fill="#ffc658" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}