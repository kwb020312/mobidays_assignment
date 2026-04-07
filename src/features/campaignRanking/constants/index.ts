import type { ChartConfig } from "@/shared/ui";
import type { RankingMetric, RankingMetricOption } from "../types";

// 메트릭 옵션 목록 (기본값: ROAS)
export const RANKING_METRIC_OPTIONS: RankingMetricOption[] = [
  { key: "roas", label: "ROAS", unit: "%", sortOrder: "desc" },
  { key: "ctr", label: "CTR", unit: "%", sortOrder: "desc" },
  { key: "cpc", label: "CPC", unit: "원", sortOrder: "asc" },
];

// 기본 메트릭
export const DEFAULT_RANKING_METRIC: RankingMetric = "roas";

// 랭킹 바 차트 색상 (1등, 2등, 3등)
export const RANKING_COLORS = [
  "var(--chart-1)", // 1등
  "var(--chart-2)", // 2등
  "var(--chart-3)", // 3등
];

// 차트 설정
export const RANKING_CHART_CONFIG: ChartConfig = {
  value: {
    label: "값",
    color: "var(--chart-1)",
  },
};

// 순위별 스타일 (1등: 금, 2등: 은, 3등: 동)
export const RANK_STYLES = [
  {
    badge: "bg-amber-500 text-white",
    bar: "bg-amber-500",
    ring: "ring-amber-500/20",
  },
  {
    badge: "bg-zinc-400 text-white",
    bar: "bg-zinc-400",
    ring: "ring-zinc-400/20",
  },
  {
    badge: "bg-amber-700 text-white",
    bar: "bg-amber-700",
    ring: "ring-amber-700/20",
  },
];
