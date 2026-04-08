import { api } from "@/shared/api";
import { parseArray } from "@/entities/lib/parseArray";
import type { DailyStat } from "./types";
import { dailyStatSchema } from "./schema";

export const dailyStatApi = {
  getAll: async (): Promise<DailyStat[]> => {
    const raw = await api.get<unknown[]>("/daily_stats");
    return parseArray(dailyStatSchema, raw);
  },
  getByCampaignId: async (campaignId: string): Promise<DailyStat[]> => {
    const raw = await api.get<unknown[]>(
      `/daily_stats?campaignId=${campaignId}`
    );
    return parseArray(dailyStatSchema, raw);
  },
  getByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<DailyStat[]> => {
    const raw = await api.get<unknown[]>(
      `/daily_stats?date_gte=${startDate}&date_lte=${endDate}`
    );
    return parseArray(dailyStatSchema, raw);
  },
};
