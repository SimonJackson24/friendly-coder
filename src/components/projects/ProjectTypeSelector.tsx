import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectType } from "@/types/project";
import { Laptop, Smartphone, Globe, Code, ArrowRightLeft } from "lucide-react";

interface ProjectTypeOptionProps {
  type: ProjectType;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (type: ProjectType) => void;
}

const ProjectTypeOption = ({
  type,
  title,
  description,
  icon,
  isSelected,
  onSelect,
}: ProjectTypeOptionProps) => (
  <Card
    className={`p-4 cursor-pointer transition-all ${
      isSelected ? "border-primary" : "border-border hover:border-primary/50"
    }`}
    onClick={() => onSelect(type)}
  >
    <div className="flex items-start space-x-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </Card>
);

interface ProjectTypeSelectorProps {
  selectedType: ProjectType;
  onSelect: (type: ProjectType) => void;
}

export function ProjectTypeSelector({
  selectedType,
  onSelect,
}: ProjectTypeSelectorProps) {
  const projectTypes: Array<{
    type: ProjectType;
    title: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      type: "web",
      title: "Web Application",
      description: "Create a standard web application",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      type: "responsive-pwa",
      title: "Responsive PWA",
      description: "Build a progressive web app with responsive design",
      icon: <Laptop className="w-5 h-5" />,
    },
    {
      type: "android",
      title: "Android App",
      description: "Develop a native Android application",
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      type: "fullstack",
      title: "Full Stack",
      description: "Create a full stack application with backend",
      icon: <Code className="w-5 h-5" />,
    },
    {
      type: "web-to-android",
      title: "Web to Android",
      description: "Convert a web app to Android application",
      icon: <ArrowRightLeft className="w-5 h-5" />,
    },
  ];

  return (
    <div className="space-y-3">
      {projectTypes.map((projectType) => (
        <ProjectTypeOption
          key={projectType.type}
          {...projectType}
          isSelected={selectedType === projectType.type}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}