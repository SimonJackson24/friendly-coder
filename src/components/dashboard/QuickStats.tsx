import { Card } from "@/components/ui/card";
import { Star, Clock, Users } from "lucide-react";

interface QuickStatsProps {
  projectCount: number;
  recentUpdates: number;
}

export function QuickStats({ projectCount, recentUpdates }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold">Active Projects</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{projectCount}</p>
      </Card>
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Recent Updates</h3>
        </div>
        <p className="text-2xl font-bold mt-2">{recentUpdates}</p>
      </Card>
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-green-500" />
          <h3 className="font-semibold">Team Members</h3>
        </div>
        <p className="text-2xl font-bold mt-2">-</p>
      </Card>
    </div>
  );
}