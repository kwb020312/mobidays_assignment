"use client";

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
import { useCampaignStore } from "@/entities/campaign";
import { formatDateRange, cn } from "@/shared/lib";
import { formatCurrency, formatPercent, formatCPC } from "../lib/formatters";
import { useFilteredCampaigns } from "../hooks/useFilteredCampaigns";
import { useTableState } from "../hooks/useTableState";
import { STATUS_VARIANT } from "../constants";
import { CampaignRegistrationModal } from "./CampaignRegistrationModal";
import { SortableHeader } from "./SortableHeader";

export function CampaignTable() {
  const { data, isEmpty } = useFilteredCampaigns();
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
    for (const id of selectedIds) {
      updateCampaign(id, { status });
    }
    clearSelection();
  };

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
              {searchedCount} / {totalCount}건
            </span>
          </div>
        </div>

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
          <Button variant="ghost" size="sm" onClick={clearSelection}>
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
                        onCheckedChange={(checked) =>
                          selectMany(currentPageIds, checked === true)
                        }
                      />
                    </TableHead>
                    <TableHead style={{ width: "20%" }}>캠페인명</TableHead>
                    <TableHead style={{ width: "8%" }}>상태</TableHead>
                    <TableHead style={{ width: "8%" }}>매체</TableHead>
                    <SortableHeader column="startDate" label="집행기간" width="15%" sortState={sortState} onSort={handleSort} />
                    <SortableHeader column="totalCost" label="총 집행금액" width="15%" align="right" sortState={sortState} onSort={handleSort} />
                    <SortableHeader column="ctr" label="CTR" width="10%" align="right" sortState={sortState} onSort={handleSort} />
                    <SortableHeader column="cpc" label="CPC" width="10%" align="right" sortState={sortState} onSort={handleSort} />
                    <SortableHeader column="roas" label="ROAS" width="10%" align="right" sortState={sortState} onSort={handleSort} />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={selectedIds.has(row.id) ? "selected" : undefined}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={(checked) =>
                            toggleSelection(row.id, checked === true)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <span className="block truncate" title={row.name ?? undefined}>
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
                      <TableCell className="text-right">{formatCurrency(row.totalCost)}</TableCell>
                      <TableCell className="text-right">{formatPercent(row.ctr)}</TableCell>
                      <TableCell className="text-right">{formatCPC(row.cpc)}</TableCell>
                      <TableCell className="text-right">{formatPercent(row.roas)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
