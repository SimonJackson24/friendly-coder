import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Info, AlertTriangle } from "lucide-react";

interface PlatformRecommendation {
  platform: string;
  recommendations: {
    category: string;
    tips: string[];
    compliance?: string[];
    keywords?: string[];
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
          "Ensure images are clear and high-quality (min 1080p)",
          "Include lifestyle or product-in-use images",
        ],
        compliance: [
          "No text overlays covering more than 20% of image",
          "No misleading content or false claims",
          "No sensitive content or discriminatory imagery",
          "Must comply with Facebook's advertising policies",
        ]
      },
      {
        category: "Copy Guidelines",
        tips: [
          "Keep primary text under 125 characters",
          "Include a clear call-to-action",
          "Use social proof when possible",
          "Address pain points directly",
          "Highlight unique value proposition",
        ],
        keywords: [
          "Limited time offer",
          "Shop now",
          "Learn more",
          "Get started",
          "Free shipping",
        ]
      },
      {
        category: "Targeting Optimization",
        tips: [
          "Use Detailed Targeting Expansion for broader reach",
          "Target lookalike audiences based on existing customers",
          "Implement custom audiences for retargeting",
          "Consider geographic and demographic factors",
          "Use interest-based targeting strategically",
        ]
      }
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
          "Maintain consistent brand aesthetics",
          "Use carousel posts for product showcases",
        ],
        compliance: [
          "No excessive filters that misrepresent products",
          "Clear disclosure of sponsored content (#ad)",
          "No interactive elements that don't function",
          "Must comply with Instagram's community guidelines",
        ]
      },
      {
        category: "Engagement",
        tips: [
          "Include relevant hashtags (max 30)",
          "Use emoji to increase engagement",
          "Tag relevant accounts when appropriate",
          "Create interactive Stories with polls/questions",
          "Use Reels for higher organic reach",
        ],
        keywords: [
          "Swipe up",
          "Tap to shop",
          "Link in bio",
          "Limited edition",
          "New arrival",
        ]
      }
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
          "Create thread-style campaigns",
          "Use Twitter Cards for rich media",
        ],
        compliance: [
          "Clear disclosure of promoted content",
          "No misleading claims or spam tactics",
          "Respect trademark and copyright laws",
          "Follow Twitter's ad policies",
        ]
      },
      {
        category: "Media Specs",
        tips: [
          "Single image: 1200x675 pixels",
          "Max file size: 5MB for images",
          "Support for GIFs and short videos",
          "Carousel ads: 2-6 images",
          "Video length: 15 seconds optimal",
        ],
        keywords: [
          "Click here",
          "Learn more",
          "Limited time",
          "Sale ends soon",
          "Exclusive offer",
        ]
      }
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
          "Highlight expertise and credentials",
          "Share industry insights and statistics",
        ],
        compliance: [
          "No misleading professional claims",
          "Clear disclosure of sponsored content",
          "Respect professional boundaries",
          "Follow LinkedIn's professional community policies",
        ]
      },
      {
        category: "Format Guidelines",
        tips: [
          "Company page image: 1200x627 pixels",
          "Keep text professional and formal",
          "Include relevant statistics and data",
          "Use bullet points for readability",
          "Include company branding elements",
        ],
        keywords: [
          "Professional development",
          "Industry leading",
          "Expert insights",
          "Connect now",
          "Learn more",
        ]
      }
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
          "Use high-quality product images",
          "Implement dynamic keyword insertion",
        ],
        compliance: [
          "No trademark violations",
          "Clear display URL requirements",
          "No misleading claims or content",
          "Follow Google Ads policies",
        ]
      },
      {
        category: "Best Practices",
        tips: [
          "Use keyword-rich headlines",
          "Include price points and promotions",
          "Maintain consistent landing page experience",
          "Implement site link extensions",
          "Use location extensions when relevant",
        ],
        keywords: [
          "Official site",
          "Buy now",
          "Free shipping",
          "Best prices",
          "Limited time offer",
        ]
      }
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
      <ScrollArea className="h-[400px]">
        <div className="space-y-6">
          {recommendations.recommendations.map((rec, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                {rec.category}
                <Badge variant="secondary">
                  {rec.tips.length} tips
                </Badge>
              </h4>
              
              {/* Best Practices */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-muted-foreground">Best Practices:</h5>
                <ul className="space-y-2">
                  {rec.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Compliance Guidelines */}
              {rec.compliance && (
                <div className="space-y-2 mt-4">
                  <h5 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Compliance Requirements:
                  </h5>
                  <ul className="space-y-2">
                    {rec.compliance.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Keywords */}
              {rec.keywords && (
                <div className="space-y-2 mt-4">
                  <h5 className="text-sm font-medium text-muted-foreground">Recommended Keywords:</h5>
                  <div className="flex flex-wrap gap-2">
                    {rec.keywords.map((keyword, keywordIndex) => (
                      <Badge key={keywordIndex} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}