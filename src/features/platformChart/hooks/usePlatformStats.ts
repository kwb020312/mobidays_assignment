"use client";

import {
  useFilterStore,
  selectEffectiveStatus,
  selectEffectivePlatform,
} from "@/features/filter";
import { useDataStore } from "@/shared/stores";
import {
  normalizeNumber,
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
  const campaigns = useDataStore((state) => state.campaigns);
  const dailyStats = useDataStore((state) => state.dailyStats);
  const isLoading = useDataStore((state) => state.isLoading);
  const error = useDataStore((state) => state.error);

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

  // 플랫폼별 집계
  const platformAggregation = new Map<Platform, PlatformAggregation>();

  for (const stat of filteredStats) {
    const platform = campaignPlatformMap.get(stat.campaignId);
    if (!platform) continue;

    const existing = platformAggregation.get(platform);
    if (existing) {
      existing.cost += normalizeNumber(stat.cost);
      existing.impressions += normalizeNumber(stat.impressions);
      existing.clicks += normalizeNumber(stat.clicks);
      existing.conversions += normalizeNumber(stat.conversions);
    } else {
      platformAggregation.set(platform, {
        cost: normalizeNumber(stat.cost),
        impressions: normalizeNumber(stat.impressions),
        clicks: normalizeNumber(stat.clicks),
        conversions: normalizeNumber(stat.conversions),
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
