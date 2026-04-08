// 안전한 나눗셈 (0으로 나누기, Infinity 방지)
export function safeDivide(
  numerator: number,
  denominator: number
): number | null {
  if (denominator === 0) return null;
  const result = numerator / denominator;
  if (!Number.isFinite(result)) return null;
  return result;
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
