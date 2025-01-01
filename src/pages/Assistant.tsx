import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatInterface } from "@/components/ChatInterface";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Assistant = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string>("");

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
      // Set the preview URL if available
      if (data.supabase_url) {
        setPreviewUrl(data.supabase_url);
      }
      return data;
    },
    enabled: !!projectId,
  });

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
        <div className="flex gap-4">
          <div className="w-1/2">
            <ChatInterface projectId={projectId} />
          </div>
          <div className="w-1/2 bg-card rounded-lg border">
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
  );
};

export default Assistant;