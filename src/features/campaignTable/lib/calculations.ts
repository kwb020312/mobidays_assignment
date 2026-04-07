import type { DailyStat } from "@/entities/dailyStat";
import { normalizeNumber } from "@/shared/lib";

export interface AggregatedMetrics {
  totalCost: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversionsValue: number;
}

// DailyStat 배열에서 집계 메트릭 계산
export function aggregateMetrics(stats: DailyStat[]): AggregatedMetrics {
  let totalCost = 0;
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalConversionsValue = 0;

  for (const stat of stats) {
    totalCost += normalizeNumber(stat.cost);
    totalImpressions += normalizeNumber(stat.impressions);
    totalClicks += normalizeNumber(stat.clicks);
    totalConversionsValue += normalizeNumber(stat.conversionsValue);
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
