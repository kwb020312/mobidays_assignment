"use client";

import {
  useFilterStore,
  selectEffectiveStatus,
  selectEffectivePlatform,
} from "@/shared/stores";
import { useCampaignStore } from "@/entities/campaign";
import { useDailyStatStore } from "@/entities/dailyStat";
import {
  getFilteredCampaigns,
  getFilteredDailyStats,
  getFilteredCampaignIds,
} from "@/shared/lib";
import type { Platform } from "@/shared/types";
import type { PlatformMetric, PlatformStat } from "../types";
import { PLATFORM_COLORS } from "../constants";

interface PlatformAggregation {
  cost: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export function usePlatformStats(metric: PlatformMetric) {
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

  // 공통 유틸로 필터링된 캠페인 조회
  const filteredCampaignList = getFilteredCampaigns({
    campaigns,
    dateRange,
    effectiveStatus,
    effectivePlatform,
  });

  // 캠페인 ID -> 플랫폼 매핑
  const campaignPlatformMap = new Map<string, Platform>();
  for (const campaign of filteredCampaignList) {
    campaignPlatformMap.set(campaign.id, campaign.platform);
  }

  // 공통 유틸로 필터링된 일별 데이터 조회
  const filteredCampaignIds = getFilteredCampaignIds({
    campaigns,
    dateRange,
    effectiveStatus,
    effectivePlatform,
  });

  const filteredStats = getFilteredDailyStats({
    dailyStats,
    filteredCampaignIds,
    dateRange,
  });

  // 플랫폼별 집계 (API 레이어에서 정규화 완료됨)
  const platformAggregation = new Map<Platform, PlatformAggregation>();

  for (const stat of filteredStats) {
    const platform = campaignPlatformMap.get(stat.campaignId);
    if (!platform) continue;

    const existing = platformAggregation.get(platform);
    if (existing) {
      existing.cost += stat.cost;
      existing.impressions += stat.impressions;
      existing.clicks += stat.clicks;
      existing.conversions += stat.conversions;
    } else {
      platformAggregation.set(platform, {
        cost: stat.cost,
        impressions: stat.impressions,
        clicks: stat.clicks,
        conversions: stat.conversions,
      });
    }
  }

  // 전체 합계 계산
  let total = 0;
  for (const agg of platformAggregation.values()) {
    total += agg[metric];
  }

  // PlatformStat 배열로 변환
  const data: PlatformStat[] = [];
  for (const [platform, agg] of platformAggregation) {
    const value = agg[metric];
    data.push({
      platform,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
      fill: PLATFORM_COLORS[platform],
    });
  }

  // 값 기준 내림차순 정렬
  data.sort((a, b) => b.value - a.value);

  return {
    data,
    total,
    isLoading,
    error,
    isEmpty: data.length === 0,
  };
}
