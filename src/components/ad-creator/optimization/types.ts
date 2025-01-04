export interface PlatformRecommendation {
  platform: string;
  recommendations: {
    category: string;
    tips: string[];
    compliance?: string[];
    keywords?: string[];
  }[];
}

export interface OptimizationTipProps {
  category: string;
  tips: string[];
  compliance?: string[];
  keywords?: string[];
}

export interface PlatformTipsProps {
  recommendations: {
    category: string;
    tips: string[];
    compliance?: string[];
    keywords?: string[];
  }[];
}