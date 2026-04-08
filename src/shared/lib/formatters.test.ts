import { describe, it, expect } from "vitest";
import { formatNumber, formatDateRange } from "./formatters";

describe("formatNumber", () => {
  it("천 단위 구분 기호를 추가한다", () => {
    expect(formatNumber(1000)).toBe("1,000");
    expect(formatNumber(1000000)).toBe("1,000,000");
    expect(formatNumber(1234567890)).toBe("1,234,567,890");
  });

  it("소수점을 유지한다", () => {
    expect(formatNumber(1234.56)).toBe("1,234.56");
    expect(formatNumber(1000.5)).toBe("1,000.5");
  });

  it("0을 처리한다", () => {
    expect(formatNumber(0)).toBe("0");
  });

  it("음수를 처리한다", () => {
    expect(formatNumber(-1000)).toBe("-1,000");
    expect(formatNumber(-1234567)).toBe("-1,234,567");
  });

  it("1000 미만의 숫자는 구분 기호 없이 반환한다", () => {
    expect(formatNumber(999)).toBe("999");
    expect(formatNumber(123)).toBe("123");
  });

  it("매우 작은 소수를 처리한다", () => {
    expect(formatNumber(0.001)).toBe("0.001");
  });
});

describe("formatDateRange", () => {
  it("날짜 범위를 포맷한다 (YYYY-MM-DD → YYYY.MM.DD)", () => {
    expect(formatDateRange("2026-03-01", "2026-03-31")).toBe(
      "2026.03.01 ~ 2026.03.31"
    );
  });

  it("같은 날짜 범위를 처리한다", () => {
    expect(formatDateRange("2026-06-15", "2026-06-15")).toBe(
      "2026.06.15 ~ 2026.06.15"
    );
  });

  it("시작일이 null이면 '미정'으로 표시한다", () => {
    expect(formatDateRange(null, "2026-03-31")).toBe("미정 ~ 2026.03.31");
  });

  it("종료일이 null이면 '미정'으로 표시한다", () => {
    expect(formatDateRange("2026-03-01", null)).toBe("2026.03.01 ~ 미정");
  });

  it("둘 다 null이면 '미정 ~ 미정'을 반환한다", () => {
    expect(formatDateRange(null, null)).toBe("미정 ~ 미정");
  });

  it("빈 문자열은 falsy이므로 '미정'으로 표시한다", () => {
    // JavaScript에서 빈 문자열("")은 falsy 값
    expect(formatDateRange("", "")).toBe("미정 ~ 미정");
  });

  it("연도가 다른 범위를 처리한다", () => {
    expect(formatDateRange("2025-12-15", "2026-01-15")).toBe(
      "2025.12.15 ~ 2026.01.15"
    );
  });
});
