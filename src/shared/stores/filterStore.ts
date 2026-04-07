import { create } from "zustand";
import { startOfMonth, endOfMonth } from "date-fns";
import type {
  Platform,
  CampaignStatus,
  FilterState,
  DateRange,
} from "@/shared/types";
import { ALL_STATUSES, ALL_PLATFORMS } from "@/shared/types";

function getInitialDateRange(): DateRange {
  const now = new Date();
  return {
    from: startOfMonth(now),
    to: endOfMonth(now),
  };
}

function createInitialState(): FilterState {
  return {
    dateRange: getInitialDateRange(),
    status: new Set<CampaignStatus>(),
    platform: new Set<Platform>(),
  };
}

interface FilterStore extends FilterState {
  setDateRange: (range: DateRange) => void;
  setStatus: (status: Set<CampaignStatus>) => void;
  setPlatform: (platform: Set<Platform>) => void;
  toggleStatus: (status: CampaignStatus) => void;
  togglePlatform: (platform: Platform) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...createInitialState(),

  setDateRange: (range) => set({ dateRange: range }),

  setStatus: (status) => set({ status }),

  setPlatform: (platform) => set({ platform }),

  toggleStatus: (status) =>
    set((state) => {
      const newStatus = new Set(state.status);
      if (newStatus.has(status)) {
        newStatus.delete(status);
      } else {
        newStatus.add(status);
      }
      return { status: newStatus };
    }),

  togglePlatform: (platform) =>
    set((state) => {
      const newPlatform = new Set(state.platform);
      if (newPlatform.has(platform)) {
        newPlatform.delete(platform);
      } else {
        newPlatform.add(platform);
      }
      return { platform: newPlatform };
    }),

  reset: () => set(createInitialState()),
}));

// Selectors
const ALL_STATUSES_SET = new Set(ALL_STATUSES);
const ALL_PLATFORMS_SET = new Set(ALL_PLATFORMS);

export const selectEffectiveStatus = (state: FilterStore): Set<CampaignStatus> =>
  state.status.size === 0 ? ALL_STATUSES_SET : state.status;

export const selectEffectivePlatform = (state: FilterStore): Set<Platform> =>
  state.platform.size === 0 ? ALL_PLATFORMS_SET : state.platform;
