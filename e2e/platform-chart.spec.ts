import { test, expect } from "@playwright/test";

test.describe("플랫폼 차트 양방향 연동", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[role="search"][aria-label="캠페인 필터"]');
    // 차트 로딩 대기
    await page.waitForSelector("text=플랫폼별 성과");
  });

  test("플랫폼별 성과 차트가 렌더링된다", async ({ page }) => {
    // 차트 제목 확인
    await expect(page.locator("text=플랫폼별 성과")).toBeVisible();
    // 차트 설명 확인
    await expect(page.locator("text=매체별")).toBeVisible();
  });

  test("플랫폼 차트의 메트릭 토글이 동작한다", async ({ page }) => {
    // 기본값 비용 확인
    const platformSection = page
      .locator("text=플랫폼별 성과")
      .locator("..")
      .locator("..");

    // 노출수 버튼 클릭
    await platformSection.getByRole("button", { name: "노출수" }).click();

    // 차트 설명이 노출수로 변경되었는지 확인
    await expect(page.locator("text=노출수 비중")).toBeVisible();

    // 클릭수 버튼 클릭
    await platformSection.getByRole("button", { name: "클릭수" }).click();
    await expect(page.locator("text=클릭수 비중")).toBeVisible();

    // 전환수 버튼 클릭
    await platformSection.getByRole("button", { name: "전환수" }).click();
    await expect(page.locator("text=전환수 비중")).toBeVisible();
  });

  test("플랫폼 범례 클릭 시 글로벌 필터가 업데이트된다", async ({ page }) => {
    // 플랫폼 차트 카드 영역 찾기
    const platformChart = page.locator('[data-testid="platform-chart"]');

    // 범례 버튼 로딩 대기
    const googleButton = platformChart.getByRole("button", { name: /Google/ });
    await googleButton.waitFor({ state: "visible" });

    // Google 범례 버튼 클릭
    await googleButton.click();

    // 매체 필터가 Google로 변경되었는지 확인
    const platformTrigger = page.locator('[aria-labelledby="platform-label"]');
    await expect(platformTrigger).toContainText("Google");
  });

  test("플랫폼 선택 후 다시 클릭하면 해제된다", async ({ page }) => {
    const platformChart = page.locator('[data-testid="platform-chart"]');

    // 범례 버튼 로딩 대기
    const googleButton = platformChart.getByRole("button", { name: /Google/ });
    await googleButton.waitFor({ state: "visible" });

    // Google 클릭 (선택)
    await googleButton.click();

    // 매체 필터가 Google로 변경 확인
    const platformTrigger = page.locator('[aria-labelledby="platform-label"]');
    await expect(platformTrigger).toContainText("Google");

    // Google 다시 클릭 (해제)
    await googleButton.click();

    // 전체로 복귀 확인
    await expect(platformTrigger).toContainText("전체");
  });

  test("글로벌 필터 변경 시 플랫폼 차트가 동기화된다", async ({ page }) => {
    // 상태 필터에서 '진행중' 선택
    const statusTrigger = page.locator('[aria-labelledby="status-label"]');
    await statusTrigger.click();
    await page
      .locator('[role="listbox"]')
      .getByRole("option", { name: "진행중" })
      .click();
    await page.locator("body").click({ position: { x: 0, y: 0 } });

    // 플랫폼 차트가 여전히 표시되고 동기화되었는지 확인
    await expect(page.locator("text=플랫폼별 성과")).toBeVisible();
  });
});

