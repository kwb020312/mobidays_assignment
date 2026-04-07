import { parseISO, isWithinInterval } from "date-fns";
import type { Campaign } from "@/entities/campaign";
import type { DailyStat } from "@/entities/dailyStat";
import type { Platform, CampaignStatus } from "@/shared/types";
import { normalizeDate } from "./formatters";

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

    // 시작일이 없으면 제외
    const normalizedStartDate = normalizeDate(campaign.startDate);
    if (!normalizedStartDate) continue;

    // 집행 기간 필터: 캠페인 기간과 필터 기간이 겹치는지 확인
    const campaignStart = parseISO(normalizedStartDate);
    const normalizedEndDate = normalizeDate(campaign.endDate);
    const campaignEnd = normalizedEndDate
      ? parseISO(normalizedEndDate)
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
 */
export function filterDailyStatsByDate(
  dailyStats: DailyStat[],
  dateRange: { from: Date; to: Date }
): DailyStat[] {
  return dailyStats.filter((stat) => {
    const normalizedDate = normalizeDate(stat.date);
    if (!normalizedDate) return false;

    const statDate = parseISO(normalizedDate);
    return isWithinInterval(statDate, { start: dateRange.from, end: dateRange.to });
  });
}

/**
 * 필터링된 캠페인 ID와 날짜 범위로 DailyStat 필터링
 */
export function getFilteredDailyStats({
  dailyStats,
  filteredCampaignIds,
  dateRange,
}: DailyStatFilterParams): DailyStat[] {
  return dailyStats.filter((stat) => {
    if (!filteredCampaignIds.has(stat.campaignId)) return false;

    const normalizedDate = normalizeDate(stat.date);
    if (!normalizedDate) return false;

    const statDate = parseISO(normalizedDate);
    return isWithinInterval(statDate, { start: dateRange.from, end: dateRange.to });
  });
}
