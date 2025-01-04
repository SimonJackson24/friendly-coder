import { PlatformRecommendation } from "./types";
import { facebookRecommendations } from "./platforms/facebook";
import { instagramRecommendations } from "./platforms/instagram";
import { linkedinRecommendations } from "./platforms/linkedin";
import { googleRecommendations } from "./platforms/google";

export const platformRecommendations: PlatformRecommendation[] = [
  facebookRecommendations,
  instagramRecommendations,
  linkedinRecommendations,
  googleRecommendations
];