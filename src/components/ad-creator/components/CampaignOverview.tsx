import { Campaign } from "../types/campaign";
import { DollarSign, Activity, Users, Calendar } from "lucide-react";

interface CampaignOverviewProps {
  campaign: Campaign;
}

export function CampaignOverview({ campaign }: CampaignOverviewProps) {
  return (
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
            {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not set'} - 
            {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Not set'}
          </p>
        </div>
      </div>
    </div>
  );
}