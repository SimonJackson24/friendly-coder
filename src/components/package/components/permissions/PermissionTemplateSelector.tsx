import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, any>;
}

interface PermissionTemplateSelectorProps {
  onSelect: (template: PermissionTemplate) => void;
}

export function PermissionTemplateSelector({ onSelect }: PermissionTemplateSelectorProps) {
  const [templates, setTemplates] = useState<PermissionTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("permission_templates")
        .select("*");

      if (error) throw error;
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching permission templates:", error);
      toast({
        title: "Error",
        description: "Failed to load permission templates",
        variant: "destructive",
      });
    }
  };

  const handleSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedId(templateId);
      onSelect(template);
    }
  };

  return (
    <div className="space-y-4">
      <Select value={selectedId} onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select a permission template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedId && (
        <div className="text-sm text-muted-foreground">
          {templates.find(t => t.id === selectedId)?.description}
        </div>
      )}
    </div>
  );
}