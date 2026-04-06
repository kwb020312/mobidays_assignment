export interface DailyStat {
  id: string;
  campaignId: string;
  date: string; // YYYY-MM-DD
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  conversionsValue: number | null;
}
