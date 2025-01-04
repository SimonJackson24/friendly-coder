import { AdCreator } from "@/components/ad-creator/AdCreator";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdMetricsDashboard } from "@/components/ad-creator/AdMetricsDashboard";
import { AdTestingPanel } from "@/components/ad-creator/AdTestingPanel";
import { CampaignManager } from "@/components/ad-creator/CampaignManager";
import { AdPlatformConnections } from "@/components/ad-creator/AdPlatformConnections";

export default function Ads() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">AI Ad Studio</h1>
      
      <Tabs defaultValue="creator" className="space-y-4">
        <TabsList>
          <TabsTrigger value="creator">Create Ads</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="testing">A/B Testing</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="connections">Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="creator">
          <Card className="p-6">
            <AdCreator />
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card className="p-6">
            <AdMetricsDashboard />
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <Card className="p-6">
            <AdTestingPanel />
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card className="p-6">
            <CampaignManager />
          </Card>
        </TabsContent>

        <TabsContent value="connections">
          <Card className="p-6">
            <AdPlatformConnections />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}