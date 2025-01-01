import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: "active" | "archived";
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectCard = ({ id, title, description, status, onEdit, onDelete }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleOpenProject = () => {
    console.log("Opening project:", id);
    navigate(`/assistant?projectId=${id}`);
  };

  return (
    <Card className="w-full bg-card hover:bg-card/90 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Badge variant="outline" className={status === "active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete} className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleOpenProject}>
          <ExternalLink className="h-4 w-4" />
          Open Project
        </Button>
      </CardFooter>
    </Card>
  );
};