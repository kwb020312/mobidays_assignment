"use client";

import {
  useFilterStore,
  selectEffectiveStatus,
  selectEffectivePlatform,
} from "@/shared/stores";
import { useCampaignStore } from "@/entities/campaign";
import { useDailyStatStore } from "@/entities/dailyStat";
import { getFilteredCampaigns, filterDailyStatsByDate } from "@/shared/lib";
import type { DailyStat } from "@/shared/types";
import type { CampaignTableRow } from "../types";
import {
  aggregateMetrics,
  calculateCTR,
  calculateCPC,
  calculateROAS,
} from "../lib/calculations";

export function useFilteredCampaigns() {
  const campaigns = useCampaignStore((state) => state.campaigns);
  const dailyStats = useDailyStatStore((state) => state.dailyStats);

  // 훅은 항상 동일한 순서로 호출되어야 함 (React Hooks 규칙)
  const campaignLoading = useCampaignStore((state) => state.isLoading);
  const dailyStatLoading = useDailyStatStore((state) => state.isLoading);
  const campaignError = useCampaignStore((state) => state.error);
  const dailyStatError = useDailyStatStore((state) => state.error);

  const isLoading = campaignLoading || dailyStatLoading;
  const error = campaignError || dailyStatError;

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
        startDate: campaign.startDate,
        endDate: campaign.endDate,
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
