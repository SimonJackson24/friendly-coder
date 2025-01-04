import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, Loader2, XCircle, Clock } from "lucide-react";

interface BuildStatusProps {
  status: string;
}

export function BuildStatus({ status }: BuildStatusProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          variant: "default" as const,
          icon: Check,
          label: "Completed",
        };
      case "failed":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          label: "Failed",
        };
      case "running":
        return {
          variant: "default" as const,
          icon: Loader2,
          label: "Running",
        };
      case "cancelled":
        return {
          variant: "secondary" as const,
          icon: AlertCircle,
          label: "Cancelled",
        };
      default:
        return {
          variant: "secondary" as const,
          icon: Clock,
          label: "Pending",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="h-6">
      <Icon className={`h-4 w-4 mr-1 ${status === 'running' ? 'animate-spin' : ''}`} />
      {config.label}
    </Badge>
  );
}