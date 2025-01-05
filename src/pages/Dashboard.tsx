import { useSession } from "@supabase/auth-helpers-react";
import { Navigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DashboardStats } from "@/components/dashboard/stats/DashboardStats";
import { RecentActivitySection } from "@/components/dashboard/activity/RecentActivitySection";
import { ActiveProjectsSection } from "@/components/dashboard/projects/ActiveProjectsSection";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";

export default function Dashboard() {
  const session = useSession();
  useOfflineStatus();

  if (!session) {
    console.log("No session found, redirecting to login");
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Breadcrumbs />
      <DashboardHeader userEmail={session.user.email || ''} />
      
      <DashboardStats />
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivitySection />
        <ActiveProjectsSection />
      </div>
    </div>
  );
}