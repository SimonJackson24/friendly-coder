import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepositoryList } from "./RepositoryList";

export function VersionControl({ projectId }: { projectId: string | null }) {
  if (!projectId) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No Project Selected</h2>
          <p className="text-muted-foreground">
            Please select a project to manage version control.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/75 backdrop-blur-md border-white/10">
      <Tabs defaultValue="repositories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="commits">Commits</TabsTrigger>
        </TabsList>

        <TabsContent value="repositories">
          <RepositoryList projectId={projectId} />
        </TabsContent>

        <TabsContent value="branches">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Select a repository to manage branches
            </p>
          </div>
        </TabsContent>

        <TabsContent value="commits">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Select a repository to view commit history
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}