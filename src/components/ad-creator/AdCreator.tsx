import { useState } from "react";
import { AdCreatorForm, AdFormData } from "./AdCreatorForm";
import { AdPreview } from "./AdPreview";
import { AdOptimizationPanel } from "./AdOptimizationPanel";
import { AIRecommendations } from "./AIRecommendations";
import { generateAdContent } from "@/utils/ad-generator";
import { ProjectSelector } from "@/components/projects/ProjectSelector";
import { useProject } from "@/contexts/ProjectContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export function AdCreator() {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");
  const [adType, setAdType] = useState("image");
  const { selectedProject } = useProject();
  const { toast } = useToast();

  const handleSubmit = async (data: AdFormData) => {
    if (!selectedProject) {
      toast({
        title: "Project Required",
        description: "Please select a project to generate an AI-optimized ad.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const content = await generateAdContent({
        ...data,
        projectId: selectedProject.id,
      });
      setGeneratedContent(content);
      setSelectedPlatform(data.platform);
      setAdType(data.adType || "image");
      
      toast({
        title: "Ad Generated Successfully",
        description: "Your AI-optimized ad content has been created.",
      });
    } catch (error) {
      console.error("Error generating ad content:", error);
      
      // More specific error messages based on error type
      let errorMessage = "Failed to generate ad content. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("platform")) {
          errorMessage = "Platform connection error. Please check your platform settings.";
        } else if (error.message.includes("token") || error.message.includes("auth")) {
          errorMessage = "Authentication error. Please reconnect your platform.";
        } else if (error.message.includes("rate")) {
          errorMessage = "Rate limit exceeded. Please try again in a few minutes.";
        }
      }
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add console log to track platform changes
  console.log("Current selected platform:", selectedPlatform);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Create New Ad</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Select Project</h2>
        <div className="max-w-md">
          <ProjectSelector />
        </div>
        {!selectedProject && (
          <Alert className="mt-2">
            <AlertDescription>
              Select a project to enable AI-powered ad generation based on your project's content and goals.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AdCreatorForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            onPlatformChange={(platform) => setSelectedPlatform(platform)}
            initialPlatform={selectedPlatform}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <AdPreview content={generatedContent} platform={selectedPlatform} />
          <AIRecommendations 
            platform={selectedPlatform} 
            adType={adType}
            currentPerformance={{
              impressions: 1000,
              clicks: 50,
              conversions: 5
            }}
          />
          <AdOptimizationPanel platform={selectedPlatform} />
        </div>
      </div>
    </div>
  );
}