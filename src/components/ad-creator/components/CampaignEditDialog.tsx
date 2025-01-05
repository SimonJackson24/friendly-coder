import { Campaign } from "../types/campaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CampaignEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  onSave: (campaign: Campaign) => void;
  setCampaign: (campaign: Campaign) => void;
}

export function CampaignEditDialog({ 
  isOpen, 
  onOpenChange, 
  campaign, 
  onSave, 
  setCampaign 
}: CampaignEditDialogProps) {
  if (!campaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
          <DialogDescription>
            Modify your campaign settings below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label>Campaign Name</Label>
            <Input 
              value={campaign.name}
              onChange={(e) => setCampaign({
                ...campaign,
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
                value={campaign.budget_allocation.daily}
                onChange={(e) => setCampaign({
                  ...campaign,
                  budget_allocation: {
                    ...campaign.budget_allocation,
                    daily: Number(e.target.value)
                  }
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Platform Budget Distribution</Label>
            {Object.entries(campaign.budget_allocation.platforms).map(([platform, percentage]) => (
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
                    setCampaign({
                      ...campaign,
                      budget_allocation: {
                        ...campaign.budget_allocation,
                        platforms: {
                          ...campaign.budget_allocation.platforms,
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => onSave(campaign)}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}