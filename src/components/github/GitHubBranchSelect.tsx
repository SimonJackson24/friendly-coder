import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitBranch } from "lucide-react";

interface GitHubBranchSelectProps {
  branches: string[];
  currentBranch: string;
  onBranchChange: (branch: string) => void;
}

export function GitHubBranchSelect({ branches, currentBranch, onBranchChange }: GitHubBranchSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <GitBranch className="w-4 h-4" />
      <Select value={currentBranch} onValueChange={onBranchChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select branch" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch) => (
            <SelectItem key={branch} value={branch}>
              {branch}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}