import { PlatformRecommendation } from "./types";

export const platformRecommendations: PlatformRecommendation[] = [
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
          "Test multiple image variations",
          "Use carousel format for multiple products",
          "Optimize for mobile-first viewing"
        ],
        compliance: [
          "No text overlays covering more than 20% of image",
          "No misleading content or false claims",
          "No sensitive content or discriminatory imagery",
          "Must comply with Facebook's advertising policies",
          "No before/after images without disclaimer",
          "Clear disclosure for special offers"
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
          "Test different ad copy variations",
          "Use power words that drive action",
          "Include pricing information when relevant"
        ],
        keywords: [
          "Limited time offer",
          "Shop now",
          "Learn more",
          "Get started",
          "Free shipping",
          "Exclusive deal",
          "Save now",
          "Join today"
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
          "Test different audience segments",
          "Optimize for specific campaign objectives",
          "Use exclusion targeting to avoid audience overlap"
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
          "Create engaging Reels content",
          "Use high-quality video content",
          "Incorporate user-generated content"
        ],
        compliance: [
          "No excessive filters that misrepresent products",
          "Clear disclosure of sponsored content (#ad)",
          "No interactive elements that don't function",
          "Must comply with Instagram's community guidelines",
          "Proper disclosure of partnerships",
          "No misleading engagement tactics"
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
          "Post at optimal times for your audience",
          "Engage with comments and messages",
          "Cross-promote across other platforms"
        ],
        keywords: [
          "Swipe up",
          "Tap to shop",
          "Link in bio",
          "Limited edition",
          "New arrival",
          "Shop now",
          "Learn more",
          "Exclusive"
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
          "Time tweets for maximum engagement",
          "Engage with relevant conversations",
          "Use polls for engagement"
        ],
        compliance: [
          "Clear disclosure of promoted content",
          "No misleading claims or spam tactics",
          "Respect trademark and copyright laws",
          "Follow Twitter's ad policies",
          "Proper disclosure of partnerships",
          "No automated engagement tactics"
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
          "Use high-contrast visuals",
          "Optimize for mobile viewing",
          "Include captions for videos"
        ],
        keywords: [
          "Click here",
          "Learn more",
          "Limited time",
          "Sale ends soon",
          "Exclusive offer",
          "Join now",
          "Get started",
          "Save today"
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
          "Use case studies and testimonials",
          "Demonstrate thought leadership",
          "Include relevant certifications"
        ],
        compliance: [
          "No misleading professional claims",
          "Clear disclosure of sponsored content",
          "Respect professional boundaries",
          "Follow LinkedIn's professional community policies",
          "Proper disclosure of affiliations",
          "Accurate representation of qualifications"
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
          "Optimize for mobile devices",
          "Use high-quality headshots",
          "Include clear call-to-actions"
        ],
        keywords: [
          "Professional development",
          "Industry leading",
          "Expert insights",
          "Connect now",
          "Learn more",
          "Download now",
          "Register today",
          "Join network"
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
          "Use ad extensions effectively",
          "Create responsive search ads",
          "Test different ad formats"
        ],
        compliance: [
          "No trademark violations",
          "Clear display URL requirements",
          "No misleading claims or content",
          "Follow Google Ads policies",
          "Proper use of keywords",
          "Accurate landing page experience"
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
          "Optimize quality score",
          "Use negative keywords",
          "Monitor and adjust bids"
        ],
        keywords: [
          "Official site",
          "Buy now",
          "Free shipping",
          "Best prices",
          "Limited time offer",
          "Shop today",
          "Get quote",
          "Learn more"
        ]
      }
    ],
  },
  {
    platform: "tiktok",
    recommendations: [
      {
        category: "Content Strategy",
        tips: [
          "Create native-looking content",
          "Keep videos between 9-15 seconds",
          "Use trending sounds and music",
          "Show products in action",
          "Include engaging hooks",
          "Use popular effects and transitions",
          "Participate in trends",
          "Create shareable content"
        ],
        compliance: [
          "No copyrighted music without permission",
          "Clear disclosure of sponsored content",
          "Age-appropriate content",
          "Follow TikTok's advertising policies",
          "No misleading effects or filters",
          "Proper use of hashtags"
        ]
      },
      {
        category: "Technical Specs",
        tips: [
          "Video resolution: 1080x1920",
          "File size: under 500MB",
          "Support vertical video format",
          "Use high-quality audio",
          "Include captions",
          "Optimize for sound-on viewing",
          "Use TikTok's native features",
          "Test different video lengths"
        ],
        keywords: [
          "Link in bio",
          "Shop now",
          "Learn more",
          "Limited time",
          "Trending",
          "New drop",
          "Exclusive",
          "Must have"
        ]
      }
    ]
  }
];