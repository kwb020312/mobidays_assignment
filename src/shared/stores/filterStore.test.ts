import { describe, it, expect, beforeEach } from "vitest";
import {
  useFilterStore,
  selectEffectiveStatus,
  selectEffectivePlatform,
} from "./filterStore";
import { ALL_STATUSES, ALL_PLATFORMS } from "@/shared/types";

describe("filterStore", () => {
  beforeEach(() => {
    // 매 테스트 전 스토어 초기화
    useFilterStore.getState().reset();
  });

  describe("초기 상태", () => {
    it("초기 status는 빈 Set이다", () => {
      const state = useFilterStore.getState();
      expect(state.status.size).toBe(0);
    });

    it("초기 platform은 빈 Set이다", () => {
      const state = useFilterStore.getState();
      expect(state.platform.size).toBe(0);
    });

    it("초기 dateRange가 설정되어 있다", () => {
      const state = useFilterStore.getState();
      expect(state.dateRange.from).toBeInstanceOf(Date);
      expect(state.dateRange.to).toBeInstanceOf(Date);
    });
  });

  describe("setStatus", () => {
    it("상태를 설정한다", () => {
      const newStatus = new Set<"active" | "paused" | "ended">(["active"]);
      useFilterStore.getState().setStatus(newStatus);
      expect(useFilterStore.getState().status).toEqual(newStatus);
    });

    it("여러 상태를 설정한다", () => {
      const newStatus = new Set<"active" | "paused" | "ended">([
        "active",
        "paused",
      ]);
      useFilterStore.getState().setStatus(newStatus);
      expect(useFilterStore.getState().status.has("active")).toBe(true);
      expect(useFilterStore.getState().status.has("paused")).toBe(true);
      expect(useFilterStore.getState().status.has("ended")).toBe(false);
    });
  });

  describe("setPlatform", () => {
    it("플랫폼을 설정한다", () => {
      const newPlatform = new Set<"Google" | "Meta" | "Naver">(["Google"]);
      useFilterStore.getState().setPlatform(newPlatform);
      expect(useFilterStore.getState().platform).toEqual(newPlatform);
    });
  });

  describe("toggleStatus", () => {
    it("상태를 추가한다", () => {
      useFilterStore.getState().toggleStatus("active");
      expect(useFilterStore.getState().status.has("active")).toBe(true);
    });

    it("이미 있는 상태를 제거한다", () => {
      useFilterStore.getState().toggleStatus("active");
      useFilterStore.getState().toggleStatus("active");
      expect(useFilterStore.getState().status.has("active")).toBe(false);
    });

    it("여러 상태를 토글한다", () => {
      useFilterStore.getState().toggleStatus("active");
      useFilterStore.getState().toggleStatus("paused");
      expect(useFilterStore.getState().status.size).toBe(2);

      useFilterStore.getState().toggleStatus("active");
      expect(useFilterStore.getState().status.size).toBe(1);
      expect(useFilterStore.getState().status.has("paused")).toBe(true);
    });
  });

  describe("togglePlatform", () => {
    it("플랫폼을 추가한다", () => {
      useFilterStore.getState().togglePlatform("Google");
      expect(useFilterStore.getState().platform.has("Google")).toBe(true);
    });

    it("이미 있는 플랫폼을 제거한다", () => {
      useFilterStore.getState().togglePlatform("Google");
      useFilterStore.getState().togglePlatform("Google");
      expect(useFilterStore.getState().platform.has("Google")).toBe(false);
    });

    it("여러 플랫폼을 토글한다", () => {
      useFilterStore.getState().togglePlatform("Google");
      useFilterStore.getState().togglePlatform("Meta");
      useFilterStore.getState().togglePlatform("Naver");
      expect(useFilterStore.getState().platform.size).toBe(3);

      useFilterStore.getState().togglePlatform("Meta");
      expect(useFilterStore.getState().platform.size).toBe(2);
    });
  });

  describe("setDateRange", () => {
    it("날짜 범위를 설정한다", () => {
      const newRange = {
        from: new Date(2026, 0, 1),
        to: new Date(2026, 0, 31),
      };
      useFilterStore.getState().setDateRange(newRange);
      expect(useFilterStore.getState().dateRange).toEqual(newRange);
    });
  });

  describe("reset", () => {
    it("모든 필터를 초기 상태로 되돌린다", () => {
      // 필터 변경
      useFilterStore.getState().toggleStatus("active");
      useFilterStore.getState().togglePlatform("Google");
      useFilterStore.getState().setDateRange({
        from: new Date(2025, 0, 1),
        to: new Date(2025, 11, 31),
      });

      // 리셋
      useFilterStore.getState().reset();

      // 확인
      expect(useFilterStore.getState().status.size).toBe(0);
      expect(useFilterStore.getState().platform.size).toBe(0);
    });
  });

  describe("selectors", () => {
    describe("selectEffectiveStatus", () => {
      it("빈 Set이면 전체 상태를 반환한다", () => {
        const state = useFilterStore.getState();
        const effective = selectEffectiveStatus(state);
        expect(effective).toEqual(new Set(ALL_STATUSES));
      });

      it("선택된 상태가 있으면 그대로 반환한다", () => {
        useFilterStore.getState().toggleStatus("active");
        const state = useFilterStore.getState();
        const effective = selectEffectiveStatus(state);
        expect(effective.size).toBe(1);
        expect(effective.has("active")).toBe(true);
      });
    });

    describe("selectEffectivePlatform", () => {
      it("빈 Set이면 전체 플랫폼을 반환한다", () => {
        const state = useFilterStore.getState();
        const effective = selectEffectivePlatform(state);
        expect(effective).toEqual(new Set(ALL_PLATFORMS));
      });

      it("선택된 플랫폼이 있으면 그대로 반환한다", () => {
        useFilterStore.getState().togglePlatform("Google");
        const state = useFilterStore.getState();
        const effective = selectEffectivePlatform(state);
        expect(effective.size).toBe(1);
        expect(effective.has("Google")).toBe(true);
      });
    });
  });
});
