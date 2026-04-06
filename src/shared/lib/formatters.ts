// 날짜 정규화 (YYYY/MM/DD -> YYYY-MM-DD, null 처리)
export function normalizeDate(date: string | null | undefined): string | null {
  if (!date) return null;
  return date.replace(/\//g, "-");
}

// 숫자 정규화 (null, undefined, NaN 처리)
export function normalizeNumber(value: number | null | undefined): number {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 0;
  }
  return value;
}

// 숫자를 천 단위 구분 기호로 포맷
export function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}

// 금액 포맷 (원)
export function formatCurrency(value: number): string {
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

// 날짜 포맷 (YYYY-MM-DD -> YYYY.MM.DD)
export function formatDate(date: string | null): string {
  if (!date) return "-";
  return date.replace(/-/g, ".");
}

// 집행 기간 포맷
export function formatDateRange(
  startDate: string,
  endDate: string | null
): string {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : "진행중";
  return `${start} ~ ${end}`;
}
