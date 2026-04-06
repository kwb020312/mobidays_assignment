"use client";

import { parseISO, isWithinInterval } from "date-fns";
import {
  useFilterStore,
  selectEffectiveStatus,
  selectEffectivePlatform,
} from "@/features/filter";
import { useDataStore } from "@/shared/stores";
import { normalizeDate } from "@/shared/lib";
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

  // campaignId별로 dailyStats 그룹화 (날짜 필터 적용)
  const statsByCampaignId = new Map<string, DailyStat[]>();
  for (const stat of dailyStats) {
    const normalizedDate = normalizeDate(stat.date);
    if (!normalizedDate) continue;

    // 날짜 필터
    const statDate = parseISO(normalizedDate);
    if (
      !isWithinInterval(statDate, { start: dateRange.from, end: dateRange.to })
    ) {
      continue;
    }

    const existing = statsByCampaignId.get(stat.campaignId);
    if (existing) {
      existing.push(stat);
    } else {
      statsByCampaignId.set(stat.campaignId, [stat]);
    }
  }

  const tableData: CampaignTableRow[] = campaigns
    .filter((campaign) => {
      // 상태 필터
      if (!effectiveStatus.has(campaign.status)) return false;
      // 플랫폼 필터
      if (!effectivePlatform.has(campaign.platform)) return false;

      // 시작일이 없으면 필터에서 제외
      const normalizedStartDate = normalizeDate(campaign.startDate);
      if (!normalizedStartDate) return false;

      // 집행 기간 필터: 캠페인 기간과 필터 기간이 겹치는지 확인
      const campaignStart = parseISO(normalizedStartDate);
      const normalizedEndDate = normalizeDate(campaign.endDate);
      const campaignEnd = normalizedEndDate
        ? parseISO(normalizedEndDate)
        : new Date(2099, 11, 31);

      const hasOverlap =
        campaignStart <= dateRange.to && campaignEnd >= dateRange.from;

      return hasOverlap;
    })
    .map((campaign): CampaignTableRow => {
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
    });

  return {
    data: tableData,
    isLoading,
    error,
    isEmpty: tableData.length === 0,
  };
}
