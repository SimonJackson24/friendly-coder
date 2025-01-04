import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Smartphone, 
  Globe, 
  ArrowRightLeft, 
  Code2 
} from "lucide-react";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

type ProjectType = 'web' | 'android' | 'web-to-android' | 'fullstack';

export const CreateProjectDialog = ({ isOpen, onOpenChange, userId }: CreateProjectDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newProject, setNewProject] = useState({ 
    title: "", 
    description: "",
    type: "web" as ProjectType 
  });

  const createProject = useMutation({
    mutationFn: async (projectData: typeof newProject) => {
      console.log("Creating project:", projectData);
      const { data, error } = await supabase.from("projects").insert([
        {
          title: projectData.title,
          description: projectData.description,
          status: "active",
          user_id: userId,
          project_type: projectData.type,
        },
      ]);

      if (error) {
        console.error("Error creating project:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onOpenChange(false);
      setNewProject({ title: "", description: "", type: "web" });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error) => {
      console.error("Project creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitProject = () => {
    if (!newProject.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Project title is required",
        variant: "destructive",
      });
      return;
    }
    createProject.mutate(newProject);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter project title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Enter project description"
            />
          </div>

          <div className="space-y-2">
            <Label>Project Type</Label>
            <RadioGroup
              value={newProject.type}
              onValueChange={(value: ProjectType) =>
                setNewProject((prev) => ({ ...prev, type: value }))
              }
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="web" id="web" />
                <Label htmlFor="web" className="flex items-center gap-2 cursor-pointer">
                  <Globe className="h-4 w-4" />
                  Web App
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="android" id="android" />
                <Label htmlFor="android" className="flex items-center gap-2 cursor-pointer">
                  <Smartphone className="h-4 w-4" />
                  Android App
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="web-to-android" id="web-to-android" />
                <Label htmlFor="web-to-android" className="flex items-center gap-2 cursor-pointer">
                  <ArrowRightLeft className="h-4 w-4" />
                  Web to Android
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="fullstack" id="fullstack" />
                <Label htmlFor="fullstack" className="flex items-center gap-2 cursor-pointer">
                  <Code2 className="h-4 w-4" />
                  Full Stack
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmitProject}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};