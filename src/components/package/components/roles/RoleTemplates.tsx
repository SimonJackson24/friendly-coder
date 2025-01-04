import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Key, Shield, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
}

export function RoleTemplates() {
  const [newTemplate, setNewTemplate] = useState({ name: "", description: "", permissions: {} });
  const { toast } = useToast();

  const { data: templates, refetch } = useQuery({
    queryKey: ['role-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_templates')
        .select('*');
      
      if (error) throw error;
      return data as RoleTemplate[];
    }
  });

  const handleCreateTemplate = async () => {
    try {
      const { error } = await supabase
        .from('role_templates')
        .insert([newTemplate]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Role template created successfully",
      });

      setNewTemplate({ name: "", description: "", permissions: {} });
      refetch();
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create role template",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h3 className="font-semibold">Role Templates</h3>
        </div>
        <Button onClick={() => setNewTemplate({ name: "", description: "", permissions: {} })}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Input
              placeholder="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <Button onClick={handleCreateTemplate} disabled={!newTemplate.name}>
            Create Template
          </Button>
        </div>

        <div className="grid gap-4">
          {templates?.map((template) => (
            <Card key={template.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-4 h-4" />
                <h4 className="font-medium">{template.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}