import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Users, Activity, Clock, Target, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Campaign } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CampaignManager() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Summer Sale Campaign",
      status: "active",
      budget: 1000,
      spent: 450,
      reach: 15000,
      startDate: "2024-03-01",
      endDate: "2024-03-31",
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
      budgetAllocation: {
        daily: 50,
        total: 1000,
        platforms: {
          facebook: 40,
          instagram: 60,
        },
      },
    },
  ]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleStatusChange = (campaignId: string, newStatus: "active" | "paused" | "completed") => {
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-medium">${campaign.budget}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Spent</p>
                      <p className="font-medium">${campaign.spent}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Reach</p>
                      <p className="font-medium">{campaign.reach.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
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
                    <p>${campaign.budgetAllocation.daily}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Platform Distribution</h4>
                    <div className="space-y-2">
                      {Object.entries(campaign.budgetAllocation.platforms).map(([platform, percentage]) => (
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Modify your campaign settings below
            </DialogDescription>
          </DialogHeader>

          {selectedCampaign && (
            <div className="space-y-6">
              <div>
                <Label>Campaign Name</Label>
                <Input 
                  value={selectedCampaign.name}
                  onChange={(e) => setSelectedCampaign({
                    ...selectedCampaign,
                    name: e.target.value
                  })}
                />
              </div>

              <div>
                <Label>Daily Budget</Label>
                <div className="flex items-center gap-2">
                  <span>$</span>
                  <Input 
                    type="number"
                    value={selectedCampaign.budgetAllocation.daily}
                    onChange={(e) => setSelectedCampaign({
                      ...selectedCampaign,
                      budgetAllocation: {
                        ...selectedCampaign.budgetAllocation,
                        daily: Number(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Platform Budget Distribution</Label>
                {Object.entries(selectedCampaign.budgetAllocation.platforms).map(([platform, percentage]) => (
                  <div key={platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="capitalize">{platform}</span>
                      <span>{percentage}%</span>
                    </div>
                    <Slider
                      value={[percentage]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={([value]) => {
                        setSelectedCampaign({
                          ...selectedCampaign,
                          budgetAllocation: {
                            ...selectedCampaign.budgetAllocation,
                            platforms: {
                              ...selectedCampaign.budgetAllocation.platforms,
                              [platform]: value
                            }
                          }
                        });
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSaveChanges(selectedCampaign)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}