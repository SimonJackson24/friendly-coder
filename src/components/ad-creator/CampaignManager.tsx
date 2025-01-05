import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Campaign } from "./types/campaign";
import { CampaignOverview } from "./components/CampaignOverview";
import { CampaignEditDialog } from "./components/CampaignEditDialog";

export function CampaignManager() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Summer Sale Campaign",
      description: null,
      status: "active",
      budget: 1000,
      spent: 450,
      reach: 15000,
      start_date: "2024-03-01",
      end_date: "2024-03-31",
      targeting: {
        locations: ["New York", "Los Angeles"],
        ageRange: { min: 18, max: 65 },
        interests: ["Fashion", "Shopping"],
        demographics: ["Young Professionals"],
      },
      schedule: {
        frequency: "daily",
        dayParting: ["9:00-17:00"],
        timeZone: "America/New_York",
      },
      budget_allocation: {
        daily: 50,
        total: 1000,
        platforms: {
          facebook: 40,
          instagram: 60,
        },
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: "1",
    },
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleStatusChange = (campaignId: string, newStatus: string) => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: newStatus }
        : campaign
    ));

    toast({
      title: "Campaign Updated",
      description: `Campaign status changed to ${newStatus}`,
    });
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = (campaign: Campaign) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaign.id ? campaign : c
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Changes Saved",
      description: "Campaign settings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Campaign Management</h2>
        <Button>Create Campaign</Button>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-medium">{campaign.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                    {campaign.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ID: {campaign.id}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(campaign.id, "active")}
                  disabled={campaign.status === "active"}
                >
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(campaign.id, "paused")}
                  disabled={campaign.status === "paused"}
                >
                  Pause
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleEditCampaign(campaign)}
                >
                  Edit
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="targeting">Targeting</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <CampaignOverview campaign={campaign} />
              </TabsContent>

              <TabsContent value="targeting" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Locations</h4>
                    <div className="flex flex-wrap gap-2">
                      {campaign.targeting.locations.map((location) => (
                        <Badge key={location} variant="secondary">{location}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Age Range</h4>
                    <p>{campaign.targeting.ageRange.min} - {campaign.targeting.ageRange.max} years</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {campaign.targeting.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Frequency</h4>
                    <p className="capitalize">{campaign.schedule.frequency}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Day Parting</h4>
                    <div className="flex flex-wrap gap-2">
                      {campaign.schedule.dayParting.map((time) => (
                        <Badge key={time} variant="secondary">{time}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Time Zone</h4>
                    <p>{campaign.schedule.timeZone}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="budget" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Daily Budget</h4>
                    <p>${campaign.budget_allocation.daily}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Platform Distribution</h4>
                    <div className="space-y-2">
                      {Object.entries(campaign.budget_allocation.platforms).map(([platform, percentage]) => (
                        <div key={platform} className="flex items-center justify-between">
                          <span className="capitalize">{platform}</span>
                          <span>{percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        ))}
      </div>

      <CampaignEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        campaign={selectedCampaign}
        onSave={handleSaveChanges}
        setCampaign={setSelectedCampaign}
      />
    </div>
  );
}