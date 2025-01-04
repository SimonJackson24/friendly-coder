import { PlatformRecommendation } from "./types";
import { facebookRecommendations } from "./platforms/facebook";
import { instagramRecommendations } from "./platforms/instagram";
import { twitterRecommendations } from "./platforms/twitter";
import { linkedinRecommendations } from "./platforms/linkedin";
import { googleRecommendations } from "./platforms/google";

export const platformRecommendations: PlatformRecommendation[] = [
  facebookRecommendations,
  instagramRecommendations,
  twitterRecommendations,
  linkedinRecommendations,
  googleRecommendations
];