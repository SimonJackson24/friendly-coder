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
  description: string | null;
  status: string;
  budget: number;
  spent: number;
  reach: number;
  start_date: string | null;
  end_date: string | null;
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
  budget_allocation: {
    daily: number;
    total: number;
    platforms: { [key: string]: number };
  };
  created_at: string;
  updated_at: string;
  user_id: string;
}