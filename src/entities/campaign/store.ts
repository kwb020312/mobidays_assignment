import { create } from "zustand";
import type { Campaign } from "@/shared/types";
import { campaignApi } from "./api";

interface CampaignState {
  campaigns: Campaign[];
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
}

interface CampaignStore extends CampaignState {
  fetchCampaigns: () => Promise<void>;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
}

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaigns: [],
  isLoading: false,
  error: null,
  isInitialized: false,

  fetchCampaigns: async () => {
    if (get().isLoading || get().isInitialized) return;

    set({ isLoading: true, error: null });
    try {
      const campaigns = await campaignApi.getAll();
      set({ campaigns, isInitialized: true });
    } catch (err) {
      set({ error: err instanceof Error ? err : new Error("캠페인 로드 실패") });
    } finally {
      set({ isLoading: false });
    }
  },

  addCampaign: (campaign) => {
    set((state) => ({
      campaigns: [campaign, ...state.campaigns],
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
