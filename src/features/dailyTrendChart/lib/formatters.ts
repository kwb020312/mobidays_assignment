import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export function formatNumber(value: number): string {
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

export function formatXAxisDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "M/d", { locale: ko });
  } catch {
    return dateStr;
  }
}

export function formatTooltipDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "yyyy년 M월 d일", { locale: ko });
  } catch {
    return dateStr;
  }
}

export function formatDateRange(from: Date, to: Date): string {
  return `${format(from, "yyyy.MM.dd", { locale: ko })} - ${format(to, "yyyy.MM.dd", { locale: ko })}`;
}
