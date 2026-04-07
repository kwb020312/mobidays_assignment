// 랭킹 메트릭 타입: ROAS, CTR, CPC
export type RankingMetric = "roas" | "ctr" | "cpc";

// 메트릭 옵션 정의
export interface RankingMetricOption {
  key: RankingMetric;
  label: string;
  unit: string;
  // ROAS/CTR은 높을수록 좋고, CPC는 낮을수록 좋음
  sortOrder: "desc" | "asc";
}

// 캠페인 랭킹 데이터
export interface CampaignRankingStat {
  campaignId: string;
  campaignName: string;
  value: number | null; // 메트릭 값 (null은 계산 불가)
  fill: string;
}
