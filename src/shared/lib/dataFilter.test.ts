import { describe, it, expect } from "vitest";
import {
  getFilteredCampaignIds,
  getFilteredCampaigns,
  filterDailyStatsByDate,
  getFilteredDailyStats,
  aggregateByCampaign,
} from "./dataFilter";
import type { Campaign, DailyStat } from "@/shared/types";

const mockCampaigns: Campaign[] = [
  {
    id: "GGL-001",
    name: "Google Campaign",
    platform: "Google",
    status: "active",
    budget: 1000000,
    startDate: "2026-03-01",
    endDate: "2026-03-31",
  },
  {
    id: "META-001",
    name: "Meta Campaign",
    platform: "Meta",
    status: "paused",
    budget: 500000,
    startDate: "2026-04-01",
    endDate: "2026-04-30",
  },
  {
    id: "NAVER-001",
    name: "Naver Campaign",
    platform: "Naver",
    status: "ended",
    budget: 300000,
    startDate: "2026-02-01",
    endDate: "2026-02-28",
  },
];

const mockDailyStats: DailyStat[] = [
  {
    id: "1",
    campaignId: "GGL-001",
    date: "2026-03-15",
    impressions: 1000,
    clicks: 50,
    conversions: 5,
    cost: 10000,
    conversionsValue: 50000,
  },
  {
    id: "2",
    campaignId: "GGL-001",
    date: "2026-03-16",
    impressions: 1200,
    clicks: 60,
    conversions: 6,
    cost: 12000,
    conversionsValue: 60000,
  },
  {
    id: "3",
    campaignId: "META-001",
    date: "2026-04-10",
    impressions: 800,
    clicks: 40,
    conversions: 4,
    cost: 8000,
    conversionsValue: null,
  },
];

describe("getFilteredCampaignIds", () => {
  it("상태 필터로 캠페인을 필터링한다", () => {
    const result = getFilteredCampaignIds({
      campaigns: mockCampaigns,
      dateRange: { from: new Date("2026-01-01"), to: new Date("2026-12-31") },
      effectiveStatus: new Set(["active"]),
      effectivePlatform: new Set(["Google", "Meta", "Naver"]),
    });
    expect(result.has("GGL-001")).toBe(true);
    expect(result.has("META-001")).toBe(false);
    expect(result.has("NAVER-001")).toBe(false);
  });

  it("플랫폼 필터로 캠페인을 필터링한다", () => {
    const result = getFilteredCampaignIds({
      campaigns: mockCampaigns,
      dateRange: { from: new Date("2026-01-01"), to: new Date("2026-12-31") },
      effectiveStatus: new Set(["active", "paused", "ended"]),
      effectivePlatform: new Set(["Google"]),
    });
    expect(result.has("GGL-001")).toBe(true);
    expect(result.has("META-001")).toBe(false);
    expect(result.has("NAVER-001")).toBe(false);
  });

  it("날짜 범위로 캠페인을 필터링한다", () => {
    const result = getFilteredCampaignIds({
      campaigns: mockCampaigns,
      dateRange: { from: new Date("2026-04-01"), to: new Date("2026-04-30") },
      effectiveStatus: new Set(["active", "paused", "ended"]),
      effectivePlatform: new Set(["Google", "Meta", "Naver"]),
    });
    expect(result.has("GGL-001")).toBe(false); // 3월 캠페인
    expect(result.has("META-001")).toBe(true); // 4월 캠페인
    expect(result.has("NAVER-001")).toBe(false); // 2월 캠페인
  });

  it("날짜 범위가 캠페인 기간과 부분적으로 겹치면 포함한다", () => {
    const result = getFilteredCampaignIds({
      campaigns: mockCampaigns,
      dateRange: { from: new Date("2026-03-15"), to: new Date("2026-04-15") },
      effectiveStatus: new Set(["active", "paused", "ended"]),
      effectivePlatform: new Set(["Google", "Meta", "Naver"]),
    });
    expect(result.has("GGL-001")).toBe(true); // 3월 (겹침)
    expect(result.has("META-001")).toBe(true); // 4월 (겹침)
    expect(result.has("NAVER-001")).toBe(false); // 2월 (겹치지 않음)
  });

  it("모든 필터 조건을 AND로 적용한다", () => {
    const result = getFilteredCampaignIds({
      campaigns: mockCampaigns,
      dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-31") },
      effectiveStatus: new Set(["active"]),
      effectivePlatform: new Set(["Google"]),
    });
    expect(result.size).toBe(1);
    expect(result.has("GGL-001")).toBe(true);
  });

  it("빈 캠페인 배열이면 빈 Set을 반환한다", () => {
    const result = getFilteredCampaignIds({
      campaigns: [],
      dateRange: { from: new Date("2026-01-01"), to: new Date("2026-12-31") },
      effectiveStatus: new Set(["active", "paused", "ended"]),
      effectivePlatform: new Set(["Google", "Meta", "Naver"]),
    });
    expect(result.size).toBe(0);
  });
});

