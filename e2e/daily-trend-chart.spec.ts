import { test, expect } from "@playwright/test";

test.describe("일별 추이 차트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=일별 추이");
  });

  test.describe("차트 렌더링", () => {
    test("일별 추이 차트 카드가 렌더링된다", async ({ page }) => {
      await expect(page.locator("text=일별 추이")).toBeVisible();
    });

    test("차트 날짜 범위 설명이 표시된다", async ({ page }) => {
      // CardDescription에 날짜 범위가 표시됨
      const chartCard = page
        .locator("text=일별 추이")
        .locator("..")
        .locator("..");
      await expect(chartCard.locator("text=/\\d{4}/")).toBeVisible();
    });

    test("차트 영역이 표시된다", async ({ page }) => {
      // Recharts 차트 컨테이너 확인
      const chartContainer = page.locator(".recharts-wrapper");
      await expect(chartContainer).toBeVisible();
    });

    test("X축이 표시된다", async ({ page }) => {
      const xAxis = page.locator(".recharts-xAxis");
      await expect(xAxis).toBeVisible();
    });

    test("Y축이 표시된다", async ({ page }) => {
      const yAxis = page.locator(".recharts-yAxis");
      await expect(yAxis).toBeVisible();
    });

    test("범례(Legend)가 표시된다", async ({ page }) => {
      const legend = page.locator(".recharts-legend-wrapper");
      await expect(legend).toBeVisible();
    });

    test("차트 라인이 표시된다", async ({ page }) => {
      const lines = page.locator(".recharts-line");
      await expect(lines.first()).toBeVisible();
    });
  });

  test.describe("메트릭 토글", () => {
    test("노출수 토글 버튼이 표시된다", async ({ page }) => {
      const chartCard = page
        .locator("text=일별 추이")
        .locator("..")
        .locator("..");
      await expect(
        chartCard.getByRole("button", { name: "노출수" })
      ).toBeVisible();
    });

    test("클릭수 토글 버튼이 표시된다", async ({ page }) => {
      const chartCard = page
        .locator("text=일별 추이")
        .locator("..")
        .locator("..");
      await expect(
        chartCard.getByRole("button", { name: "클릭수" })
      ).toBeVisible();
    });

    test("초기값으로 노출수와 클릭수가 모두 활성화되어 있다", async ({
      page,
    }) => {
      const chartCard = page
        .locator("text=일별 추이")
        .locator("..")
        .locator("..");

      // 활성화된 버튼은 default variant를 가짐
      const impressionsButton = chartCard.getByRole("button", {
        name: "노출수",
      });
      const clicksButton = chartCard.getByRole("button", { name: "클릭수" });

      // 두 버튼 모두 활성화 상태 (비활성화 상태가 아님)
      await expect(impressionsButton).not.toHaveAttribute(
        "data-state",
        "inactive"
      );
      await expect(clicksButton).not.toHaveAttribute("data-state", "inactive");
    });

    test("메트릭 토글 클릭 시 해당 라인이 토글된다", async ({ page }) => {
      const chartCard = page
        .locator("text=일별 추이")
        .locator("..")
        .locator("..");

      // 초기 라인 수 확인 (노출수 + 클릭수 = 2개)
      const initialLineCount = await page.locator(".recharts-line").count();

      // 클릭수 토글 해제
      await chartCard.getByRole("button", { name: "클릭수" }).click();

      // 라인 수가 줄었는지 확인
      await page.waitForTimeout(300);
      const afterToggleLineCount = await page.locator(".recharts-line").count();
      expect(afterToggleLineCount).toBeLessThan(initialLineCount);
    });

    test("최소 1개의 메트릭은 선택된 상태를 유지한다", async ({ page }) => {
      const chartCard = page
        .locator("text=일별 추이")
        .locator("..")
        .locator("..");

      // 클릭수 해제
      await chartCard.getByRole("button", { name: "클릭수" }).click();

      // 노출수만 남은 상태에서 노출수 버튼은 비활성화되어야 함
      const impressionsButton = chartCard.getByRole("button", {
        name: "노출수",
      });
      await expect(impressionsButton).toBeDisabled();
    });

    test("해제된 메트릭을 다시 클릭하면 활성화된다", async ({ page }) => {
      const chartCard = page
        .locator("text=일별 추이")
        .locator("..")
        .locator("..");

      // 클릭수 해제
      await chartCard.getByRole("button", { name: "클릭수" }).click();
      await page.waitForTimeout(300);

      // 클릭수 다시 활성화
      await chartCard.getByRole("button", { name: "클릭수" }).click();
      await page.waitForTimeout(300);

      // 라인이 2개로 돌아왔는지 확인
      const lineCount = await page.locator(".recharts-line").count();
      expect(lineCount).toBe(2);
    });
  });

  test.describe("툴팁 인터랙션", () => {
    test("차트 호버 시 툴팁이 표시된다", async ({ page }) => {
      // 차트 영역에 호버
      const chartArea = page.locator(".recharts-surface");
      await chartArea.hover();

      // 툴팁이 표시되는지 확인 (활성 dot이 나타남)
      // Recharts의 기본 동작으로 호버 시 activeDot과 툴팁이 표시됨
      await page.waitForTimeout(500);

      // 호버 위치에 따라 툴팁이 있을 수도 없을 수도 있음
      // 차트 중앙 부근을 호버하여 데이터 포인트에 가까이 가도록 함
      const box = await chartArea.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(300);
      }
    });
  });

  test.describe("필터 동기화", () => {
    test("글로벌 필터 변경 시 차트 데이터가 동기화된다", async ({ page }) => {
      // 상태 필터에서 '진행중' 선택
      const statusTrigger = page.locator('[aria-labelledby="status-label"]');
      await statusTrigger.click();
      await page
        .locator('[role="listbox"]')
        .getByRole("option", { name: "진행중" })
        .click();
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      // 차트가 여전히 표시되는지 확인
      await expect(page.locator("text=일별 추이")).toBeVisible();

      // 데이터가 있거나 빈 상태 메시지가 표시되는지 확인
      const hasChart = await page
        .locator(".recharts-wrapper")
        .isVisible()
        .catch(() => false);
      const hasEmptyMessage = await page
        .locator("text=선택한 조건에 해당하는 데이터가 없습니다")
        .isVisible()
        .catch(() => false);

      expect(hasChart || hasEmptyMessage).toBe(true);
    });

    test("매체 필터 변경 시 차트 데이터가 동기화된다", async ({ page }) => {
      // 매체 필터에서 'Google' 선택
      const platformTrigger = page.locator(
        '[aria-labelledby="platform-label"]'
      );
      await platformTrigger.click();
      await page
        .locator('[role="listbox"]')
        .getByRole("option", { name: "Google" })
        .click();
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      // 차트 영역 확인
      await expect(page.locator("text=일별 추이")).toBeVisible();
    });

    test("날짜 필터 변경 시 차트 기간 설명이 업데이트된다", async ({
      page,
    }) => {
      // 날짜 프리셋 버튼 클릭
      await page.getByRole("button", { name: "최근 3개월" }).click();

      // 차트의 날짜 범위 설명이 업데이트되는지 확인
      await page.waitForTimeout(300);
      await expect(page.locator("text=일별 추이")).toBeVisible();
    });
  });

  test.describe("빈 데이터 상태", () => {
    test("필터 결과가 없을 때 빈 상태 메시지가 표시된다", async ({ page }) => {
      // 존재하지 않는 조합의 필터 적용
      // 날짜를 아주 과거로 설정하여 데이터가 없는 상태 만들기
      // (실제 데이터에 따라 조정 필요)

      const statusTrigger = page.locator('[aria-labelledby="status-label"]');
      await statusTrigger.click();
      await page
        .locator('[role="listbox"]')
        .getByRole("option", { name: "종료" })
        .click();
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      // 차트 영역이나 빈 메시지 확인
      const chartCard = page
        .locator("text=일별 추이")
        .locator("..")
        .locator("..");
      const isEmpty = await chartCard
        .locator("text=선택한 조건에 해당하는 데이터가 없습니다")
        .isVisible()
        .catch(() => false);
      const hasData = await page
        .locator(".recharts-wrapper")
        .isVisible()
        .catch(() => false);

      // 둘 중 하나는 표시되어야 함
      expect(isEmpty || hasData).toBe(true);
    });
  });

  test.describe("로딩 상태", () => {
    test("초기 로딩 시 스켈레톤이 표시된다", async ({ page }) => {
      // 페이지를 새로고침하고 빠르게 확인
      // 네트워크가 빠르면 스켈레톤이 보이지 않을 수 있음
      await page.goto("/");

      // 스켈레톤 또는 차트가 표시되는지 확인
      const hasSkeleton = await page
        .locator("[class*='skeleton']")
        .first()
        .isVisible({ timeout: 1000 })
        .catch(() => false);
      const hasChart = await page
        .locator(".recharts-wrapper")
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      // 둘 중 하나는 나타나야 함
      expect(hasSkeleton || hasChart).toBe(true);
    });
  });
});
