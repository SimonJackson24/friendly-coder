import { Textarea } from "@/components/ui/textarea";

interface CampaignGoalsProps {
  goals: string;
  onGoalsChange: (value: string) => void;
}

export function CampaignGoalsSection({ goals, onGoalsChange }: CampaignGoalsProps) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Campaign Goals</label>
      <Textarea
        value={goals}
        onChange={(e) => onGoalsChange(e.target.value)}
        placeholder="What are your campaign goals?"
        className="w-full"
      />
    </div>
  );
}