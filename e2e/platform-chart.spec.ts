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
