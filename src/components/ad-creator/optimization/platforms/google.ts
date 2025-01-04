import { PlatformRecommendation } from "../types";

export const googleRecommendations: PlatformRecommendation = {
  platform: "google",
  recommendations: [
    {
      category: "Ad Format Guidelines",
      tips: [
        "Display ads: 300x250, 336x280, 728x90 pixels",
        "Responsive ads adapt automatically",
        "Keep file size under 150KB",
        "Use high-quality, clear images",
        "Include your logo for brand recognition",
        "Test multiple ad variations",
        "Use clear, legible text",
        "Maintain consistent branding"
      ],
      compliance: [
        "No misleading content or false claims",
        "Must follow Google Ads policies",
        "No adult or inappropriate content",
        "Clear disclosure of advertising nature",
        "Respect trademark and copyright laws",
        "No malicious code or redirects"
      ]
    },
    {
      category: "Search Ad Best Practices",
      tips: [
        "Include main keyword in headline",
        "Write compelling call-to-actions",
        "Use all available ad extensions",
        "Match landing page content to ad",
        "Include prices and promotions",
        "Use ad customizers for relevance",
        "Create mobile-optimized ads",
        "Test different ad variations"
      ],
      keywords: [
        "Limited time offer",
        "Exclusive deal",
        "Free shipping",
        "Buy now",
        "Get started",
        "Learn more",
        "Save today",
        "Best prices"
      ]
    }
  ]
};