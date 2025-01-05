import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ProjectTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  route?: string;
  onClick?: () => void;
}

export function ProjectTypeCard({ 
  title, 
  description, 
  icon: Icon, 
  color,
  route,
  onClick 
}: ProjectTypeCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      navigate(route);
    }
  };

  return (
    <Card 
      className="p-6 hover:bg-accent cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <Icon className={`h-6 w-6 ${color}`} />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}