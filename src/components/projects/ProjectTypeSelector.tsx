import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Globe, Workflow, Smartphone, ArrowRightLeft } from "lucide-react";
import { ProjectTypeOption } from "./ProjectTypeOption";

interface ProjectTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ProjectTypeSelector({ value, onValueChange }: ProjectTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Project Type</Label>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="grid grid-cols-2 gap-4"
      >
        <ProjectTypeOption
          value="responsive-pwa"
          icon={Globe}
          title="Responsive Website with PWA"
          description="Create a modern, responsive website with Progressive Web App capabilities"
        />
        
        <ProjectTypeOption
          value="fullstack"
          icon={Workflow}
          title="Full Stack Web Application"
          description="Build a complete application with frontend, backend, and database"
        />
        
        <ProjectTypeOption
          value="android"
          icon={Smartphone}
          title="Android App"
          description="Develop a native Android application from scratch"
        />
        
        <ProjectTypeOption
          value="web-to-android"
          icon={ArrowRightLeft}
          title="Convert Web App to Android"
          description="Convert your web application into a native Android app"
        />
      </RadioGroup>
    </div>
  );
}