import type { DailyStat } from "@/entities/dailyStat";

export interface AggregatedMetrics {
  totalCost: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversionsValue: number;
}

// DailyStat 배열에서 집계 메트릭 계산 (API 레이어에서 정규화 완료됨)
export function aggregateMetrics(stats: DailyStat[]): AggregatedMetrics {
  let totalCost = 0;
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalConversionsValue = 0;

  for (const stat of stats) {
    totalCost += stat.cost;
    totalImpressions += stat.impressions;
    totalClicks += stat.clicks;
    totalConversionsValue += stat.conversionsValue ?? 0;
  }

  return {
    totalCost,
    totalImpressions,
    totalClicks,
    totalConversionsValue,
  };
}

// 공유 라이브러리에서 re-export
export { calculateCTR, calculateCPC, calculateROAS } from "@/shared/lib";
