import { Megaphone, Plus, Search, Filter, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Campaign } from "@/components/ad-creator/types";

export default function Ads() {
  const navigate = useNavigate();
  const session = useSession();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["ad-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_campaigns")
        .select("*")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Campaign[];
    },
    enabled: !!session?.user?.id,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Megaphone className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">AI Studio Ads</h1>
          <p className="text-gray-400">Create and manage AI-powered advertising campaigns</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search campaigns..."
              className="pl-10 w-full"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => navigate("/ads/create")}>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </Card>
          ))
        ) : campaigns?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
            <p className="text-gray-400 mb-4">Create your first AI-powered ad campaign</p>
            <Button onClick={() => navigate("/ads/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        ) : (
          campaigns?.map((campaign) => (
            <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold">{campaign.name}</h3>
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-gray-400 mb-4">{campaign.description}</p>
              <div className="flex justify-between items-center">
                <span className={`text-sm px-2 py-1 rounded-full ${
                  campaign.status === "active" 
                    ? "bg-green-500/10 text-green-500"
                    : "bg-gray-500/10 text-gray-500"
                }`}>
                  {campaign.status}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/ads/${campaign.id}`)}>
                  View Details
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}