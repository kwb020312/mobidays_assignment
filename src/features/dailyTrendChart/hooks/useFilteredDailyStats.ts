"use client";

import { useState, useEffect } from "react";
import { parseISO, isWithinInterval } from "date-fns";
import {
  useFilterStore,
  selectEffectiveStatus,
  selectEffectivePlatform,
} from "@/features/filter";
import { campaignApi } from "@/entities/campaign";
import { dailyStatApi } from "@/entities/dailyStat";
import { normalizeDate, normalizeNumber } from "@/shared/lib";
import type { Campaign } from "@/entities/campaign";
import type { DailyStat } from "@/entities/dailyStat";
import type { AggregatedDailyStat } from "../types";

export function useFilteredDailyStats() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const dateRange = useFilterStore((state) => state.dateRange);
  const effectiveStatus = useFilterStore(selectEffectiveStatus);
  const effectivePlatform = useFilterStore(selectEffectivePlatform);

  // API 데이터 로드
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const [campaignsData, dailyStatsData] = await Promise.all([
          campaignApi.getAll(),
          dailyStatApi.getAll(),
        ]);
        setCampaigns(campaignsData);
        setDailyStats(dailyStatsData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("데이터 로드 실패"));
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // 필터링된 캠페인 ID 목록
  const filteredCampaignIds = new Set(
    campaigns
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
          : new Date(2099, 11, 31); // 종료일 없으면 무한대로 간주

        // 기간이 겹치는지 확인
        const hasOverlap =
          campaignStart <= dateRange.to && campaignEnd >= dateRange.from;

        return hasOverlap;
      })
      .map((c) => c.id)
  );

  // 필터링된 일별 데이터를 날짜별로 집계
  const dateMap = new Map<string, AggregatedDailyStat>();

  for (const stat of dailyStats) {
    // 캠페인 ID 필터
    if (!filteredCampaignIds.has(stat.campaignId)) continue;

    // 날짜가 없으면 스킵
    const normalizedDate = normalizeDate(stat.date);
    if (!normalizedDate) continue;

    // 날짜 필터
    const statDate = parseISO(normalizedDate);
    if (
      !isWithinInterval(statDate, { start: dateRange.from, end: dateRange.to })
    ) {
      continue;
    }
    const existing = dateMap.get(normalizedDate);

    if (existing) {
      existing.impressions += normalizeNumber(stat.impressions);
      existing.clicks += normalizeNumber(stat.clicks);
      existing.conversions += normalizeNumber(stat.conversions);
      existing.cost += normalizeNumber(stat.cost);
    } else {
      dateMap.set(normalizedDate, {
        date: normalizedDate,
        impressions: normalizeNumber(stat.impressions),
        clicks: normalizeNumber(stat.clicks),
        conversions: normalizeNumber(stat.conversions),
        cost: normalizeNumber(stat.cost),
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
