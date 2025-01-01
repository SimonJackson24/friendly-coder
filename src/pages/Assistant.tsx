import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { FileExplorer } from "@/components/FileExplorer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  content?: string;
}

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  
  // Mock file structure for demonstration
  const mockFiles: FileNode[] = [
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "components",
          type: "folder",
          children: [
            { name: "ChatInterface.tsx", type: "file" },
            { name: "FileExplorer.tsx", type: "file" },
          ],
        },
        { name: "App.tsx", type: "file" },
        { name: "main.tsx", type: "file" },
      ],
    },
    {
      name: "public",
      type: "folder",
      children: [
        { name: "favicon.ico", type: "file" },
        { name: "index.html", type: "file" },
      ],
    },
  ];

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      console.log("Fetching project details:", projectId);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Project details loaded:", data);
      if (data.supabase_url) {
        setPreviewUrl(data.supabase_url);
      }
      return data;
    },
    enabled: !!projectId,
  });

  const handleFileSelect = (file: FileNode) => {
    console.log("Selected file:", file);
    setSelectedFile(file);
    // In a real implementation, we would fetch the file content here
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {project && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            {project.description && (
              <p className="text-muted-foreground mt-2">{project.description}</p>
            )}
          </div>
        )}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <FileExplorer files={mockFiles} onFileSelect={handleFileSelect} />
          </div>
          <div className="col-span-5">
            <ChatInterface projectId={projectId} />
          </div>
          <div className="col-span-4">
            <div className="bg-card rounded-lg border">
              <iframe
                title="Live Preview"
                className="w-full h-[600px] rounded-lg"
                src={previewUrl || "about:blank"}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;