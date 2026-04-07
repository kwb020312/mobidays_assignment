"use client";

import {
  useFilterStore,
  selectEffectiveStatus,
  selectEffectivePlatform,
} from "@/features/filter";
import { useDataStore } from "@/shared/stores";
import {
  normalizeDate,
  getFilteredCampaigns,
  filterDailyStatsByDate,
} from "@/shared/lib";
import type { DailyStat } from "@/entities/dailyStat";
import type { CampaignTableRow } from "../types";
import {
  aggregateMetrics,
  calculateCTR,
  calculateCPC,
  calculateROAS,
} from "../lib/calculations";

export function useFilteredCampaigns() {
  const campaigns = useDataStore((state) => state.campaigns);
  const dailyStats = useDataStore((state) => state.dailyStats);
  const isLoading = useDataStore((state) => state.isLoading);
  const error = useDataStore((state) => state.error);

  const dateRange = useFilterStore((state) => state.dateRange);
  const effectiveStatus = useFilterStore(selectEffectiveStatus);
  const effectivePlatform = useFilterStore(selectEffectivePlatform);

  // 날짜 필터 적용된 dailyStats
  const filteredDailyStats = filterDailyStatsByDate(dailyStats, dateRange);

  // campaignId별로 dailyStats 그룹화
  const statsByCampaignId = new Map<string, DailyStat[]>();
  for (const stat of filteredDailyStats) {
    const existing = statsByCampaignId.get(stat.campaignId);
    if (existing) {
      existing.push(stat);
    } else {
      statsByCampaignId.set(stat.campaignId, [stat]);
    }
  }

  // 공통 유틸로 필터링된 캠페인 조회
  const filteredCampaignList = getFilteredCampaigns({
    campaigns,
    dateRange,
    effectiveStatus,
    effectivePlatform,
  });

  const tableData: CampaignTableRow[] = filteredCampaignList.map(
    (campaign): CampaignTableRow => {
      const stats = statsByCampaignId.get(campaign.id) || [];
      const metrics = aggregateMetrics(stats);

      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        platform: campaign.platform,
        startDate: normalizeDate(campaign.startDate) || campaign.startDate,
        endDate: normalizeDate(campaign.endDate),
        totalCost: metrics.totalCost,
        ctr: calculateCTR(metrics.totalClicks, metrics.totalImpressions),
        cpc: calculateCPC(metrics.totalCost, metrics.totalClicks),
        roas: calculateROAS(metrics.totalConversionsValue, metrics.totalCost),
      };
    }
  );

  return {
    data: tableData,
    isLoading,
    error,
    isEmpty: tableData.length === 0,
  };
}
