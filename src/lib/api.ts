import type { Campaign, DailyStat } from '@/types/campaign';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

// 타입이 지정된 API 함수들
export const campaignApi = {
  getAll: () => api.get<Campaign[]>('/campaigns'),
  getById: (id: string) => api.get<Campaign>(`/campaigns/${id}`),
  create: (data: Omit<Campaign, 'id'>) => api.post<Campaign>('/campaigns', data),
  update: (id: string, data: Partial<Campaign>) => api.patch<Campaign>(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete<void>(`/campaigns/${id}`),
};

export const dailyStatApi = {
  getAll: () => api.get<DailyStat[]>('/dailyStats'),
  getByCampaignId: (campaignId: string) => api.get<DailyStat[]>(`/dailyStats?campaignId=${campaignId}`),
  getByDateRange: (startDate: string, endDate: string) =>
    api.get<DailyStat[]>(`/dailyStats?date_gte=${startDate}&date_lte=${endDate}`),
};
