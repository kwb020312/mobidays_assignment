import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 날짜 포맷 정규화 (YYYY/MM/DD -> YYYY-MM-DD, null 처리)
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
