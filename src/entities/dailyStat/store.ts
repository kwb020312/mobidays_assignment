import { create } from "zustand";
import type { DailyStat } from "@/shared/types";
import { dailyStatApi } from "./api";

interface DailyStatState {
  dailyStats: DailyStat[];
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
}

interface DailyStatStore extends DailyStatState {
  fetchDailyStats: () => Promise<void>;
}

export const useDailyStatStore = create<DailyStatStore>((set, get) => ({
  dailyStats: [],
  isLoading: false,
  error: null,
  isInitialized: false,

  fetchDailyStats: async () => {
    if (get().isLoading || get().isInitialized) return;

    set({ isLoading: true, error: null });
    try {
      const dailyStats = await dailyStatApi.getAll();
      set({ dailyStats, isInitialized: true });
    } catch (err) {
      set({
        error: err instanceof Error ? err : new Error("일별 통계 로드 실패"),
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
