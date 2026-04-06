import type { Platform, CampaignStatus } from './common';

// 날짜 범위 타입
export interface DateRange {
  from: Date;
  to: Date;
}

// 필터 상태 타입
export interface FilterState {
  dateRange: DateRange;
  status: CampaignStatus[];
  platform: Platform[];
}
