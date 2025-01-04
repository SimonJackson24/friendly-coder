import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface CrossPlatformInsightsProps {
  data: any[];
}

export function CrossPlatformInsights({ data }: CrossPlatformInsightsProps) {
  const platformMetrics = data.reduce((acc: any, curr) => {
    if (!acc[curr.platform]) {
      acc[curr.platform] = {
        platform: curr.platform,
        spend: 0,
        revenue: 0,
        conversions: 0,
        roas: 0,
      };
    }
    
    acc[curr.platform].spend += curr.spend;
    acc[curr.platform].revenue += curr.revenue;
    acc[curr.platform].conversions += curr.conversions;
    acc[curr.platform].roas = acc[curr.platform].revenue / acc[curr.platform].spend;
    
    return acc;
  }, {});

  const chartData = Object.values(platformMetrics);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-6">Cross-Platform Performance</h3>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="platform" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="spend" name="Spend" fill="#8884d8" />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#82ca9d" />
            <Bar yAxisId="right" dataKey="roas" name="ROAS" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}