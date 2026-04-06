import type { Platform, CampaignStatus } from "@/shared/types";

export interface DateRange {
  from: Date;
  to: Date;
}

export interface FilterState {
  dateRange: DateRange;
  status: Set<CampaignStatus>;
  platform: Set<Platform>;
}
