import { PlatformRecommendation } from "../types";

export const instagramRecommendations: PlatformRecommendation = {
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
  ]
};