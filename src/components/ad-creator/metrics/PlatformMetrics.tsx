import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface PlatformMetricsProps {
  data: any[];
}

export function PlatformMetrics({ data }: PlatformMetricsProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Platform Performance</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="spend" name="Spend" fill="#8884d8" />
            <Bar dataKey="conversions" name="Conversions" fill="#82ca9d" />
            <Bar dataKey="revenue" name="Revenue" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}