// 광고 매체 타입
export type Platform = "Google" | "Meta" | "Naver";

// 캠페인 상태 타입
export type CampaignStatus = "active" | "paused" | "ended";

// 상태 레이블 매핑
export const STATUS_LABELS: Record<CampaignStatus, string> = {
  active: "진행중",
  paused: "일시중지",
  ended: "종료",
};

// 매체 레이블 매핑
export const PLATFORM_LABELS: Record<Platform, string> = {
  Google: "Google",
  Meta: "Meta",
  Naver: "Naver",
};

// 모든 상태 목록
export const ALL_STATUSES: CampaignStatus[] = ["active", "paused", "ended"];

// 모든 매체 목록
export const ALL_PLATFORMS: Platform[] = ["Google", "Meta", "Naver"];

// 캠페인 엔티티 타입
export interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  status: CampaignStatus;
  budget: number;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
}

// 일별 통계 엔티티 타입
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

// 필터 관련 타입
export interface DateRange {
  from: Date;
  to: Date;
}

export interface FilterState {
  dateRange: DateRange;
  status: Set<CampaignStatus>;
  platform: Set<Platform>;
}
