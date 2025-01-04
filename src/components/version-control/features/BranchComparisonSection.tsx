import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { FileDiffViewer } from "../FileDiffViewer";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface BranchComparisonSectionProps {
  repositoryId: string | null;
  activeBranchId: string | null;
}

interface ComparisonData {
  source_content: string;
  target_content: string;
}

interface BranchComparison {
  id: string;
  repository_id: string;
  source_branch_id: string;
  target_branch_id: string;
  comparison_data: ComparisonData;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export function BranchComparisonSection({ 
  repositoryId,
  activeBranchId 
}: BranchComparisonSectionProps) {
  const [targetBranchId, setTargetBranchId] = useState<string | null>(null);

  const { data: branches } = useQuery({
    queryKey: ['branches', repositoryId],
    queryFn: async () => {
      if (!repositoryId) return [];
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('repository_id', repositoryId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!repositoryId
  });

  const { data: comparison } = useQuery<BranchComparison | null>({
    queryKey: ['branch-comparison', activeBranchId, targetBranchId],
    queryFn: async () => {
      if (!activeBranchId || !targetBranchId || !repositoryId) return null;
      
      const { data, error } = await supabase
        .from('branch_comparisons')
        .select('*')
        .eq('repository_id', repositoryId)
        .eq('source_branch_id', activeBranchId)
        .eq('target_branch_id', targetBranchId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!activeBranchId && !!targetBranchId && !!repositoryId
  });

  if (!repositoryId || !activeBranchId) {
    return null;
  }

  const availableBranches = branches?.filter(b => b.id !== activeBranchId) || [];

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Branch Comparison</h3>
        <div className="flex items-center gap-2">
          <Select
            value={targetBranchId || ''}
            onValueChange={(value) => setTargetBranchId(value)}
          >
            <option value="">Select target branch</option>
            {availableBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {comparison && comparison.comparison_data && (
        <div className="mt-4">
          <FileDiffViewer
            oldContent={comparison.comparison_data.source_content}
            newContent={comparison.comparison_data.target_content}
          />
        </div>
      )}
    </Card>
  );
}