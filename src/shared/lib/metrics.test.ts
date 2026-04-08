import { describe, it, expect } from "vitest";
import {
  safeDivide,
  calculateCTR,
  calculateCPC,
  calculateROAS,
} from "./metrics";

describe("safeDivide", () => {
  it("정상적인 나눗셈을 수행한다", () => {
    expect(safeDivide(10, 2)).toBe(5);
    expect(safeDivide(100, 4)).toBe(25);
  });

  it("소수점 결과를 반환한다", () => {
    expect(safeDivide(1, 3)).toBeCloseTo(0.333, 2);
    expect(safeDivide(10, 3)).toBeCloseTo(3.333, 2);
  });

  it("분모가 0이면 null을 반환한다", () => {
    expect(safeDivide(10, 0)).toBeNull();
    expect(safeDivide(0, 0)).toBeNull();
  });

  it("분자가 0이면 0을 반환한다", () => {
    expect(safeDivide(0, 10)).toBe(0);
  });

  it("음수를 처리한다", () => {
    expect(safeDivide(-10, 2)).toBe(-5);
    expect(safeDivide(10, -2)).toBe(-5);
    expect(safeDivide(-10, -2)).toBe(5);
  });

  it("Infinity 입력은 null을 반환한다", () => {
    expect(safeDivide(Infinity, 2)).toBeNull();
    expect(safeDivide(2, Infinity)).toBe(0); // 2/Infinity = 0 (유한수)
  });

  it("NaN 결과는 null을 반환한다", () => {
    expect(safeDivide(NaN, 2)).toBeNull();
  });
});

describe("calculateCTR", () => {
  it("CTR을 백분율로 계산한다", () => {
    expect(calculateCTR(50, 1000)).toBe(5); // 5%
    expect(calculateCTR(100, 1000)).toBe(10); // 10%
  });

  it("노출이 0이면 null을 반환한다", () => {
    expect(calculateCTR(50, 0)).toBeNull();
  });

  it("클릭이 0이면 0을 반환한다", () => {
    expect(calculateCTR(0, 1000)).toBe(0);
  });

  it("클릭이 노출보다 많으면 100% 이상을 반환한다", () => {
    expect(calculateCTR(150, 100)).toBe(150);
  });

  it("소수점 CTR을 계산한다", () => {
    expect(calculateCTR(1, 1000)).toBe(0.1); // 0.1%
  });
});

describe("calculateCPC", () => {
  it("CPC를 계산한다", () => {
    expect(calculateCPC(10000, 100)).toBe(100); // 100원/클릭
    expect(calculateCPC(50000, 500)).toBe(100);
  });

  it("클릭이 0이면 null을 반환한다", () => {
    expect(calculateCPC(10000, 0)).toBeNull();
  });

  it("비용이 0이면 0을 반환한다", () => {
    expect(calculateCPC(0, 100)).toBe(0);
  });

  it("소수점 CPC를 계산한다", () => {
    expect(calculateCPC(10000, 3)).toBeCloseTo(3333.33, 1);
  });
});

describe("calculateROAS", () => {
  it("ROAS를 백분율로 계산한다", () => {
    expect(calculateROAS(100000, 50000)).toBe(200); // 200%
    expect(calculateROAS(50000, 50000)).toBe(100); // 100%
  });

  it("비용이 0이면 null을 반환한다", () => {
    expect(calculateROAS(100000, 0)).toBeNull();
  });

  it("전환가치가 0이면 0을 반환한다", () => {
    expect(calculateROAS(0, 50000)).toBe(0);
  });

  it("ROAS가 100% 미만인 경우 (손실)", () => {
    expect(calculateROAS(30000, 50000)).toBe(60); // 60%
  });

  it("매우 높은 ROAS를 계산한다", () => {
    expect(calculateROAS(500000, 10000)).toBe(5000); // 5000%
  });
});
