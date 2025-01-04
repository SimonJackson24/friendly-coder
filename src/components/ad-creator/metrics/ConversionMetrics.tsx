import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";

interface ConversionMetricsProps {
  data: any[];
  platformColors: Record<string, string>;
}

export function ConversionMetrics({ data, platformColors }: ConversionMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Conversion by Platform</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="conversions"
                nameKey="platform"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={platformColors[entry.platform]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Cost per Conversion</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const data = payload[0].payload;
                const costPerConversion = data.spend / data.conversions;
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="text-sm">${costPerConversion.toFixed(2)}</p>
                  </div>
                );
              }} />
              <Bar dataKey="spend" name="Cost per Conversion" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}