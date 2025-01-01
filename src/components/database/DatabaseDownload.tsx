import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Download, Loader2 } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { supabase } from "@/integrations/supabase/client";

export function DatabaseDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedProject } = useProject();
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!selectedProject) {
      toast({
        title: "No project selected",
        description: "Please select a project to download its database.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Fetch all tables data for the selected project
      const [filesRes, versionsRes] = await Promise.all([
        supabase
          .from("files")
          .select("*")
          .eq("project_id", selectedProject.id),
        supabase
          .from("version_history")
          .select("*")
          .eq("project_id", selectedProject.id),
      ]);

      if (filesRes.error) throw filesRes.error;
      if (versionsRes.error) throw versionsRes.error;

      // Prepare the data
      const data = {
        project_id: selectedProject.id,
        project_title: selectedProject.title,
        exported_at: new Date().toISOString(),
        files: filesRes.data,
        version_history: versionsRes.data,
      };

      // Create and download the file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedProject.title.toLowerCase().replace(/\s+/g, "-")}-db-export.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Database exported successfully",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isLoading || !selectedProject}
      variant="outline"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      Export Database
    </Button>
  );
}