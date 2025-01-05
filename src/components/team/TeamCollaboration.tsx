import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, Calendar, Settings } from "lucide-react";

export function TeamCollaboration() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Team Collaboration</h1>
      
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="w-4 h-4 mr-2" />
            Team Chat
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <Calendar className="w-4 h-4 mr-2" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Team Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Team Members</h2>
            <p className="text-muted-foreground">
              Manage your team members and their roles here.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Team Chat</h2>
            <p className="text-muted-foreground">
              Communicate with your team in real-time.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="meetings">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Team Meetings</h2>
            <p className="text-muted-foreground">
              Schedule and manage team meetings.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Team Settings</h2>
            <p className="text-muted-foreground">
              Configure team preferences and permissions.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}