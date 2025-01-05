import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProjectTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  route: string;
}

export function ProjectTypeCard({ title, description, icon: Icon, color, route }: ProjectTypeCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate(route)}>
      <div className="flex items-start space-x-4">
        <div className={`${color} p-3 rounded-lg bg-background group-hover:bg-secondary`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
          <Button variant="link" className="p-0">
            Get Started →
          </Button>
        </div>
      </div>
    </Card>
  );
}