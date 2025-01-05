import { Button } from "@/components/ui/button";
import { BrainCog, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  userEmail: string;
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">AI Studio Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {userEmail}
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/version-control">
            <GitBranch className="mr-2 h-4 w-4" />
            AI Studio VCS
          </Link>
        </Button>
        <Button asChild>
          <Link to="/assistant">
            <BrainCog className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>
    </div>
  );
}