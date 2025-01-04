import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";

const PLATFORM_COLORS = {
  facebook: "#4267B2",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  google: "#DB4437"
};

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
        cost: Math.random() * 500,
        ctr: Math.random() * 5,
        cpc: Math.random() * 2,
        conversionRate: Math.random() * 10,
        platform: ['facebook', 'instagram', 'twitter', 'google'][Math.floor(Math.random() * 4)],
        roas: Math.random() * 4 + 1,
      })).reverse();
      
      return sampleData;
    },
  });

  const { data: platformMetrics } = useQuery({
    queryKey: ["platform-metrics"],
    queryFn: async () => {
      return Object.entries(PLATFORM_COLORS).map(([platform]) => ({
        platform,
        spend: Math.random() * 1000,
        conversions: Math.floor(Math.random() * 100),
        revenue: Math.random() * 2000,
      }));
    },
  });

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  const totalSpend = metrics?.reduce((acc, curr) => acc + curr.cost, 0) || 0;
  const totalConversions = metrics?.reduce((acc, curr) => acc + curr.conversions, 0) || 0;
  const averageRoas = metrics?.reduce((acc, curr) => acc + curr.roas, 0) / (metrics?.length || 1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ad Performance Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Spend</h3>
          </div>
          <p className="text-2xl font-bold mt-2">${totalSpend.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Across all platforms</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Conversions</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{totalConversions}</p>
          <p className="text-xs text-muted-foreground">Total conversions</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Avg. ROAS</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{averageRoas.toFixed(2)}x</p>
          <p className="text-xs text-muted-foreground">Return on ad spend</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">CTR</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {((metrics?.reduce((acc, curr) => acc + curr.ctr, 0) || 0) / (metrics?.length || 1)).toFixed(2)}%
          </p>
          <p className="text-xs text-muted-foreground">Average click-through rate</p>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platform Breakdown</TabsTrigger>
          <TabsTrigger value="conversions">Conversion Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Performance Trends</h3>
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
        </TabsContent>

        <TabsContent value="platforms">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Platform Performance</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformMetrics}>
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
        </TabsContent>

        <TabsContent value="conversions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Conversion by Platform</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformMetrics}
                      dataKey="conversions"
                      nameKey="platform"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {platformMetrics?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.platform]} />
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
                  <BarChart data={platformMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="spend"
                      name="Cost per Conversion"
                      fill="#8884d8"
                      formatter={(value, name, props) => 
                        `$${(props.payload.spend / props.payload.conversions).toFixed(2)}`
                      }
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}