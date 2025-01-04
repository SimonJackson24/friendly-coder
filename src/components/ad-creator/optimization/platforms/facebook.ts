import { PlatformRecommendation } from "../types";

export const facebookRecommendations: PlatformRecommendation = {
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
    }
  ]
};