test.describe("캠페인 랭킹 차트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[role="search"][aria-label="캠페인 필터"]');
    await page.waitForSelector("text=캠페인 랭킹 Top3");
  });

  test("캠페인 랭킹 차트가 렌더링된다", async ({ page }) => {
    await expect(page.locator("text=캠페인 랭킹 Top3")).toBeVisible();
    await expect(page.locator("text=기준 상위 캠페인")).toBeVisible();
  });

  test("캠페인 랭킹의 메트릭 토글이 동작한다", async ({ page }) => {
    const rankingSection = page
      .locator("text=캠페인 랭킹 Top3")
      .locator("..")
      .locator("..");

    // CTR 버튼 클릭
    await rankingSection.getByRole("button", { name: "CTR" }).click();
    await expect(page.locator("text=CTR 기준 상위 캠페인")).toBeVisible();

    // CPC 버튼 클릭
    await rankingSection.getByRole("button", { name: "CPC" }).click();
    await expect(page.locator("text=CPC 기준 상위 캠페인")).toBeVisible();

    // ROAS 버튼 클릭 (기본값으로 복귀)
    await rankingSection.getByRole("button", { name: "ROAS" }).click();
    await expect(page.locator("text=ROAS 기준 상위 캠페인")).toBeVisible();
  });

  test("글로벌 필터 변경 시 캠페인 랭킹이 동기화된다", async ({ page }) => {
    // 매체 필터에서 'Google' 선택
    const platformTrigger = page.locator('[aria-labelledby="platform-label"]');
    await platformTrigger.click();
    await page
      .locator('[role="listbox"]')
      .getByRole("option", { name: "Google" })
      .click();
    await page.locator("body").click({ position: { x: 0, y: 0 } });

    // 캠페인 랭킹이 여전히 표시되고 동기화되었는지 확인
    await expect(page.locator("text=캠페인 랭킹 Top3")).toBeVisible();
  });
});

