import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface PerformanceChartProps {
  data: any[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Performance Trends</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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
  );
}