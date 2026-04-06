import type { Platform, CampaignStatus } from './common';

// 캠페인 정보
export interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  status: CampaignStatus;
  budget: number;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
}

// 캠페인별 일간 성과 (Campaign과 1:N 관계)
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

// DB 전체 구조
export interface Database {
  campaigns: Campaign[];
  dailyStats: DailyStat[];
}
