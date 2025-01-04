import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BusinessInfoProps {
  businessName: string;
  productDescription: string;
  targetAudience: string;
  onBusinessNameChange: (value: string) => void;
  onProductDescriptionChange: (value: string) => void;
  onTargetAudienceChange: (value: string) => void;
}

export function BusinessInfoSection({
  businessName,
  productDescription,
  targetAudience,
  onBusinessNameChange,
  onProductDescriptionChange,
  onTargetAudienceChange,
}: BusinessInfoProps) {
  return (
    <>
      <div>
        <label className="text-sm font-medium mb-1 block">Business Name *</label>
        <Input
          value={businessName}
          onChange={(e) => onBusinessNameChange(e.target.value)}
          placeholder="Enter your business name"
          className="w-full"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Product Description *</label>
        <Textarea
          value={productDescription}
          onChange={(e) => onProductDescriptionChange(e.target.value)}
          placeholder="Describe your product or service"
          className="w-full min-h-[100px]"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Target Audience *</label>
        <Textarea
          value={targetAudience}
          onChange={(e) => onTargetAudienceChange(e.target.value)}
          placeholder="Describe your target audience"
          className="w-full"
        />
      </div>
    </>
  );
}