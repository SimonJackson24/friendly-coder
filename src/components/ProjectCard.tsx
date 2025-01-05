/**
 * Copyright (c) 2024 AI Studio. All rights reserved.
 * 
 * This file is part of the proprietary software developed by the copyright holder.
 * 
 * This software uses the following open source packages under their respective licenses:
 * - shadcn/ui components: MIT License (https://github.com/shadcn/ui/blob/main/LICENSE.md)
 * - Lucide Icons: MIT License (https://github.com/lucide-icons/lucide/blob/main/LICENSE)
 * - React Router: MIT License (https://github.com/remix-run/react-router/blob/main/LICENSE.md)
 * 
 * While these dependencies are open source, this file and its contents remain proprietary
 * and may not be copied, modified, or distributed without explicit permission.
 */

import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: "active" | "archived";
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectCard = ({ id, title, description, status, onEdit, onDelete }: ProjectCardProps) => {
  return (
    <Card className="p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className={`text-sm ${status === "active" ? "text-green-500" : "text-red-500"}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="ghost" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
