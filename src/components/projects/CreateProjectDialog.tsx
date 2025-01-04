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
  Code2,
  Laptop,
  Workflow
} from "lucide-react";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

type ProjectType = 'responsive-website' | 'android' | 'web-to-android' | 'fullstack' | 'pwa';

export const CreateProjectDialog = ({ isOpen, onOpenChange, userId }: CreateProjectDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newProject, setNewProject] = useState({ 
    title: "", 
    description: "",
    type: "responsive-website" as ProjectType 
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
      setNewProject({ title: "", description: "", type: "responsive-website" });
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
      <DialogContent className="sm:max-w-[600px]">
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
                <RadioGroupItem value="responsive-website" id="responsive-website" />
                <Label htmlFor="responsive-website" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">Responsive Website</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create a modern, responsive website that works on all devices
                  </p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="pwa" id="pwa" />
                <Label htmlFor="pwa" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4" />
                    <span className="font-medium">Progressive Web App</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Build a PWA that can be installed on any device
                  </p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="android" id="android" />
                <Label htmlFor="android" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-medium">Native Android App</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Develop a native Android application from scratch
                  </p>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="web-to-android" id="web-to-android" />
                <Label htmlFor="web-to-android" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-4 w-4" />
                    <span className="font-medium">Web to Android</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Convert your web app into a native Android application
                  </p>
                </Label>
              </div>
              
              <div className="col-span-2 flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="fullstack" id="fullstack" />
                <Label htmlFor="fullstack" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Workflow className="h-4 w-4" />
                    <span className="font-medium">Full Stack Application</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Build a complete application with frontend, backend, and database
                  </p>
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