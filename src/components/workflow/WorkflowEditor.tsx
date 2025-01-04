import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { workflowSchema } from "@/services/build/workflowConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WorkflowEditor() {
  const [workflowYaml, setWorkflowYaml] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const { toast } = useToast();

  const validateWorkflow = () => {
    try {
      // Parse YAML to JSON
      const config = JSON.parse(workflowYaml); // Replace with YAML parser
      workflowSchema.parse(config);
      
      toast({
        title: "Workflow Valid",
        description: "The workflow configuration is valid.",
      });
    } catch (error) {
      console.error("Workflow validation error:", error);
      toast({
        title: "Validation Error",
        description: error instanceof Error ? error.message : "Invalid workflow configuration",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      validateWorkflow();
      // Save workflow configuration to database
      toast({
        title: "Success",
        description: "Workflow configuration saved successfully.",
      });
    } catch (error) {
      console.error("Error saving workflow:", error);
    }
  };

  return (
    <Card className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Textarea
            value={workflowYaml}
            onChange={(e) => setWorkflowYaml(e.target.value)}
            placeholder="# Enter your workflow configuration in YAML format"
            className="min-h-[400px] font-mono"
          />
          <div className="flex gap-2">
            <Button onClick={validateWorkflow}>Validate</Button>
            <Button onClick={handleSave} variant="default">Save</Button>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <pre className="p-4 bg-secondary rounded-md overflow-auto">
            {workflowYaml}
          </pre>
        </TabsContent>
      </Tabs>
    </Card>
  );
}