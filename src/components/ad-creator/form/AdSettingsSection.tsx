import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdSettingsProps {
  platform: string;
  adType: string;
  tone: string;
  connectedPlatforms: string[];
  onPlatformChange: (value: string) => void;
  onAdTypeChange: (value: string) => void;
  onToneChange: (value: string) => void;
}

export function AdSettingsSection({
  platform,
  adType,
  tone,
  connectedPlatforms,
  onPlatformChange,
  onAdTypeChange,
  onToneChange,
}: AdSettingsProps) {
  return (
    <>
      <div>
        <label className="text-sm font-medium mb-1 block">Platform</label>
        <Select value={platform} onValueChange={onPlatformChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {connectedPlatforms.map((p) => (
              <SelectItem key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Ad Type</label>
        <Select value={adType} onValueChange={onAdTypeChange}>
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
        <label className="text-sm font-medium mb-1 block">Tone</label>
        <Select value={tone} onValueChange={onToneChange}>
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
    </>
  );
}