import type { Campaign } from "@/entities/campaign";
import type { CampaignStatus } from "@/shared/types";

// 테이블에 표시할 캠페인 데이터 (집계된 지표 포함)
export interface CampaignTableRow {
  id: string;
  name: string;
  status: CampaignStatus;
  platform: Campaign["platform"];
  startDate: string;
  endDate: string | null;
  totalCost: number;      // 총 집행금액
  ctr: number | null;     // CTR (%)
  cpc: number | null;     // CPC (원)
  roas: number | null;    // ROAS (%)
}

// 정렬 가능한 컬럼
export type SortableColumn = "startDate" | "totalCost" | "ctr" | "cpc" | "roas";

// 정렬 방향
export type SortDirection = "asc" | "desc";

// 정렬 상태
export interface SortState {
  column: SortableColumn | null;
  direction: SortDirection;
}

// 테이블 상태
export interface TableState {
  searchQuery: string;
  sortState: SortState;
  currentPage: number;
  selectedIds: Set<string>;
}

// 페이지당 항목 수
export const PAGE_SIZE = 10;