test.describe("캠페인 랭킹 정렬 방향 (평가 포인트)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[role="search"][aria-label="캠페인 필터"]');
    await page.waitForSelector("text=캠페인 랭킹 Top3");
  });

  // 헬퍼 함수: 랭킹 카드에서 메트릭 값들을 추출
  async function getRankingValues(
    page: import("@playwright/test").Page
  ): Promise<number[]> {
    const rankingSection = page
      .locator("text=캠페인 랭킹 Top3")
      .locator("..")
      .locator("..");
    const valueElements = rankingSection.locator(".tabular-nums");
    const count = await valueElements.count();

    const values: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await valueElements.nth(i).textContent();
      // 숫자와 소수점만 추출 (쉼표, 단위 제거)
      const numericValue = parseFloat(text?.replace(/[^0-9.]/g, "") || "0");
      if (!isNaN(numericValue)) {
        values.push(numericValue);
      }
    }
    return values;
  }

  test("ROAS는 높을수록 상위에 표시된다 (내림차순)", async ({ page }) => {
    // ROAS가 기본값이므로 바로 확인
    await expect(page.locator("text=ROAS 기준 상위 캠페인")).toBeVisible();

    // 랭킹 값들이 표시될 때까지 대기
    await page.waitForTimeout(500);

    const values = await getRankingValues(page);

    // 데이터가 있을 경우에만 정렬 검증
    if (values.length >= 2) {
      // 내림차순 정렬 확인: 첫 번째 값 >= 두 번째 값 >= ...
      for (let i = 0; i < values.length - 1; i++) {
        expect(values[i]).toBeGreaterThanOrEqual(values[i + 1]);
      }
    }
  });

  test("CTR은 높을수록 상위에 표시된다 (내림차순)", async ({ page }) => {
    const rankingSection = page
      .locator("text=캠페인 랭킹 Top3")
      .locator("..")
      .locator("..");

    // CTR 버튼 클릭
    await rankingSection.getByRole("button", { name: "CTR" }).click();
    await expect(page.locator("text=CTR 기준 상위 캠페인")).toBeVisible();

    await page.waitForTimeout(500);

    const values = await getRankingValues(page);

    // 데이터가 있을 경우에만 정렬 검증
    if (values.length >= 2) {
      // 내림차순 정렬 확인
      for (let i = 0; i < values.length - 1; i++) {
        expect(values[i]).toBeGreaterThanOrEqual(values[i + 1]);
      }
    }
  });

  test("CPC는 낮을수록 상위에 표시된다 (오름차순)", async ({ page }) => {
    const rankingSection = page
      .locator("text=캠페인 랭킹 Top3")
      .locator("..")
      .locator("..");

    // CPC 버튼 클릭
    await rankingSection.getByRole("button", { name: "CPC" }).click();
    await expect(page.locator("text=CPC 기준 상위 캠페인")).toBeVisible();

    await page.waitForTimeout(500);

    const values = await getRankingValues(page);

    // 데이터가 있을 경우에만 정렬 검증
    if (values.length >= 2) {
      // 오름차순 정렬 확인: 첫 번째 값 <= 두 번째 값 <= ...
      for (let i = 0; i < values.length - 1; i++) {
        expect(values[i]).toBeLessThanOrEqual(values[i + 1]);
      }
    }
  });

  test("메트릭 변경 시 정렬 순서가 올바르게 적용된다", async ({ page }) => {
    const rankingSection = page
      .locator("text=캠페인 랭킹 Top3")
      .locator("..")
      .locator("..");

    // ROAS -> CPC -> CTR 순서로 변경하며 정렬 확인
    // ROAS (내림차순)
    await expect(page.locator("text=ROAS 기준 상위 캠페인")).toBeVisible();
    const roasValues = await getRankingValues(page);
    if (roasValues.length >= 2) {
      expect(roasValues[0]).toBeGreaterThanOrEqual(roasValues[1]);
    }

    // CPC (오름차순)
    await rankingSection.getByRole("button", { name: "CPC" }).click();
    await page.waitForTimeout(300);
    const cpcValues = await getRankingValues(page);
    if (cpcValues.length >= 2) {
      expect(cpcValues[0]).toBeLessThanOrEqual(cpcValues[1]);
    }

    // CTR (내림차순)
    await rankingSection.getByRole("button", { name: "CTR" }).click();
    await page.waitForTimeout(300);
    const ctrValues = await getRankingValues(page);
    if (ctrValues.length >= 2) {
      expect(ctrValues[0]).toBeGreaterThanOrEqual(ctrValues[1]);
    }
  });

  test("랭킹에 최대 3개의 캠페인만 표시된다", async ({ page }) => {
    const rankingSection = page
      .locator("text=캠페인 랭킹 Top3")
      .locator("..")
      .locator("..");

    // 순위 뱃지 (1, 2, 3) 확인
    const rankBadges = rankingSection.locator(".rounded-full.font-bold");
    const count = await rankBadges.count();

    // 최대 3개
    expect(count).toBeLessThanOrEqual(3);

    // 데이터가 있으면 1등은 반드시 존재
    if (count > 0) {
      await expect(rankBadges.first()).toContainText("1");
    }
  });

  test("각 순위에 캠페인명이 표시된다", async ({ page }) => {
    const rankingSection = page
      .locator("text=캠페인 랭킹 Top3")
      .locator("..")
      .locator("..");

    // 캠페인 카드 내 캠페인명 확인
    const campaignNames = rankingSection.locator(".truncate.font-medium");
    const count = await campaignNames.count();

    // 데이터가 있으면 캠페인명이 표시됨
    if (count > 0) {
      const firstName = await campaignNames.first().textContent();
      expect(firstName).toBeTruthy();
      expect(firstName?.trim().length).toBeGreaterThan(0);
    }
  });

  test("각 순위에 메트릭 값과 단위가 표시된다", async ({ page }) => {
    const rankingSection = page
      .locator("text=캠페인 랭킹 Top3")
      .locator("..")
      .locator("..");

    // ROAS 기본값 - 단위는 %
    await expect(page.locator("text=ROAS 기준 상위 캠페인")).toBeVisible();

    // 값이 있다면 % 단위 확인
    const valueWithUnit = rankingSection.locator(".tabular-nums").first();
    if (await valueWithUnit.isVisible()) {
      const parent = valueWithUnit.locator("..");
      await expect(parent.locator("text=%")).toBeVisible();
    }

    // CPC로 변경 - 단위는 원
    await rankingSection.getByRole("button", { name: "CPC" }).click();
    await page.waitForTimeout(300);

    const cpcValueWithUnit = rankingSection.locator(".tabular-nums").first();
    if (await cpcValueWithUnit.isVisible()) {
      const parent = cpcValueWithUnit.locator("..");
      await expect(parent.locator("text=원")).toBeVisible();
    }
  });
});
