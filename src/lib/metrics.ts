// 안전한 나눗셈 (0으로 나누기 방지)
export const safeDivide = (numerator: number, denominator: number): number | null => {
  if (denominator === 0) return null;
  return numerator / denominator;
};

// 숫자 정규화 (문자열, NaN, 음수 처리)
export const normalizeNumber = (value: unknown): number => {
  const num = Number(value);
  return isNaN(num) || num < 0 ? 0 : num;
};

// CTR (%) = (총 클릭 수 / 총 노출 수) × 100
export const calculateCTR = (clicks: number, impressions: number): number | null => {
  const result = safeDivide(clicks, impressions);
  return result !== null ? result * 100 : null;
};

// CPC (원) = 총 집행 비용 / 총 클릭 수
export const calculateCPC = (cost: number, clicks: number): number | null => {
  return safeDivide(cost, clicks);
};

// ROAS (%) = (총 전환 가치 / 총 집행 비용) × 100
export const calculateROAS = (conversionsValue: number, cost: number): number | null => {
  const result = safeDivide(conversionsValue, cost);
  return result !== null ? result * 100 : null;
};
