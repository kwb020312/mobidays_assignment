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

// 안전한 나눗셈 (0으로 나누기 방지)
function safeDivide(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return numerator / denominator;
}

// CTR (%) = (총 클릭 수 / 총 노출 수) × 100
export function calculateCTR(
  clicks: number,
  impressions: number
): number | null {
  const result = safeDivide(clicks, impressions);
  if (result === null) return null;
  return result * 100;
}

// CPC (원) = 총 집행 비용 / 총 클릭 수
export function calculateCPC(cost: number, clicks: number): number | null {
  return safeDivide(cost, clicks);
}

// ROAS (%) = (총 전환 가치 / 총 집행 비용) × 100
export function calculateROAS(
  conversionsValue: number,
  cost: number
): number | null {
  const result = safeDivide(conversionsValue, cost);
  if (result === null) return null;
  return result * 100;
}
