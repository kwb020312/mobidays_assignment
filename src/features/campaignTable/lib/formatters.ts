// 숫자를 천 단위 구분 기호로 포맷
function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}

// 금액 포맷 (원) - 0이면 "-" 표시
export function formatCurrency(value: number): string {
  if (value === 0) return "-";
  return `${formatNumber(Math.round(value))}원`;
}

// 퍼센트 포맷
export function formatPercent(value: number | null, decimals = 2): string {
  if (value === null) return "-";
  return `${value.toFixed(decimals)}%`;
}

// CPC 포맷 (원)
export function formatCPC(value: number | null): string {
  if (value === null) return "-";
  return `${formatNumber(Math.round(value))}원`;
}
