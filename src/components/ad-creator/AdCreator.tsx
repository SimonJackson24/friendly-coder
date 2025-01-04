import { useState } from "react";
import { AdCreatorForm, AdFormData } from "./AdCreatorForm";
import { AdPreview } from "./AdPreview";
import { AdOptimizationPanel } from "./AdOptimizationPanel";
import { AIRecommendations } from "./AIRecommendations";
import { generateAdContent } from "@/utils/ad-generator";

export function AdCreator() {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");
  const [adType, setAdType] = useState("image");

  const handleSubmit = async (data: AdFormData) => {
    setIsLoading(true);
    try {
      const content = await generateAdContent(data);
      setGeneratedContent(content);
      setSelectedPlatform(data.platform);
      setAdType(data.adType || "image");
    } catch (error) {
      console.error("Error generating ad content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">AI Ad Creator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AdCreatorForm onSubmit={handleSubmit} isLoading={isLoading} />
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