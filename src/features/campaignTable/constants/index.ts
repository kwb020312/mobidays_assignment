import type { CampaignStatus } from "@/shared/types";

// 상태 배지 variant 매핑
export const STATUS_VARIANT: Record<CampaignStatus, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  ended: "outline",
};

// 예산/집행금액 한도
export const MAX_BUDGET = 1_000_000_000; // 10억 원
export const MIN_BUDGET = 100; // 100원
