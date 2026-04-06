export type DailyMetric = "impressions" | "clicks";

export interface DailyMetricOption {
  key: DailyMetric;
  label: string;
  color: string;
}

export interface AggregatedDailyStat {
  date: string;
  impressions: number;
  clicks: number;
}

export const METRIC_OPTIONS: DailyMetricOption[] = [
  { key: "impressions", label: "노출수", color: "var(--chart-1)" },
  { key: "clicks", label: "클릭수", color: "var(--chart-2)" },
];

export const DEFAULT_METRICS: DailyMetric[] = ["impressions", "clicks"];
