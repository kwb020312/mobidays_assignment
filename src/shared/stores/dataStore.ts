"use client";

import { create } from "zustand";
import { campaignApi, type Campaign } from "@/entities/campaign";
import { dailyStatApi, type DailyStat } from "@/entities/dailyStat";

interface DataState {
  campaigns: Campaign[];
  dailyStats: DailyStat[];
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
}

interface DataStore extends DataState {
  fetchData: () => Promise<void>;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
}

export const useDataStore = create<DataStore>((set, get) => ({
  campaigns: [],
  dailyStats: [],
  isLoading: false,
  error: null,
  isInitialized: false,

  fetchData: async () => {
    // 이미 로드 중이거나 초기화된 경우 스킵
    if (get().isLoading || get().isInitialized) return;

    set({ isLoading: true, error: null });
    try {
      const [campaigns, dailyStats] = await Promise.all([
        campaignApi.getAll(),
        dailyStatApi.getAll(),
      ]);
      set({ campaigns, dailyStats, isInitialized: true });
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error("데이터 로드 실패") });
    } finally {
      set({ isLoading: false });
    }
  },

  addCampaign: (campaign) => {
    set((state) => ({
      campaigns: [...state.campaigns, campaign],
    }));
  },

  updateCampaign: (id, data) => {
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    }));
  },
}));
