import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Tag } from "lucide-react";
import { ChangeCategory } from "../../types";

interface ChangeCategorizationFormProps {
  onCategorize: (changes: ChangeCategory[]) => void;
}

export function ChangeCategorizationForm({ onCategorize }: ChangeCategorizationFormProps) {
  const [changes, setChanges] = useState<ChangeCategory[]>([]);
  const [currentChange, setCurrentChange] = useState({
    name: "",
    description: "",
    severity: "low" as const,
    requires_approval: false
  });

  const handleAddChange = () => {
    if (!currentChange.name) return;
    
    const newChange: ChangeCategory = {
      id: crypto.randomUUID(),
      ...currentChange
    };
    
    setChanges([...changes, newChange]);
    setCurrentChange({
      name: "",
      description: "",
      severity: "low",
      requires_approval: false
    });
  };

  const handleSubmit = () => {
    onCategorize(changes);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4" />
        <h3 className="font-semibold">Categorize Changes</h3>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Change name"
            value={currentChange.name}
            onChange={(e) => setCurrentChange({ ...currentChange, name: e.target.value })}
          />
          <Select
            value={currentChange.severity}
            onValueChange={(value) => setCurrentChange({ ...currentChange, severity: value as "low" | "medium" | "high" })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddChange}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {changes.map((change) => (
            <div key={change.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <span>{change.name}</span>
                <Badge variant={
                  change.severity === "high" ? "destructive" :
                  change.severity === "medium" ? "warning" :
                  "default"
                }>
                  {change.severity}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {changes.length > 0 && (
          <Button onClick={handleSubmit} className="w-full">
            Save Categories
          </Button>
        )}
      </div>
    </Card>
  );
}