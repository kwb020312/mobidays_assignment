"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
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
} from "@/shared/ui";
import {
  STATUS_LABELS,
  PLATFORM_LABELS,
  ALL_STATUSES,
  type CampaignStatus,
} from "@/shared/types";
import { useDataStore } from "@/shared/stores";
import {
  formatCurrency,
  formatPercent,
  formatCPC,
  formatDateRange,
  cn,
} from "@/shared/lib";
import { useFilteredCampaigns } from "../hooks/useFilteredCampaigns";
import { STATUS_VARIANT } from "../constants";
import type { SortableColumn, SortState } from "../types";
import { PAGE_SIZE } from "../types";
import { CampaignRegistrationModal } from "./CampaignRegistrationModal";

export function CampaignTable() {
  const { data, isEmpty } = useFilteredCampaigns();
  const updateCampaign = useDataStore((state) => state.updateCampaign);

  // 테이블 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 검색 필터링
  const searchedData = searchQuery
    ? data.filter((row) =>
        row.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  // 정렬
  const sortedData = sortState.column
    ? [...searchedData].sort((a, b) => {
        const aVal = a[sortState.column!];
        const bVal = b[sortState.column!];

        // null 값 처리
        if (aVal === null && bVal === null) return 0;
        if (aVal === null) return 1;
        if (bVal === null) return -1;

        // 날짜 비교
        if (sortState.column === "startDate") {
          const comparison = (aVal as string).localeCompare(bVal as string);
          return sortState.direction === "asc" ? comparison : -comparison;
        }

        // 숫자 비교
        const comparison = (aVal as number) - (bVal as number);
        return sortState.direction === "asc" ? comparison : -comparison;
      })
    : searchedData;

  // 페이지네이션
  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 현재 페이지의 선택 상태
  const currentPageIds = new Set(paginatedData.map((row) => row.id));
  const allCurrentPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedIds.has(row.id));

  // 정렬 토글
  const handleSort = (column: SortableColumn) => {
    setSortState((prev) => {
      if (prev.column === column) {
        return {
          column,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { column, direction: "desc" };
    });
  };

  // 전체 선택 토글
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of currentPageIds) {
          next.add(id);
        }
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of currentPageIds) {
          next.delete(id);
        }
        return next;
      });
    }
  };

  // 개별 선택 토글
  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  // 일괄 상태 변경
  const handleBulkStatusChange = (status: CampaignStatus) => {
    for (const id of selectedIds) {
      updateCampaign(id, { status });
    }
    setSelectedIds(new Set());
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 검색 시 페이지 초기화
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // 정렬 가능한 헤더 렌더링
  const renderSortableHeader = (
    column: SortableColumn,
    label: string,
    width: string,
    align: "left" | "right" = "left"
  ) => (
    <TableHead
      className={cn(
        "cursor-pointer select-none hover:bg-muted/50",
        align === "right" && "text-right"
      )}
      style={{ width }}
      onClick={() => handleSort(column)}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1",
          align === "right" && "justify-end"
        )}
      >
        {label}
        <span className="inline-flex size-4 items-center justify-center">
          <ArrowUp
            className={cn(
              "size-3.5 shrink-0 transition-transform duration-200",
              sortState.column !== column && "text-muted-foreground/50",
              sortState.column === column &&
                sortState.direction === "desc" &&
                "rotate-180"
            )}
          />
        </span>
      </span>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>캠페인 목록</CardTitle>
            <CampaignRegistrationModal />
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="캠페인명 검색..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-48"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {searchedData.length} / {data.length}건
            </span>
          </div>
        </div>

        {/* 일괄 상태 변경 */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-sm text-muted-foreground">
            {selectedIds.size}개 선택됨
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
            onClick={() => setSelectedIds(new Set())}
          >
            선택 해제
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-[600px] flex-col">
          {isEmpty ? (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              선택한 조건에 해당하는 캠페인이 없습니다.
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: "4%" }}>
                      <Checkbox
                        checked={allCurrentPageSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead style={{ width: "20%" }}>캠페인명</TableHead>
                    <TableHead style={{ width: "8%" }}>상태</TableHead>
                    <TableHead style={{ width: "8%" }}>매체</TableHead>
                    {renderSortableHeader("startDate", "집행기간", "15%")}
                    {renderSortableHeader(
                      "totalCost",
                      "총 집행금액",
                      "15%",
                      "right"
                    )}
                    {renderSortableHeader("ctr", "CTR", "10%", "right")}
                    {renderSortableHeader("cpc", "CPC", "10%", "right")}
                    {renderSortableHeader("roas", "ROAS", "10%", "right")}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={
                        selectedIds.has(row.id) ? "selected" : undefined
                      }
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(row.id, checked === true)
                          }
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
                      <TableCell>{PLATFORM_LABELS[row.platform]}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDateRange(row.startDate, row.endDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(row.totalCost)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercent(row.ctr)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCPC(row.cpc)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPercent(row.roas)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 페이지네이션 - 하단 고정 */}
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
                >
                  이전
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
