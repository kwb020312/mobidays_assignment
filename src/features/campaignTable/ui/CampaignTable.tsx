"use client";

import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Input,
  Badge,
  Checkbox,
  Select,
  Button,
  Skeleton,
} from "@/shared/ui";
import {
  STATUS_LABELS,
  PLATFORM_LABELS,
  ALL_STATUSES,
  type CampaignStatus,
} from "@/shared/types";
import { useCampaignStore } from "@/entities/campaign";
import { formatDateRange, cn } from "@/shared/lib";
import { formatCurrency, formatPercent, formatCPC } from "../lib/formatters";
import { useFilteredCampaigns } from "../hooks/useFilteredCampaigns";
import { useTableState } from "../hooks/useTableState";
import { STATUS_VARIANT } from "../constants";
import { CampaignRegistrationModal } from "./CampaignRegistrationModal";
import { SortableHeader } from "./SortableHeader";

export function CampaignTable() {
  const { data, isEmpty, isLoading } = useFilteredCampaigns();
  const updateCampaign = useCampaignStore((state) => state.updateCampaign);

  const {
    paginatedData,
    searchedCount,
    totalCount,
    totalPages,
    currentPageIds,
    allCurrentPageSelected,
    searchQuery,
    sortState,
    currentPage,
    selectedIds,
    handleSort,
    handleSearch,
    handlePageChange,
    clearSelection,
    toggleSelection,
    selectMany,
  } = useTableState({ data });

  const handleBulkStatusChange = (status: CampaignStatus) => {
    const count = selectedIds.size;
    if (count === 0) {
      toast.warning("선택된 캠페인 없음", {
        description: "상태를 변경할 캠페인을 선택해주세요.",
      });
      return;
    }

    for (const id of selectedIds) {
      updateCampaign(id, { status });
    }
    clearSelection();
    toast.success("상태 변경 완료", {
      description: `${count}개 캠페인이 "${STATUS_LABELS[status]}" 상태로 변경되었습니다.`,
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        {/* 모바일: 타이틀 + 건수 / 데스크톱: 타이틀 + 등록 | 검색 + 건수 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between sm:justify-start sm:gap-3">
            <CardTitle>캠페인 목록</CardTitle>
            <span className="text-sm text-muted-foreground sm:hidden">
              {searchedCount} / {totalCount}건
            </span>
            <div className="hidden sm:block">
              <CampaignRegistrationModal />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="캠페인명 검색..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 sm:w-48 sm:flex-none"
              aria-label="캠페인명 검색"
            />
            <span className="hidden text-sm text-muted-foreground whitespace-nowrap sm:inline">
              {searchedCount} / {totalCount}건
            </span>
          </div>
        </div>

        {/* 모바일: 등록 + 선택/상태변경을 한 줄에 / 데스크톱: 선택/상태변경만 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="sm:hidden">
            <CampaignRegistrationModal />
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none sm:justify-start">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {selectedIds.size}개 선택
            </span>
            <Select
              options={ALL_STATUSES.map((s) => ({
                value: s,
                label: STATUS_LABELS[s],
              }))}
              placeholder="상태 변경"
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkStatusChange(e.target.value as CampaignStatus);
                }
              }}
              value=""
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="hidden sm:inline-flex"
            >
              선택 해제
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="sm:hidden"
              aria-label="선택 해제"
            >
              해제
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* 모바일 스크롤 힌트 */}
        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground sm:hidden">
          <span aria-hidden="true">←</span>
          <span>좌우로 스크롤하세요</span>
          <span aria-hidden="true">→</span>
        </div>

        <div className="flex min-h-[700px] flex-col overflow-y-hidden contain-[layout]">
          {isLoading ? (
            <div className="flex flex-1 flex-col overflow-x-auto">
              <Table className="min-w-[800px] table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: 40 }}>
                      <Skeleton className="h-4 w-4" />
                    </TableHead>
                    <TableHead style={{ width: 180 }}>
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                    <TableHead style={{ width: 80 }}>
                      <Skeleton className="h-4 w-10" />
                    </TableHead>
                    <TableHead style={{ width: 70 }}>
                      <Skeleton className="h-4 w-10" />
                    </TableHead>
                    <TableHead style={{ width: 140 }}>
                      <Skeleton className="h-4 w-14" />
                    </TableHead>
                    <TableHead style={{ width: 120 }}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead style={{ width: 70 }}>
                      <Skeleton className="h-4 w-10" />
                    </TableHead>
                    <TableHead style={{ width: 80 }}>
                      <Skeleton className="h-4 w-10" />
                    </TableHead>
                    <TableHead style={{ width: 70 }}>
                      <Skeleton className="h-4 w-10" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i} className="h-14">
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-14 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="ml-auto h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="ml-auto h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="ml-auto h-4 w-14" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="ml-auto h-4 w-12" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              선택한 조건에 해당하는 캠페인이 없습니다.
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <div className="h-[620px] overflow-x-auto">
                <Table
                  className="min-w-[800px] table-fixed"
                  srCaption="캠페인 목록 테이블 - 좌우로 스크롤하여 더 많은 정보를 확인할 수 있습니다"
                >
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: 40 }}>
                        <Checkbox
                          checked={allCurrentPageSelected}
                          onCheckedChange={(checked) =>
                            selectMany(currentPageIds, checked === true)
                          }
                          aria-label="현재 페이지 전체 선택"
                        />
                      </TableHead>
                      <TableHead style={{ width: 180 }}>캠페인명</TableHead>
                      <TableHead style={{ width: 80 }}>상태</TableHead>
                      <TableHead style={{ width: 70 }}>매체</TableHead>
                      <SortableHeader
                        column="startDate"
                        label="집행기간"
                        width={140}
                        sortState={sortState}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        column="totalCost"
                        label="총 집행금액"
                        width={120}
                        align="right"
                        sortState={sortState}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        column="ctr"
                        label="CTR"
                        width={70}
                        align="right"
                        sortState={sortState}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        column="cpc"
                        label="CPC"
                        width={80}
                        align="right"
                        sortState={sortState}
                        onSort={handleSort}
                      />
                      <SortableHeader
                        column="roas"
                        label="ROAS"
                        width={70}
                        align="right"
                        sortState={sortState}
                        onSort={handleSort}
                      />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((row) => (
                      <TableRow
                        key={row.id}
                        className="h-14"
                        data-state={
                          selectedIds.has(row.id) ? "selected" : undefined
                        }
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(row.id)}
                            onCheckedChange={(checked) =>
                              toggleSelection(row.id, checked === true)
                            }
                            aria-label={`${row.name || "캠페인"} 선택`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <span
                            className="block truncate"
                            title={row.name ?? undefined}
                          >
                            {row.name || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_VARIANT[row.status]}>
                            {STATUS_LABELS[row.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {PLATFORM_LABELS[row.platform]}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDateRange(row.startDate, row.endDate)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right">
                          {formatCurrency(row.totalCost)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right">
                          {formatPercent(row.ctr)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right">
                          {formatCPC(row.cpc)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right">
                          {formatPercent(row.roas)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div
                className={cn(
                  "mt-auto flex items-center justify-center gap-2 pt-4",
                  totalPages <= 1 && "invisible"
                )}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="이전 페이지로 이동"
                >
                  이전
                </Button>
                <span
                  className="text-sm text-muted-foreground"
                  aria-live="polite"
                >
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="다음 페이지로 이동"
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
