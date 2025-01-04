import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowConfigPanel } from "./WorkflowConfigPanel";
import { DeploymentHistoryPanel } from "../deployment/DeploymentHistoryPanel";
import { EnvironmentPanel } from "../environment/EnvironmentPanel";

interface WorkflowDashboardProps {
  projectId: string;
}

export function WorkflowDashboard({ projectId }: WorkflowDashboardProps) {
  return (
    <Tabs defaultValue="workflow" className="space-y-6">
      <TabsList>
        <TabsTrigger value="workflow">Workflow</TabsTrigger>
        <TabsTrigger value="deployments">Deployments</TabsTrigger>
        <TabsTrigger value="environments">Environments</TabsTrigger>
      </TabsList>

      <TabsContent value="workflow">
        <WorkflowConfigPanel projectId={projectId} />
      </TabsContent>

      <TabsContent value="deployments">
        <DeploymentHistoryPanel projectId={projectId} />
      </TabsContent>

      <TabsContent value="environments">
        <EnvironmentPanel projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
}