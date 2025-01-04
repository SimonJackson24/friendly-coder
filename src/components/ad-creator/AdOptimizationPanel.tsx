import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface PlatformRecommendation {
  platform: string;
  recommendations: {
    category: string;
    tips: string[];
  }[];
}

const platformRecommendations: PlatformRecommendation[] = [
  {
    platform: "facebook",
    recommendations: [
      {
        category: "Image Optimization",
        tips: [
          "Use images with less than 20% text",
          "Recommended size: 1200x628 pixels",
          "Use high-contrast, eye-catching visuals",
        ],
      },
      {
        category: "Copy Guidelines",
        tips: [
          "Keep primary text under 125 characters",
          "Include a clear call-to-action",
          "Use social proof when possible",
        ],
      },
    ],
  },
  {
    platform: "instagram",
    recommendations: [
      {
        category: "Visual Content",
        tips: [
          "Square images: 1080x1080 pixels",
          "Stories: 1080x1920 pixels",
          "Use authentic, lifestyle-focused imagery",
        ],
      },
      {
        category: "Engagement",
        tips: [
          "Include relevant hashtags (max 30)",
          "Use emoji to increase engagement",
          "Tag relevant accounts when appropriate",
        ],
      },
    ],
  },
  {
    platform: "twitter",
    recommendations: [
      {
        category: "Tweet Content",
        tips: [
          "Keep tweets concise and punchy",
          "Use relevant hashtags (1-2 max)",
          "Include engaging media when possible",
        ],
      },
      {
        category: "Image Specs",
        tips: [
          "Single image: 1200x675 pixels",
          "Max file size: 5MB for images",
          "Support for GIFs and short videos",
        ],
      },
    ],
  },
  {
    platform: "linkedin",
    recommendations: [
      {
        category: "Professional Content",
        tips: [
          "Focus on business value proposition",
          "Use professional, clean imagery",
          "Include industry-specific keywords",
        ],
      },
      {
        category: "Format Guidelines",
        tips: [
          "Company page image: 1200x627 pixels",
          "Keep text professional and formal",
          "Include relevant statistics and data",
        ],
      },
    ],
  },
  {
    platform: "google",
    recommendations: [
      {
        category: "Ad Format",
        tips: [
          "Responsive display ads: multiple image sizes",
          "Include all headline variations",
          "Test different call-to-actions",
        ],
      },
      {
        category: "Best Practices",
        tips: [
          "Use keyword-rich headlines",
          "Include price points and promotions",
          "Maintain consistent landing page experience",
        ],
      },
    ],
  },
];

interface AdOptimizationPanelProps {
  platform: string;
}

export function AdOptimizationPanel({ platform }: AdOptimizationPanelProps) {
  const recommendations = platformRecommendations.find(
    (p) => p.platform === platform
  );

  if (!recommendations) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold capitalize">
          {platform} Optimization Tips
        </h3>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-6">
          {recommendations.recommendations.map((rec, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                {rec.category}
                <Badge variant="secondary">{rec.tips.length} tips</Badge>
              </h4>
              <ul className="space-y-2">
                {rec.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="text-sm text-muted-foreground">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}