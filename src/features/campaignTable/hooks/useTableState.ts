"use client";

import { useState, useEffect } from "react";
import { useFilterStore } from "@/shared/stores";
import type { SortableColumn, SortState, CampaignTableRow } from "../types";
import { PAGE_SIZE } from "../types";

interface UseTableStateOptions {
  data: CampaignTableRow[];
}

export function useTableState({ data }: UseTableStateOptions) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 글로벌 필터 상태 구독
  const dateRange = useFilterStore((state) => state.dateRange);
  const status = useFilterStore((state) => state.status);
  const platform = useFilterStore((state) => state.platform);

  // 글로벌 필터 변경 시 페이지와 선택 초기화
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [dateRange, status, platform]);

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

        if (aVal === null && bVal === null) return 0;
        if (aVal === null) return 1;
        if (bVal === null) return -1;

        if (sortState.column === "startDate") {
          const comparison = (aVal as string).localeCompare(bVal as string);
          return sortState.direction === "asc" ? comparison : -comparison;
        }

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

  // 현재 페이지 ID 목록
  const currentPageIds = new Set(paginatedData.map((row) => row.id));
  const allCurrentPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedIds.has(row.id));

  // 액션
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const toggleSelection = (id: string, checked: boolean) => {
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

  const selectMany = (ids: Iterable<string>, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      }
      return next;
    });
  };

  return {
    // 처리된 데이터
    paginatedData,
    searchedCount: searchedData.length,
    totalCount: data.length,
    totalPages,
    currentPageIds,
    allCurrentPageSelected,

    // 상태
    searchQuery,
    sortState,
    currentPage,
    selectedIds,

    // 액션
    handleSort,
    handleSearch,
    handlePageChange,
    clearSelection,
    toggleSelection,
    selectMany,
  };
}
