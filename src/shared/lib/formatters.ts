// 숫자를 천 단위 구분 기호로 포맷
export function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}

// 집행 기간 포맷
export function formatDateRange(
  startDate: string | null,
  endDate: string | null
): string {
  // 날짜 포맷 (YYYY-MM-DD -> YYYY.MM.DD)
  function formatDate(date: string | null): string {
    if (!date) return "-";
    return date.replace(/-/g, ".");
  }
  const start = startDate ? formatDate(startDate) : "미정";
  const end = endDate ? formatDate(endDate) : "미정";
  return `${start} ~ ${end}`;
}
