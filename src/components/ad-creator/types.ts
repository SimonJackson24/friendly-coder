export interface PlatformConnection {
  id: string;
  platform: string;
  access_token: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  budget: number;
  spent: number;
  reach: number;
  startDate: string;
  endDate: string;
  targeting: {
    locations: string[];
    ageRange: { min: number; max: number };
    interests: string[];
    demographics: string[];
  };
  schedule: {
    frequency: "daily" | "weekly" | "monthly";
    dayParting: string[];
    timeZone: string;
  };
  budgetAllocation: {
    daily: number;
    total: number;
    platforms: { [key: string]: number };
  };
}