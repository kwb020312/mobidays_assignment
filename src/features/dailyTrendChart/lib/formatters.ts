import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

// 차트 Y축용 축약 숫자 포맷 (1.2M, 3.5K)
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

// 차트 X축 날짜 포맷 (M/d)
export function formatXAxisDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "M/d", { locale: ko });
  } catch {
    return dateStr;
  }
}

// 툴팁 날짜 포맷 (yyyy년 M월 d일)
export function formatTooltipDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "yyyy년 M월 d일", { locale: ko });
  } catch {
    return dateStr;
  }
}
