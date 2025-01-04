import { Progress } from "@/components/ui/progress";

interface DiffStatsProps {
  additions: number;
  deletions: number;
  total: number;
}

export function DiffStats({ additions, deletions, total }: DiffStatsProps) {
  const addedPercentage = (additions / total) * 100;
  const deletedPercentage = (deletions / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{additions} additions</span>
        <span>{deletions} deletions</span>
      </div>
      <div className="flex gap-1 h-2">
        <div 
          className="bg-green-500 rounded-l"
          style={{ width: `${addedPercentage}%` }} 
        />
        <div 
          className="bg-red-500 rounded-r"
          style={{ width: `${deletedPercentage}%` }} 
        />
      </div>
    </div>
  );
}