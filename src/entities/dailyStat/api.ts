import { api } from "@/shared/api";
import type { DailyStat } from "./types";

export const dailyStatApi = {
  getAll: () => api.get<DailyStat[]>("/dailyStats"),
  getByCampaignId: (campaignId: string) =>
    api.get<DailyStat[]>(`/dailyStats?campaignId=${campaignId}`),
  getByDateRange: (startDate: string, endDate: string) =>
    api.get<DailyStat[]>(`/dailyStats?date_gte=${startDate}&date_lte=${endDate}`),
};
