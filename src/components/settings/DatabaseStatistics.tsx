import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Database, Signal, ChartLine } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function DatabaseStatistics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["database-stats"],
    queryFn: async () => {
      console.log("Fetching database statistics...");
      
      // Get counts from different tables
      const [filesCount, projectsCount, versionsCount] = await Promise.all([
        supabase.from("files").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("version_history").select("*", { count: "exact", head: true })
      ]);

      // Generate sample data for the chart (in a real app, this would come from actual metrics)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toLocaleDateString(),
          operations: Math.floor(Math.random() * 100) + 20 // Sample data
        };
      }).reverse();

      return {
        totalFiles: filesCount.count || 0,
        totalProjects: projectsCount.count || 0,
        totalVersions: versionsCount.count || 0,
        operationsHistory: last7Days
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Overview
          </CardTitle>
          <CardDescription>
            Real-time statistics of your database usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Files</p>
                    <h3 className="text-2xl font-bold">{stats?.totalFiles}</h3>
                  </div>
                  <Signal className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total Projects</p>
                    <h3 className="text-2xl font-bold">{stats?.totalProjects}</h3>
                  </div>
                  <Signal className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Version History</p>
                    <h3 className="text-2xl font-bold">{stats?.totalVersions}</h3>
                  </div>
                  <ChartLine className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Operations History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.operationsHistory}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Date
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {label}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Operations
                                </span>
                                <span className="font-bold">
                                  {payload[0].value}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Area
                      type="monotone"
                      dataKey="operations"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary)/.2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}