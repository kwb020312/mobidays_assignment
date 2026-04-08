import { test, expect } from "@playwright/test";

test.describe("캠페인 등록 모달", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=캠페인 목록");
  });

  test.describe("모달 열기/닫기", () => {
    test("캠페인 등록 버튼이 표시된다", async ({ page }) => {
      const registerButton = page.getByRole("button", { name: "캠페인 등록" });
      await expect(registerButton).toBeVisible();
    });

    test("캠페인 등록 버튼 클릭 시 모달이 열린다", async ({ page }) => {
      await page.getByRole("button", { name: "캠페인 등록" }).click();

      // 모달 다이얼로그가 표시되는지 확인
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(
        page.locator('[role="dialog"]').getByText("캠페인 등록")
      ).toBeVisible();
    });

    test("모달 외부 클릭 시 모달이 닫힌다", async ({ page }) => {
      await page.getByRole("button", { name: "캠페인 등록" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();

      // 모달 외부 (오버레이) 클릭
      await page.locator("[data-radix-dialog-overlay]").click({ force: true });

      // 모달이 닫히는지 확인
      await expect(page.getByRole("dialog")).not.toBeVisible();
    });
  });

  test.describe("입력 필드 표시", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: "캠페인 등록" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
    });

    test("캠페인명 입력 필드가 표시된다", async ({ page }) => {
      await expect(page.getByLabel("캠페인명 *")).toBeVisible();
    });

    test("광고 매체 선택 필드가 표시된다", async ({ page }) => {
      await expect(page.getByLabel("광고 매체 *")).toBeVisible();
    });

    test("예산 입력 필드가 표시된다", async ({ page }) => {
      await expect(page.getByLabel("예산 (원) *")).toBeVisible();
    });

    test("집행 금액 입력 필드가 표시된다", async ({ page }) => {
      await expect(page.getByLabel("집행 금액 (원) *")).toBeVisible();
    });

    test("시작일 선택 버튼이 표시된다", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: /시작일 선택/ })
      ).toBeVisible();
    });

    test("종료일 선택 버튼이 표시된다", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: /종료일 선택/ })
      ).toBeVisible();
    });

    test("등록 버튼이 표시된다", async ({ page }) => {
      await expect(
        page.locator('[role="dialog"]').getByRole("button", { name: "등록" })
      ).toBeVisible();
    });
  });

  test.describe("유효성 검사", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: "캠페인 등록" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
    });

    test("빈 폼 제출 시 에러 메시지가 표시된다", async ({ page }) => {
      // 등록 버튼 클릭
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "등록" })
        .click();

      // 에러 메시지 확인 (최소 하나 이상)
      const errorMessages = page.locator('[role="dialog"] .text-destructive');
      await expect(errorMessages.first()).toBeVisible();
    });

    test("캠페인명이 2자 미만일 때 에러 메시지가 표시된다", async ({
      page,
    }) => {
      await page.getByLabel("캠페인명 *").fill("A");
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "등록" })
        .click();

      // 캠페인명 관련 에러 메시지 확인
      await expect(
        page.locator('[role="dialog"]').locator("text=/2자|최소/")
      ).toBeVisible();
    });

    test("예산이 100원 미만일 때 에러 메시지가 표시된다", async ({ page }) => {
      await page.getByLabel("예산 (원) *").fill("50");
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "등록" })
        .click();

      // 예산 관련 에러 메시지 확인
      await expect(
        page.locator('[role="dialog"]').locator("text=/100|최소/")
      ).toBeVisible();
    });

    test("집행 금액이 예산을 초과할 때 에러 메시지가 표시된다", async ({
      page,
    }) => {
      await page.getByLabel("예산 (원) *").fill("10000");
      await page.getByLabel("집행 금액 (원) *").fill("20000");
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "등록" })
        .click();

      // 집행 금액 관련 에러 메시지 확인
      await expect(
        page.locator('[role="dialog"]').locator("text=/예산|초과/")
      ).toBeVisible();
    });
  });

  test.describe("날짜 선택", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: "캠페인 등록" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
    });

    test("시작일 버튼 클릭 시 캘린더가 표시된다", async ({ page }) => {
      await page.getByRole("button", { name: /시작일 선택/ }).click();

      // 캘린더 팝오버가 표시되는지 확인
      await expect(page.locator('[role="grid"]')).toBeVisible();
    });

    test("종료일 버튼 클릭 시 캘린더가 표시된다", async ({ page }) => {
      await page.getByRole("button", { name: /종료일 선택/ }).click();

      // 캘린더 팝오버가 표시되는지 확인
      await expect(page.locator('[role="grid"]')).toBeVisible();
    });
  });

  test.describe("캠페인 등록 성공 (평가 포인트)", () => {
    test("정상적인 데이터 입력 후 등록 시 모달이 닫힌다", async ({ page }) => {
      await page.getByRole("button", { name: "캠페인 등록" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();

      // 폼 입력
      await page.getByLabel("캠페인명 *").fill("테스트 캠페인");
      await page.getByLabel("광고 매체 *").selectOption("Google");
      await page.getByLabel("예산 (원) *").fill("1000000");
      await page.getByLabel("집행 금액 (원) *").fill("500000");

      // 시작일 선택
      await page.getByRole("button", { name: /시작일 선택/ }).click();
      await page
        .locator('[role="grid"]')
        .locator("button")
        .filter({ hasText: "15" })
        .first()
        .click();

      // 종료일 선택
      await page.getByRole("button", { name: /종료일 선택/ }).click();
      await page
        .locator('[role="grid"]')
        .locator("button")
        .filter({ hasText: "20" })
        .first()
        .click();

      // 등록 버튼 클릭
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "등록" })
        .click();

      // 모달이 닫히는지 확인
      await expect(page.getByRole("dialog")).not.toBeVisible();
    });

    test("등록 성공 시 테이블에 즉시 반영된다", async ({ page }) => {
      await page.getByRole("button", { name: "캠페인 등록" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();

      const campaignName = `E2E 테스트 캠페인 ${Date.now()}`;

      // 폼 입력
      await page.getByLabel("캠페인명 *").fill(campaignName);
      await page.getByLabel("광고 매체 *").selectOption("Google");
      await page.getByLabel("예산 (원) *").fill("1000000");
      await page.getByLabel("집행 금액 (원) *").fill("500000");

      // 시작일 선택
      await page.getByRole("button", { name: /시작일 선택/ }).click();
      await page
        .locator('[role="grid"]')
        .locator("button")
        .filter({ hasText: "15" })
        .first()
        .click();

      // 종료일 선택
      await page.getByRole("button", { name: /종료일 선택/ }).click();
      await page
        .locator('[role="grid"]')
        .locator("button")
        .filter({ hasText: "20" })
        .first()
        .click();

      // 등록
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "등록" })
        .click();

      // 모달 닫힘 확인
      await expect(page.getByRole("dialog")).not.toBeVisible();

      // 테이블에서 새 캠페인 검색
      await page.getByLabel("캠페인명 검색").fill(campaignName);
      await page.waitForTimeout(300);

      // 새 캠페인이 테이블에 표시되는지 확인
      await expect(page.locator("tbody").getByText(campaignName)).toBeVisible();
    });

    test("등록 성공 시 토스트 메시지가 표시된다", async ({ page }) => {
      await page.getByRole("button", { name: "캠페인 등록" }).click();

      // 폼 입력
      await page.getByLabel("캠페인명 *").fill("토스트 테스트 캠페인");
      await page.getByLabel("광고 매체 *").selectOption("Meta");
      await page.getByLabel("예산 (원) *").fill("500000");
      await page.getByLabel("집행 금액 (원) *").fill("100000");

      // 날짜 선택
      await page.getByRole("button", { name: /시작일 선택/ }).click();
      await page
        .locator('[role="grid"]')
        .locator("button")
        .filter({ hasText: "10" })
        .first()
        .click();
      await page.getByRole("button", { name: /종료일 선택/ }).click();
      await page
        .locator('[role="grid"]')
        .locator("button")
        .filter({ hasText: "25" })
        .first()
        .click();

      // 등록
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "등록" })
        .click();

      // 토스트 메시지 확인
      await expect(page.locator("text=캠페인 등록 완료")).toBeVisible();
    });

    test("신규 등록 캠페인은 active 상태로 등록된다", async ({ page }) => {
      await page.getByRole("button", { name: "캠페인 등록" }).click();

      const campaignName = `상태 테스트 캠페인 ${Date.now()}`;

      // 폼 입력
      await page.getByLabel("캠페인명 *").fill(campaignName);
      await page.getByLabel("광고 매체 *").selectOption("Naver");
      await page.getByLabel("예산 (원) *").fill("200000");
      await page.getByLabel("집행 금액 (원) *").fill("50000");

      // 날짜 선택
      await page.getByRole("button", { name: /시작일 선택/ }).click();
      await page
        .locator('[role="grid"]')
        .locator("button")
        .filter({ hasText: "5" })
        .first()
        .click();
      await page.getByRole("button", { name: /종료일 선택/ }).click();
      await page
        .locator('[role="grid"]')
        .locator("button")
        .filter({ hasText: "30" })
        .first()
        .click();

      // 등록
      await page
        .locator('[role="dialog"]')
        .getByRole("button", { name: "등록" })
        .click();
      await expect(page.getByRole("dialog")).not.toBeVisible();

      // 검색으로 새 캠페인 찾기
      await page.getByLabel("캠페인명 검색").fill(campaignName);
      await page.waitForTimeout(300);

      // 진행중 상태 확인
      const row = page.locator("tbody tr").filter({ hasText: campaignName });
      await expect(row.locator("text=진행중")).toBeVisible();
    });
  });

  test.describe("숫자 입력 포맷팅", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: "캠페인 등록" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
    });

    test("예산 입력 시 천 단위 구분 기호가 표시된다", async ({ page }) => {
      const budgetInput = page.getByLabel("예산 (원) *");
      await budgetInput.fill("1000000");

      // 포맷팅된 값 확인
      await expect(budgetInput).toHaveValue("1,000,000");
    });

    test("집행 금액 입력 시 천 단위 구분 기호가 표시된다", async ({ page }) => {
      const costInput = page.getByLabel("집행 금액 (원) *");
      await costInput.fill("500000");

      // 포맷팅된 값 확인
      await expect(costInput).toHaveValue("500,000");
    });
  });
});
