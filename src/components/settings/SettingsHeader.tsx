import { Skeleton } from "@/components/ui/skeleton";

interface SettingsHeaderProps {
  isLoading?: boolean;
}

export function SettingsHeader({ isLoading }: SettingsHeaderProps) {
  return (
    <div className="mb-8">
      {isLoading ? (
        <Skeleton className="h-8 w-48" />
      ) : (
        <h1 className="text-3xl font-bold">Settings</h1>
      )}
    </div>
  );
}