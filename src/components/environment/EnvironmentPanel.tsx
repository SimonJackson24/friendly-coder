import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Globe, Plus, Copy, ArrowRightLeft } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EnvironmentPanelProps {
  projectId: string;
}

export function EnvironmentPanel({ projectId }: EnvironmentPanelProps) {
  const [newEnvName, setNewEnvName] = useState("");
  const { toast } = useToast();

  const { data: environments, refetch } = useQuery({
    queryKey: ["environments", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("build_environments")
        .select("*")
        .eq("project_id", projectId);

      if (error) throw error;
      return data;
    },
  });

  const createEnvironmentMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("build_environments").insert({
        project_id: projectId,
        name: newEnvName,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Environment Created",
        description: "New environment has been created successfully.",
      });
      setNewEnvName("");
      refetch();
    },
    onError: (error) => {
      console.error("Error creating environment:", error);
      toast({
        title: "Error",
        description: "Failed to create environment",
        variant: "destructive",
      });
    },
  });

  const cloneEnvironmentMutation = useMutation({
    mutationFn: async (sourceEnvId: string) => {
      const { error } = await supabase.from("environment_clones").insert({
        source_env_id: sourceEnvId,
        target_env_id: sourceEnvId, // You might want to let users select the target
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Environment Cloned",
        description: "Environment has been cloned successfully.",
      });
      refetch();
    },
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Environments</h2>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2">
          <div className="flex-grow">
            <Label htmlFor="newEnv">New Environment</Label>
            <Input
              id="newEnv"
              value={newEnvName}
              onChange={(e) => setNewEnvName(e.target.value)}
              placeholder="Enter environment name"
            />
          </div>
          <Button
            className="mt-8"
            onClick={() => createEnvironmentMutation.mutate()}
            disabled={createEnvironmentMutation.isPending || !newEnvName}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
        </div>

        <div className="grid gap-4">
          {environments?.map((env) => (
            <Card key={env.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{env.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {env.description || "No description"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cloneEnvironmentMutation.mutate(env.id)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Clone
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Compare
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}