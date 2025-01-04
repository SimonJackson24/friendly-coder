import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { BusinessInfoSection } from "./form/BusinessInfoSection";
import { AdSettingsSection } from "./form/AdSettingsSection";
import { CampaignGoalsSection } from "./form/CampaignGoalsSection";

interface AdCreatorFormProps {
  onSubmit: (data: AdFormData) => Promise<void>;
  isLoading: boolean;
  onPlatformChange: (platform: string) => void;
  initialPlatform: string;
}

export interface AdFormData {
  businessName: string;
  productDescription: string;
  targetAudience: string;
  platform: string;
  goals: string;
  tone: string;
  adType: string;
}

export function AdCreatorForm({ onSubmit, isLoading, onPlatformChange, initialPlatform }: AdCreatorFormProps) {
  const { toast } = useToast();
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [isLoadingPlatforms, setIsLoadingPlatforms] = useState(true);
  const [formData, setFormData] = useState<AdFormData>({
    businessName: "",
    productDescription: "",
    targetAudience: "",
    platform: initialPlatform,
    goals: "",
    tone: "professional",
    adType: "image",
  });

  useEffect(() => {
    async function fetchConnectedPlatforms() {
      try {
        const { data: connections, error } = await supabase
          .from('ad_platform_connections')
          .select('platform')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

        if (error) {
          console.error('Error fetching platforms:', error);
          throw error;
        }

        const platforms = connections?.map(c => c.platform) || [];
        setConnectedPlatforms(platforms);
        
        if (platforms.length > 0 && (!formData.platform || !platforms.includes(formData.platform))) {
          const newPlatform = platforms[0];
          setFormData(prev => ({ ...prev, platform: newPlatform }));
          onPlatformChange(newPlatform);
        }
      } catch (error) {
        console.error('Error fetching connected platforms:', error);
        let errorMessage = "Failed to load connected platforms.";
        
        if (error instanceof Error) {
          if (error.message.includes("auth")) {
            errorMessage = "Authentication error. Please sign in again.";
          } else if (error.message.includes("network")) {
            errorMessage = "Network error. Please check your connection.";
          }
        }
        
        toast({
          title: "Connection Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoadingPlatforms(false);
      }
    }

    fetchConnectedPlatforms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields with specific messages
    const requiredFields: Array<{ field: keyof AdFormData, label: string }> = [
      { field: 'businessName', label: 'Business Name' },
      { field: 'productDescription', label: 'Product Description' },
      { field: 'targetAudience', label: 'Target Audience' }
    ];

    const missingFields = requiredFields.filter(({ field }) => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    await onSubmit(formData);
  };

  if (isLoadingPlatforms) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </Card>
    );
  }

  if (connectedPlatforms.length === 0) {
    return (
      <Card className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please connect at least one advertising platform in the Platforms tab before creating ads.
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <BusinessInfoSection
          businessName={formData.businessName}
          productDescription={formData.productDescription}
          targetAudience={formData.targetAudience}
          onBusinessNameChange={(value) => setFormData({ ...formData, businessName: value })}
          onProductDescriptionChange={(value) => setFormData({ ...formData, productDescription: value })}
          onTargetAudienceChange={(value) => setFormData({ ...formData, targetAudience: value })}
        />

        <AdSettingsSection
          platform={formData.platform}
          adType={formData.adType}
          tone={formData.tone}
          connectedPlatforms={connectedPlatforms}
          onPlatformChange={(value) => {
            setFormData({ ...formData, platform: value });
            onPlatformChange(value);
          }}
          onAdTypeChange={(value) => setFormData({ ...formData, adType: value })}
          onToneChange={(value) => setFormData({ ...formData, tone: value })}
        />

        <CampaignGoalsSection
          goals={formData.goals}
          onGoalsChange={(value) => setFormData({ ...formData, goals: value })}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Ads...
            </>
          ) : (
            "Generate Ads"
          )}
        </Button>
      </form>
    </Card>
  );
}