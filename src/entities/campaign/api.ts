import { api } from "@/shared/api";
import { parseArray } from "@/shared/lib/formatters";
import type { Campaign } from "./types";
import { campaignSchema } from "./schema";

export const campaignApi = {
  getAll: async (): Promise<Campaign[]> => {
    const raw = await api.get<unknown[]>("/campaigns");
    return parseArray(campaignSchema, raw);
  },
  getById: (id: string) => api.get<Campaign>(`/campaigns/${id}`),
  create: (data: Omit<Campaign, "id">) =>
    api.post<Campaign>("/campaigns", data),
  update: (id: string, data: Partial<Campaign>) =>
    api.patch<Campaign>(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete<void>(`/campaigns/${id}`),
};
