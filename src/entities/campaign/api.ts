import { api } from "@/shared/api";
import type { Campaign } from "./types";

export const campaignApi = {
  getAll: () => api.get<Campaign[]>("/campaigns"),
  getById: (id: string) => api.get<Campaign>(`/campaigns/${id}`),
  create: (data: Omit<Campaign, "id">) =>
    api.post<Campaign>("/campaigns", data),
  update: (id: string, data: Partial<Campaign>) =>
    api.patch<Campaign>(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete<void>(`/campaigns/${id}`),
};
