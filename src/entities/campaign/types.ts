import type { Platform, CampaignStatus } from "@/shared/types";

export interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  status: CampaignStatus;
  budget: number;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD
}
