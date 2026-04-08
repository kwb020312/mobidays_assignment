import { test, expect } from "@playwright/test";

test.describe("글로벌 필터 동기화", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[role="search"][aria-label="캠페인 필터"]');
  });

  test("페이지 로드 시 필터 영역이 렌더링된다", async ({ page }) => {
    // 헤더
    await expect(page.locator("h1")).toContainText("마케팅 캠페인 대시보드");

    // 필터 영역 (aria-label로 구체적으로 지정)
    const filterArea = page.locator('[aria-label="캠페인 필터"]');
    await expect(filterArea.locator("#status-label")).toBeVisible();
    await expect(filterArea.locator("#platform-label")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "필터 초기화" })
    ).toBeVisible();
  });

  test("상태 필터 변��이 동작한다", async ({ page }) => {
    const statusTrigger = page.locator('[aria-labelledby="status-label"]');
    await statusTrigger.click();

    const listbox = page.locator('[role="listbox"]');
    await listbox.getByRole("option", { name: "진행중" }).click();
    await page.locator("body").click({ position: { x: 0, y: 0 } });

    await expect(statusTrigger).toContainText("진행중");
  });

  test("매체 필터 변경이 동작한다", async ({ page }) => {
    const platformTrigger = page.locator('[aria-labelledby="platform-label"]');
    await platformTrigger.click();

    const listbox = page.locator('[role="listbox"]');
    await listbox.getByRole("option", { name: "Google" }).click();
    await page.locator("body").click({ position: { x: 0, y: 0 } });

    await expect(platformTrigger).toContainText("Google");
  });

  test("날짜 프리셋 버튼이 동작한다", async ({ page }) => {
    await page.getByRole("button", { name: "이번 달" }).click();
    await expect(page.locator('[aria-label="캠페인 필터"]')).toBeVisible();
  });

  test("여러 필터를 조합하여 적용할 수 있다", async ({ page }) => {
    const statusTrigger = page.locator('[aria-labelledby="status-label"]');
    await statusTrigger.click();
    await page
      .locator('[role="listbox"]')
      .getByRole("option", { name: "진행중" })
      .click();
    await page.locator("body").click({ position: { x: 0, y: 0 } });

    const platformTrigger = page.locator('[aria-labelledby="platform-label"]');
    await platformTrigger.click();
    await page
      .locator('[role="listbox"]')
      .getByRole("option", { name: "Google" })
      .click();
    await page.locator("body").click({ position: { x: 0, y: 0 } });

    await expect(statusTrigger).toContainText("진행중");
    await expect(platformTrigger).toContainText("Google");
  });
});
