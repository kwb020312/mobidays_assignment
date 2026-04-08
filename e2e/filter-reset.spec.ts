import { test, expect } from "@playwright/test";

test.describe("필터 초기화", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[role="search"][aria-label="캠페인 필터"]');
  });

  test("초기화 버튼이 표시된다", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "필터 초기화" })
    ).toBeVisible();
  });

  test("필터 변경 후 초기화 버튼 클릭 시 모든 필터가 초기값으로 돌아간다", async ({
    page,
  }) => {
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

    await page.getByRole("button", { name: "필터 초기화" }).click();

    await expect(statusTrigger).toContainText("전체");
    await expect(platformTrigger).toContainText("전체");
  });

  test("초기화 후 필터 영역이 정상 동작한다", async ({ page }) => {
    const statusTrigger = page.locator('[aria-labelledby="status-label"]');
    await statusTrigger.click();
    await page
      .locator('[role="listbox"]')
      .getByRole("option", { name: "종료" })
      .click();
    await page.locator("body").click({ position: { x: 0, y: 0 } });

    await page.getByRole("button", { name: "필터 초기화" }).click();

    await expect(page.locator('[aria-label="캠페인 필터"]')).toBeVisible();
    await expect(page.locator("#status-label")).toBeVisible();
    await expect(page.locator("#platform-label")).toBeVisible();
  });

  test("날짜 프리셋 변경 후 초기화가 동작한다", async ({ page }) => {
    await page.getByRole("button", { name: "최근 3개월" }).click();
    await page.getByRole("button", { name: "필터 초기화" }).click();
    await expect(page.locator('[aria-label="캠페인 필터"]')).toBeVisible();
  });

  test("복합 필터 적용 후 초기화가 모든 필터를 리셋한다", async ({ page }) => {
    const statusTrigger = page.locator('[aria-labelledby="status-label"]');
    await statusTrigger.click();
    await page
      .locator('[role="listbox"]')
      .getByRole("option", { name: "진행중" })
      .click();
    await page
      .locator('[role="listbox"]')
      .getByRole("option", { name: "일시중지" })
      .click();
    await page.locator("body").click({ position: { x: 0, y: 0 } });

    const platformTrigger = page.locator('[aria-labelledby="platform-label"]');
    await platformTrigger.click();
    await page
      .locator('[role="listbox"]')
      .getByRole("option", { name: "Google" })
      .click();
    await page
      .locator('[role="listbox"]')
      .getByRole("option", { name: "Meta" })
      .click();
    await page.locator("body").click({ position: { x: 0, y: 0 } });

    await page.getByRole("button", { name: "필터 초기화" }).click();

    await expect(statusTrigger).toContainText("전체");
    await expect(platformTrigger).toContainText("전체");
  });
});
