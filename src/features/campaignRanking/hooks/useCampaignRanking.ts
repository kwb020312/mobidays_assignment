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
  aggregateByCampaign,
  calculateCTR,
  calculateCPC,
  calculateROAS,
} from "@/shared/lib";
import type { CampaignAggregation } from "@/shared/lib";
import type { RankingMetric, CampaignRankingStat } from "../types";
import { RANKING_METRIC_OPTIONS, RANKING_COLORS } from "../constants";

export function useCampaignRanking(metric: RankingMetric) {
  const campaigns = useCampaignStore((state) => state.campaigns);
  const dailyStats = useDailyStatStore((state) => state.dailyStats);
  const isLoading = useCampaignStore((state) => state.isLoading) || useDailyStatStore((state) => state.isLoading);
  const error = useCampaignStore((state) => state.error) || useDailyStatStore((state) => state.error);

  const dateRange = useFilterStore((state) => state.dateRange);
  const effectiveStatus = useFilterStore(selectEffectiveStatus);
  const effectivePlatform = useFilterStore(selectEffectivePlatform);

  // 필터링된 캠페인 조회 (이름 매핑용)
  const filteredCampaignList = getFilteredCampaigns({
    campaigns,
    dateRange,
    effectiveStatus,
    effectivePlatform,
  });

  // 캠페인 ID -> 이름 매핑
  const campaignNameMap = new Map<string, string>();
  for (const campaign of filteredCampaignList) {
    campaignNameMap.set(campaign.id, campaign.name);
  }

  // 필터링된 일별 데이터 조회
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

  // 캠페인별 집계
  const aggregation = aggregateByCampaign(filteredStats);

  // 메트릭 계산 함수
  function calculateMetricValue(agg: CampaignAggregation): number | null {
    switch (metric) {
      case "ctr":
        return calculateCTR(agg.totalClicks, agg.totalImpressions);
      case "cpc":
        return calculateCPC(agg.totalCost, agg.totalClicks);
      case "roas":
        return calculateROAS(agg.totalConversionsValue, agg.totalCost);
      default:
        return null;
    }
  }

  // 메트릭 옵션에서 정렬 방향 가져오기
  const metricOption = RANKING_METRIC_OPTIONS.find((opt) => opt.key === metric);
  const sortOrder = metricOption?.sortOrder ?? "desc";

  // CampaignRankingStat 배열로 변환 (값이 있는 것만)
  const allData: CampaignRankingStat[] = [];
  for (const agg of aggregation.values()) {
    const value = calculateMetricValue(agg);
    const campaignName = campaignNameMap.get(agg.campaignId);
    // null 값 또는 이름이 없는 캠페인은 랭킹에서 제외
    if (value !== null && campaignName) {
      allData.push({
        campaignId: agg.campaignId,
        campaignName,
        value,
        fill: "",
      });
    }
  }

  // 정렬: ROAS/CTR은 내림차순(높을수록 좋음), CPC는 오름차순(낮을수록 좋음)
  allData.sort((a, b) => {
    if (sortOrder === "desc") {
      return (b.value ?? 0) - (a.value ?? 0);
    } else {
      return (a.value ?? 0) - (b.value ?? 0);
    }
  });

  // 상위 3개만 선택하고 색상 할당
  const top3 = allData.slice(0, 3).map((item, index) => ({
    ...item,
    fill: RANKING_COLORS[index] || RANKING_COLORS[0],
  }));

  return {
    data: top3,
    isLoading,
    error,
    isEmpty: top3.length === 0,
    metricOption,
  };
}
