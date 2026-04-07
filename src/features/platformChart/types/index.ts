import type { Platform } from "@/shared/types";

export type PlatformMetric = "cost" | "impressions" | "clicks" | "conversions";

export interface PlatformMetricOption {
  key: PlatformMetric;
  label: string;
}

export interface PlatformStat {
  platform: Platform;
  value: number;
  percentage: number;
  fill: string;
}
