export interface PlatformConnection {
  id: string;
  platform: string;
  access_token: string | null;
  expires_at: string | null;
}