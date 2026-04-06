import type { CampaignStatus } from "@/shared/types";

// 상태 배지 variant 매핑
export const STATUS_VARIANT: Record<CampaignStatus, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  ended: "outline",
};