describe("getFilteredCampaigns", () => {
  it("필터링된 캠페인 배열을 반환한다", () => {
    const result = getFilteredCampaigns({
      campaigns: mockCampaigns,
      dateRange: { from: new Date("2026-01-01"), to: new Date("2026-12-31") },
      effectiveStatus: new Set(["active"]),
      effectivePlatform: new Set(["Google", "Meta", "Naver"]),
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("GGL-001");
  });
});

describe("filterDailyStatsByDate", () => {
  it("날짜 범위 내의 통계만 반환한다", () => {
    const result = filterDailyStatsByDate(mockDailyStats, {
      from: new Date("2026-03-01"),
      to: new Date("2026-03-31"),
    });
    expect(result.length).toBe(2);
    expect(result.every((s) => s.campaignId === "GGL-001")).toBe(true);
  });

  it("범위 밖의 통계는 제외한다", () => {
    const result = filterDailyStatsByDate(mockDailyStats, {
      from: new Date("2026-05-01"),
      to: new Date("2026-05-31"),
    });
    expect(result.length).toBe(0);
  });
});

describe("getFilteredDailyStats", () => {
  it("캠페인 ID와 날짜 범위로 필터링한다", () => {
    const result = getFilteredDailyStats({
      dailyStats: mockDailyStats,
      filteredCampaignIds: new Set(["GGL-001"]),
      dateRange: { from: new Date("2026-03-01"), to: new Date("2026-03-31") },
    });
    expect(result.length).toBe(2);
    expect(result.every((s) => s.campaignId === "GGL-001")).toBe(true);
  });

  it("캠페인 ID가 없으면 빈 배열을 반환한다", () => {
    const result = getFilteredDailyStats({
      dailyStats: mockDailyStats,
      filteredCampaignIds: new Set(["UNKNOWN"]),
      dateRange: { from: new Date("2026-01-01"), to: new Date("2026-12-31") },
    });
    expect(result.length).toBe(0);
  });
});

describe("aggregateByCampaign", () => {
  it("캠페인별로 통계를 집계한다", () => {
    const result = aggregateByCampaign(mockDailyStats);
    const gglAgg = result.get("GGL-001");

    expect(gglAgg).toBeDefined();
    expect(gglAgg?.totalImpressions).toBe(2200);
    expect(gglAgg?.totalClicks).toBe(110);
    expect(gglAgg?.totalCost).toBe(22000);
    expect(gglAgg?.totalConversions).toBe(11);
    expect(gglAgg?.totalConversionsValue).toBe(110000);
  });

  it("conversionsValue가 null이면 0으로 처리한다", () => {
    const result = aggregateByCampaign(mockDailyStats);
    const metaAgg = result.get("META-001");

    expect(metaAgg).toBeDefined();
    expect(metaAgg?.totalConversionsValue).toBe(0);
  });

  it("빈 배열이면 빈 Map을 반환한다", () => {
    const result = aggregateByCampaign([]);
    expect(result.size).toBe(0);
  });

  it("여러 캠페인의 통계를 분리하여 집계한다", () => {
    const result = aggregateByCampaign(mockDailyStats);
    expect(result.size).toBe(2);
    expect(result.has("GGL-001")).toBe(true);
    expect(result.has("META-001")).toBe(true);
  });

  it("단일 통계도 정상 집계한다", () => {
    const singleStat: DailyStat[] = [
      {
        id: "1",
        campaignId: "TEST-001",
        date: "2026-01-01",
        impressions: 100,
        clicks: 10,
        conversions: 1,
        cost: 1000,
        conversionsValue: 5000,
      },
    ];
    const result = aggregateByCampaign(singleStat);
    const agg = result.get("TEST-001");

    expect(agg?.totalImpressions).toBe(100);
    expect(agg?.totalClicks).toBe(10);
    expect(agg?.totalConversions).toBe(1);
    expect(agg?.totalCost).toBe(1000);
    expect(agg?.totalConversionsValue).toBe(5000);
  });
});
