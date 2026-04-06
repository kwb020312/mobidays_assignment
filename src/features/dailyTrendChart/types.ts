export type DailyMetric = "impressions" | "clicks" | "conversions" | "cost";

export interface DailyMetricOption {
  key: DailyMetric;
  label: string;
  color: string;
}

export interface AggregatedDailyStat {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
}

export const METRIC_OPTIONS: DailyMetricOption[] = [
  { key: "impressions", label: "노출수", color: "hsl(var(--chart-1))" },
  { key: "clicks", label: "클릭수", color: "hsl(var(--chart-2))" },
  { key: "conversions", label: "전환수", color: "hsl(var(--chart-3))" },
  { key: "cost", label: "비용", color: "hsl(var(--chart-4))" },
];

export const DEFAULT_METRICS: DailyMetric[] = ["impressions", "clicks"];
