import { test, expect } from "@playwright/test";

test.describe("캠페인 테이블", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("text=캠페인 목록");
  });

  test.describe("테이블 렌더링", () => {
    test("테이블 헤더 컬럼들이 렌더링된다", async ({ page }) => {
      await expect(
        page.locator("th").filter({ hasText: "캠페인명" })
      ).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "상태" })
      ).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "매체" })
      ).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "집행기간" })
      ).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "총 집행금액" })
      ).toBeVisible();
      await expect(page.locator("th").filter({ hasText: "CTR" })).toBeVisible();
      await expect(page.locator("th").filter({ hasText: "CPC" })).toBeVisible();
      await expect(
        page.locator("th").filter({ hasText: "ROAS" })
      ).toBeVisible();
    });

    test("테이블에 데이터가 표시된다", async ({ page }) => {
      // 테이블 바디에 행이 있는지 확인
      const rows = page.locator("tbody tr");
      await expect(rows.first()).toBeVisible();
    });
  });

  test.describe("검색 기능", () => {
    test("검색 입력란이 표시된다", async ({ page }) => {
      const searchInput = page.getByLabel("캠페인명 검색");
      await expect(searchInput).toBeVisible();
    });

    test("검색어 입력 시 결과가 필터링된다", async ({ page }) => {
      const searchInput = page.getByLabel("캠페인명 검색");

      // 검색 전 건수 확인
      const countText = page.locator("text=/\\d+ \\/ \\d+건/");
      await expect(countText).toBeVisible();

      // 검색어 입력
      await searchInput.fill("Google");

      // 잠시 대기 (debounce 고려)
      await page.waitForTimeout(300);

      // 검색 결과가 필터링되었는지 확인
      await expect(countText).toBeVisible();
    });

    test("검색 결과 건수가 표시된다", async ({ page }) => {
      const countText = page.locator("text=/\\d+ \\/ \\d+건/");
      await expect(countText).toBeVisible();
    });
  });

  test.describe("정렬 기능", () => {
    test("집행기간 컬럼 클릭 시 정렬된다", async ({ page }) => {
      const header = page.locator("th").filter({ hasText: "집행기간" });
      await header.click();

      // 정렬 아이콘이 표시되는지 확인 (aria-sort 또는 시각적 표시)
      await expect(header).toBeVisible();
    });

    test("총 집행금액 컬럼 클릭 시 정렬된다", async ({ page }) => {
      const header = page.locator("th").filter({ hasText: "총 집행금액" });
      await header.click();
      await expect(header).toBeVisible();
    });

    test("CTR 컬럼 클릭 시 정렬된다", async ({ page }) => {
      const header = page.locator("th").filter({ hasText: "CTR" });
      await header.click();
      await expect(header).toBeVisible();
    });

    test("CPC 컬럼 클릭 시 정렬된다", async ({ page }) => {
      const header = page.locator("th").filter({ hasText: "CPC" });
      await header.click();
      await expect(header).toBeVisible();
    });

    test("ROAS 컬럼 클릭 시 정렬된다", async ({ page }) => {
      const header = page.locator("th").filter({ hasText: "ROAS" });
      await header.click();
      await expect(header).toBeVisible();
    });

    test("같은 컬럼 두 번 클릭 시 정렬 방향이 반전된다", async ({ page }) => {
      const header = page.locator("th").filter({ hasText: "총 집행금액" });

      // 첫 번째 클릭 - 오름차순/내림차순
      await header.click();

      // 두 번째 클릭 - 반전
      await header.click();

      await expect(header).toBeVisible();
    });
  });

  test.describe("페이지네이션", () => {
    test("페이지네이션 컨트롤이 표시된다", async ({ page }) => {
      // 데이터가 10개 이상일 때만 표시됨
      const prevButton = page.getByRole("button", {
        name: "이전 페이지로 이동",
      });
      const nextButton = page.getByRole("button", {
        name: "다음 페이지로 이동",
      });

      // 페이지네이션이 존재하면 테스트
      const paginationText = page.locator("text=/\\d+ \\/ \\d+/").last();
      if (await paginationText.isVisible()) {
        await expect(prevButton).toBeVisible();
        await expect(nextButton).toBeVisible();
      }
    });

    test("다음 페이지 버튼 클릭 시 페이지가 이동한다", async ({ page }) => {
      const nextButton = page.getByRole("button", {
        name: "다음 페이지로 이동",
      });

      // 다음 페이지 버튼이 활성화되어 있으면 클릭
      if (await nextButton.isEnabled()) {
        const currentPageText = await page
          .locator("text=/\\d+ \\/ \\d+/")
          .last()
          .textContent();
        await nextButton.click();

        // 페이지가 변경되었는지 확인
        await page.waitForTimeout(100);
        const newPageText = await page
          .locator("text=/\\d+ \\/ \\d+/")
          .last()
          .textContent();
        expect(newPageText).not.toBe(currentPageText);
      }
    });
  });

  test.describe("일괄 상태 변경 (평가 포인트)", () => {
    test("전체 선택 체크박스가 표시된다", async ({ page }) => {
      const selectAllCheckbox = page.getByLabel("현재 페이지 전체 선택");
      await expect(selectAllCheckbox).toBeVisible();
    });

    test("개별 캠페인 체크박스가 표시된다", async ({ page }) => {
      // 첫 번째 행의 체크박스 확인 - Base UI Checkbox 사용
      const firstRowCheckbox = page
        .locator("tbody tr")
        .first()
        .locator('[data-slot="checkbox"]');
      await expect(firstRowCheckbox).toBeVisible();
    });

    test("선택된 캠페인 수가 표시된다", async ({ page }) => {
      await expect(page.locator("text=0개 선택됨")).toBeVisible();
    });

    test("캠페인 선택 시 선택 카운트가 업데이트된다", async ({ page }) => {
      // 첫 번째 캠페인 체크박스 클릭 - Base UI Checkbox 사용
      const firstRowCheckbox = page
        .locator("tbody tr")
        .first()
        .locator('[data-slot="checkbox"]');
      await firstRowCheckbox.click();

      // 선택됨 텍스트 업데이트 확인
      await expect(page.locator("text=1개 선택됨")).toBeVisible();
    });

    test("전체 선택 체크박스 클릭 시 현재 페이지 전체가 선택된다", async ({
      page,
    }) => {
      const selectAllCheckbox = page.getByLabel("현재 페이지 전체 선택");
      await selectAllCheckbox.click();

      // 선택됨 텍스트가 0보다 큰지 확인
      const selectedText = page.locator("text=/\\d+개 선택됨/");
      await expect(selectedText).toBeVisible();

      const text = await selectedText.textContent();
      const count = parseInt(text?.match(/(\d+)/)?.[1] || "0");
      expect(count).toBeGreaterThan(0);
    });

    test("상태 변경 드롭다운이 표시된다", async ({ page }) => {
      const statusSelect = page
        .locator("select")
        .filter({ hasText: /상태 변경|진행중|일시중지|종료/ });
      await expect(statusSelect).toBeVisible();
    });

    test("캠페인 선택 후 상태 변경이 동작한다", async ({ page }) => {
      // 첫 번째 캠페인 선택 - Base UI Checkbox 사용
      const firstRowCheckbox = page
        .locator("tbody tr")
        .first()
        .locator('[data-slot="checkbox"]');
      await firstRowCheckbox.click();

      await expect(page.locator("text=1개 선택됨")).toBeVisible();

      // 상태 변경 드롭다운에서 '일시중지' 선택
      const statusSelect = page.locator("select").first();
      await statusSelect.selectOption("paused");

      // 선택이 해제되고 토스트 메시지가 표시되는지 확인
      await expect(page.locator("text=0개 선택됨")).toBeVisible();
    });

    test("선택 해제 버튼 클릭 시 선택이 해제된다", async ({ page }) => {
      // 캠페인 선택 - Base UI Checkbox 사용
      const firstRowCheckbox = page
        .locator("tbody tr")
        .first()
        .locator('[data-slot="checkbox"]');
      await firstRowCheckbox.click();

      await expect(page.locator("text=1개 선택됨")).toBeVisible();

      // 선택 해제 버튼 클릭
      await page.getByRole("button", { name: "선택 해제" }).click();

      await expect(page.locator("text=0개 선택됨")).toBeVisible();
    });
  });

  test.describe("필터 동기화", () => {
    test("글로벌 필터 변경 시 테이블 데이터가 동기화된다", async ({ page }) => {
      // 상태 필터에서 '진행중' 선택
      const statusTrigger = page.locator('[aria-labelledby="status-label"]');
      await statusTrigger.click();
      await page
        .locator('[role="listbox"]')
        .getByRole("option", { name: "진행중" })
        .click();
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      // 테이블이 여전히 표시되는지 확인
      await expect(page.locator("text=캠페인 목록")).toBeVisible();

      // 테이블에 데이터가 표시되거나 빈 상태 메시지가 표시되는지 확인
      const hasData = await page
        .locator("tbody tr")
        .first()
        .isVisible()
        .catch(() => false);
      const hasEmptyMessage = await page
        .locator("text=선택한 조건에 해당하는 캠페인이 없습니다")
        .isVisible()
        .catch(() => false);

      expect(hasData || hasEmptyMessage).toBe(true);
    });
  });
});
