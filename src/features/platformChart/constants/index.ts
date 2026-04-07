import type { Platform } from "@/shared/types";
import type { ChartConfig } from "@/shared/ui";
import type { PlatformMetric, PlatformMetricOption } from "../types";

export const PLATFORM_METRIC_OPTIONS: PlatformMetricOption[] = [
  { key: "cost", label: "비용" },
  { key: "impressions", label: "노출수" },
  { key: "clicks", label: "클릭수" },
  { key: "conversions", label: "전환수" },
];

export const DEFAULT_PLATFORM_METRIC: PlatformMetric = "cost";

export const PLATFORM_COLORS: Record<Platform, string> = {
  Google: "var(--chart-1)",
  Meta: "var(--chart-2)",
  Naver: "var(--chart-3)",
};

export const PLATFORM_CHART_CONFIG: ChartConfig = {
  Google: {
    label: "Google",
    color: PLATFORM_COLORS.Google,
  },
  Meta: {
    label: "Meta",
    color: PLATFORM_COLORS.Meta,
  },
  Naver: {
    label: "Naver",
    color: PLATFORM_COLORS.Naver,
  },
};
