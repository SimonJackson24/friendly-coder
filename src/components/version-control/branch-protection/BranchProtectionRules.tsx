import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BranchProtectionRule {
  id: string;
  branch_id: string;
  required_approvals: number;
  dismiss_stale_reviews: boolean;
  require_up_to_date: boolean;
  enforce_admins: boolean;
}

interface BranchProtectionRulesProps {
  branchId: string;
  repositoryId: string;
}

export function BranchProtectionRules({ branchId, repositoryId }: BranchProtectionRulesProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rules, isLoading } = useQuery({
    queryKey: ["branch-protection-rules", branchId],
    queryFn: async () => {
      console.log("Fetching branch protection rules for branch:", branchId);
      const { data, error } = await supabase
        .from("branch_protection_rules")
        .select("*")
        .eq("branch_id", branchId);

      if (error) throw error;
      return data as BranchProtectionRule[];
    },
  });

  const createRule = useMutation({
    mutationFn: async (rule: Partial<BranchProtectionRule>) => {
      console.log("Creating branch protection rule:", rule);
      const { data, error } = await supabase
        .from("branch_protection_rules")
        .insert([
          {
            branch_id: branchId,
            repository_id: repositoryId,
            ...rule,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch-protection-rules"] });
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Branch protection rule created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating branch protection rule:", error);
      toast({
        title: "Error",
        description: "Failed to create branch protection rule",
        variant: "destructive",
      });
    },
  });

  const deleteRule = useMutation({
    mutationFn: async (ruleId: string) => {
      console.log("Deleting branch protection rule:", ruleId);
      const { error } = await supabase
        .from("branch_protection_rules")
        .delete()
        .eq("id", ruleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch-protection-rules"] });
      toast({
        title: "Success",
        description: "Branch protection rule deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting branch protection rule:", error);
      toast({
        title: "Error",
        description: "Failed to delete branch protection rule",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading branch protection rules...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Branch Protection Rules</h2>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {isCreating && (
        <Card className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createRule.mutate({
                required_approvals: Number(formData.get("required_approvals")),
                dismiss_stale_reviews: formData.get("dismiss_stale_reviews") === "on",
                require_up_to_date: formData.get("require_up_to_date") === "on",
                enforce_admins: formData.get("enforce_admins") === "on",
              });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="required_approvals">Required Approvals</Label>
              <Input
                id="required_approvals"
                name="required_approvals"
                type="number"
                min="1"
                defaultValue="1"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dismiss_stale_reviews">Dismiss Stale Reviews</Label>
                <Switch id="dismiss_stale_reviews" name="dismiss_stale_reviews" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="require_up_to_date">Require Branch to be Up to Date</Label>
                <Switch id="require_up_to_date" name="require_up_to_date" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enforce_admins">Enforce for Administrators</Label>
                <Switch id="enforce_admins" name="enforce_admins" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
                disabled={createRule.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createRule.isPending}>
                {createRule.isPending ? "Creating..." : "Create Rule"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-2">
        {rules?.map((rule) => (
          <Card key={rule.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="font-medium">Required Approvals: {rule.required_approvals}</div>
                <div className="text-sm text-muted-foreground">
                  {rule.dismiss_stale_reviews && "Dismisses stale reviews • "}
                  {rule.require_up_to_date && "Requires up-to-date branch • "}
                  {rule.enforce_admins && "Enforced for administrators"}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteRule.mutate(rule.id)}
                disabled={deleteRule.isPending}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}