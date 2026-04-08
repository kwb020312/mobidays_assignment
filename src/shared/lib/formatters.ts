import { format } from "date-fns";

// 숫자를 천 단위 구분 기호로 포맷
export function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}

// 날짜를 YYYY.MM.DD 형식으로 포맷
function formatDateString(date: string | Date | null): string {
  if (!date) return "미정";
  if (date instanceof Date) {
    return format(date, "yyyy.MM.dd");
  }
  return date.replace(/-/g, ".");
}

// 집행 기간 포맷 (string 또는 Date 입력 지원)
export function formatDateRange(
  startDate: string | Date | null,
  endDate: string | Date | null
): string {
  return `${formatDateString(startDate)} ~ ${formatDateString(endDate)}`;
}
