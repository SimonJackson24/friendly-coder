import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { PlatformCard } from "./platform-connections/PlatformCard";
import { usePlatformConnections } from "./platform-connections/usePlatformConnections";

export function AdPlatformConnections() {
  const {
    connections,
    isLoading,
    isConnecting,
    handleConnect,
  } = usePlatformConnections();

  if (isLoading) {
    return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  const platforms = [
    { id: 'facebook', name: 'Facebook Ads' },
    { id: 'google', name: 'Google Ads' },
    { id: 'linkedin', name: 'LinkedIn Ads' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ad Platform Connections</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map(platform => (
          <PlatformCard
            key={platform.id}
            platform={platform.id}
            displayName={platform.name}
            connection={connections?.find(c => c.platform === platform.id)}
            isConnecting={isConnecting}
            onConnect={handleConnect}
          />
        ))}
      </div>
    </div>
  );
}