"use client";

import {
  useFilterStore,
  selectEffectiveStatus,
  selectEffectivePlatform,
} from "@/shared/stores";
import { useCampaignStore } from "@/entities/campaign";
import { useDailyStatStore } from "@/entities/dailyStat";
import { getFilteredCampaignIds, getFilteredDailyStats } from "@/shared/lib";
import type { AggregatedDailyStat } from "../types";

export function useFilteredDailyStats() {
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

  // 공통 유틸로 필터링된 캠페인 ID 조회
  const filteredCampaignIds = getFilteredCampaignIds({
    campaigns,
    dateRange,
    effectiveStatus,
    effectivePlatform,
  });

  // 공통 유틸로 필터링된 일별 데이터 조회
  const filteredStats = getFilteredDailyStats({
    dailyStats,
    filteredCampaignIds,
    dateRange,
  });

  // 날짜별로 집계 (API 레이어에서 정규화 완료됨)
  const dateMap = new Map<string, AggregatedDailyStat>();

  for (const stat of filteredStats) {
    const existing = dateMap.get(stat.date);

    if (existing) {
      existing.impressions += stat.impressions;
      existing.clicks += stat.clicks;
    } else {
      dateMap.set(stat.date, {
        date: stat.date,
        impressions: stat.impressions,
        clicks: stat.clicks,
      });
    }
  }

  // 날짜순 정렬
  const aggregatedData = Array.from(dateMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return {
    data: aggregatedData,
    isLoading,
    error,
    isEmpty: aggregatedData.length === 0,
  };
}
