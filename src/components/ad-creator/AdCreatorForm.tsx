import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

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

        if (error) throw error;

        const platforms = connections?.map(c => c.platform) || [];
        setConnectedPlatforms(platforms);
        
        // If no platform is selected or the selected platform isn't connected,
        // select the first connected platform or clear the selection
        if (platforms.length > 0 && (!formData.platform || !platforms.includes(formData.platform))) {
          const newPlatform = platforms[0];
          setFormData(prev => ({ ...prev, platform: newPlatform }));
          onPlatformChange(newPlatform);
        }
      } catch (error) {
        console.error('Error fetching connected platforms:', error);
        toast({
          title: "Error",
          description: "Failed to load connected platforms. Please try again.",
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
    if (!formData.businessName || !formData.productDescription || !formData.targetAudience) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    await onSubmit(formData);
  };

  const handlePlatformChange = (value: string) => {
    setFormData({ ...formData, platform: value });
    onPlatformChange(value);
    console.log("Platform changed to:", value);
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
        <div>
          <label className="text-sm font-medium mb-1 block">Business Name *</label>
          <Input
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="Enter your business name"
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Product Description *</label>
          <Textarea
            value={formData.productDescription}
            onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
            placeholder="Describe your product or service"
            className="w-full min-h-[100px]"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Target Audience *</label>
          <Textarea
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            placeholder="Describe your target audience"
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Platform</label>
          <Select
            value={formData.platform}
            onValueChange={handlePlatformChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {connectedPlatforms.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Ad Type</label>
          <Select
            value={formData.adType}
            onValueChange={(value) => setFormData({ ...formData, adType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ad type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image Ad</SelectItem>
              <SelectItem value="video">Video Ad</SelectItem>
              <SelectItem value="carousel">Carousel Ad</SelectItem>
              <SelectItem value="story">Story Ad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Campaign Goals</label>
          <Textarea
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
            placeholder="What are your campaign goals?"
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Tone</label>
          <Select
            value={formData.tone}
            onValueChange={(value) => setFormData({ ...formData, tone: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="humorous">Humorous</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
            </SelectContent>
          </Select>
        </div>

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