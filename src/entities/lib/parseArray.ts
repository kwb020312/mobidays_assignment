import type { z } from "zod";

// Zod 스키마용 범용 배열 파싱 (유효하지 않은 아이템 필터링)
export function parseArray<T>(
  schema: z.ZodType<T | null>,
  data: unknown[]
): T[] {
  const results: T[] = [];
  for (const item of data) {
    const result = schema.safeParse(item);
    if (result.success && result.data !== null) {
      results.push(result.data);
    }
  }
  return results;
}
