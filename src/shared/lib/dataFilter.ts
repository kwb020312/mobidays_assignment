import { parseISO, isWithinInterval } from "date-fns";
import type { Campaign, DailyStat, Platform, CampaignStatus } from "@/shared/types";

export interface CampaignFilterParams {
  campaigns: Campaign[];
  dateRange: { from: Date; to: Date };
  effectiveStatus: Set<CampaignStatus>;
  effectivePlatform: Set<Platform>;
}

export interface DailyStatFilterParams {
  dailyStats: DailyStat[];
  filteredCampaignIds: Set<string>;
  dateRange: { from: Date; to: Date };
}

/**
 * 필터 조건에 맞는 캠페인 ID Set을 반환
 * (API 레이어에서 정규화 완료됨)
 */
export function getFilteredCampaignIds({
  campaigns,
  dateRange,
  effectiveStatus,
  effectivePlatform,
}: CampaignFilterParams): Set<string> {
  const filteredIds = new Set<string>();

  for (const campaign of campaigns) {
    // 상태 필터
    if (!effectiveStatus.has(campaign.status)) continue;
    // 플랫폼 필터
    if (!effectivePlatform.has(campaign.platform)) continue;

    // 집행 기간 필터: 캠페인 기간과 필터 기간이 겹치는지 확인
    const campaignStart = parseISO(campaign.startDate);
    const campaignEnd = campaign.endDate
      ? parseISO(campaign.endDate)
      : new Date(2099, 11, 31);

    const hasOverlap =
      campaignStart <= dateRange.to && campaignEnd >= dateRange.from;

    if (hasOverlap) {
      filteredIds.add(campaign.id);
    }
  }

  return filteredIds;
}

/**
 * 필터 조건에 맞는 캠페인 배열을 반환
 */
export function getFilteredCampaigns(
  params: CampaignFilterParams
): Campaign[] {
  const filteredIds = getFilteredCampaignIds(params);
  return params.campaigns.filter((c) => filteredIds.has(c.id));
}

/**
 * 날짜 범위 내의 DailyStat만 필터링
 * (API 레이어에서 정규화 완료됨)
 */
export function filterDailyStatsByDate(
  dailyStats: DailyStat[],
  dateRange: { from: Date; to: Date }
): DailyStat[] {
  return dailyStats.filter((stat) => {
    const statDate = parseISO(stat.date);
    return isWithinInterval(statDate, { start: dateRange.from, end: dateRange.to });
  });
}

/**
 * 필터링된 캠페인 ID와 날짜 범위로 DailyStat 필터링
 * (API 레이어에서 정규화 완료됨)
 */
export function getFilteredDailyStats({
  dailyStats,
  filteredCampaignIds,
  dateRange,
}: DailyStatFilterParams): DailyStat[] {
  return dailyStats.filter((stat) => {
    if (!filteredCampaignIds.has(stat.campaignId)) return false;
    const statDate = parseISO(stat.date);
    return isWithinInterval(statDate, { start: dateRange.from, end: dateRange.to });
  });
}

// 캠페인별 집계 결과 타입
export interface CampaignAggregation {
  campaignId: string;
  totalCost: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalConversionsValue: number;
}

/**
 * DailyStat 배열을 캠페인별로 집계
 * (API 레이어에서 Zod 스키마로 정규화 완료됨)
 */
export function aggregateByCampaign(
  dailyStats: DailyStat[]
): Map<string, CampaignAggregation> {
  const aggregation = new Map<string, CampaignAggregation>();

  for (const stat of dailyStats) {
    const existing = aggregation.get(stat.campaignId);
    const conversionsValue = stat.conversionsValue ?? 0;

    if (existing) {
      existing.totalCost += stat.cost;
      existing.totalImpressions += stat.impressions;
      existing.totalClicks += stat.clicks;
      existing.totalConversions += stat.conversions;
      existing.totalConversionsValue += conversionsValue;
    } else {
      aggregation.set(stat.campaignId, {
        campaignId: stat.campaignId,
        totalCost: stat.cost,
        totalImpressions: stat.impressions,
        totalClicks: stat.clicks,
        totalConversions: stat.conversions,
        totalConversionsValue: conversionsValue,
      });
    }
  }

  return aggregation;
}
