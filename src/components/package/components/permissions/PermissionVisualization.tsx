import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export function PermissionVisualization({ packageId }: { packageId: string }) {
  const { data: accessStats, isLoading } = useQuery({
    queryKey: ['access-stats', packageId],
    queryFn: async () => {
      const { data: accessList } = await supabase
        .from('package_access')
        .select('access_level')
        .eq('package_id', packageId);

      const stats = (accessList || []).reduce((acc: Record<string, number>, curr) => {
        acc[curr.access_level] = (acc[curr.access_level] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(stats).map(([name, value]) => ({ name, value }));
    }
  });

  if (isLoading || !accessStats?.length) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5" />
        <h3 className="font-semibold">Access Distribution</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={accessStats}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {accessStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}