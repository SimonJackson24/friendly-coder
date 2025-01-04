import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { LucideIcon } from "lucide-react";

interface ProjectTypeOptionProps {
  value: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ProjectTypeOption({ value, icon: Icon, title, description }: ProjectTypeOptionProps) {
  return (
    <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
      <RadioGroupItem value={value} id={value} />
      <Label htmlFor={value} className="flex-1 cursor-pointer">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="font-medium">{title}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {description}
        </p>
      </Label>
    </div>
  );
}