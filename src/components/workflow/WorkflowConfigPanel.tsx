import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings2, Play, Save } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WorkflowConfigPanelProps {
  projectId: string;
}

export function WorkflowConfigPanel({ projectId }: WorkflowConfigPanelProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [config, setConfig] = useState("");
  const { toast } = useToast();

  const { data: workflows, refetch } = useQuery({
    queryKey: ["workflows", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflow_configurations")
        .select("*")
        .eq("project_id", projectId);

      if (error) throw error;
      return data;
    },
  });

  const createWorkflowMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("workflow_configurations").insert({
        project_id: projectId,
        name,
        description,
        configuration: JSON.parse(config),
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Workflow Created",
        description: "The workflow configuration has been saved successfully.",
      });
      refetch();
    },
    onError: (error) => {
      console.error("Error creating workflow:", error);
      toast({
        title: "Error",
        description: "Failed to create workflow configuration",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Workflow Configuration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Workflow Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter workflow name"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your workflow"
          />
        </div>

        <div>
          <Label htmlFor="config">Configuration (JSON)</Label>
          <Textarea
            id="config"
            value={config}
            onChange={(e) => setConfig(e.target.value)}
            placeholder="Enter workflow configuration in JSON format"
            className="font-mono"
            rows={10}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => createWorkflowMutation.mutate()}
            disabled={createWorkflowMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Workflow
          </Button>
          <Button variant="secondary">
            <Play className="w-4 h-4 mr-2" />
            Test Workflow
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Existing Workflows</h3>
          <div className="space-y-2">
            {workflows?.map((workflow) => (
              <Card key={workflow.id} className="p-4">
                <h4 className="font-medium">{workflow.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {workflow.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}