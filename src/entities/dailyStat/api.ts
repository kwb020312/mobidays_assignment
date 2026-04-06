import { api } from "@/shared/api";
import type { DailyStat } from "./types";

export const dailyStatApi = {
  getAll: () => api.get<DailyStat[]>("/daily_stats"),
  getByCampaignId: (campaignId: string) =>
    api.get<DailyStat[]>(`/daily_stats?campaignId=${campaignId}`),
  getByDateRange: (startDate: string, endDate: string) =>
    api.get<DailyStat[]>(`/daily_stats?date_gte=${startDate}&date_lte=${endDate}`),
};
