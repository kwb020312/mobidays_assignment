"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui";
import { useFilterStore } from "../store";
import { STATUS_OPTIONS, PLATFORM_OPTIONS } from "../constants";
import { DateRangePicker } from "./DateRangePicker";
import { DatePresets } from "./DatePresets";
import { MultiSelect } from "./MultiSelect";

export function GlobalFilter() {
  const dateRange = useFilterStore((state) => state.dateRange);
  const status = useFilterStore((state) => state.status);
  const platform = useFilterStore((state) => state.platform);
  const setDateRange = useFilterStore((state) => state.setDateRange);
  const setStatus = useFilterStore((state) => state.setStatus);
  const setPlatform = useFilterStore((state) => state.setPlatform);
  const reset = useFilterStore((state) => state.reset);

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      {/* 필터 행 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">집행 기간</span>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">상태</span>
          <MultiSelect
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
            placeholder="전체"
          />
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">매체</span>
          <MultiSelect
            options={PLATFORM_OPTIONS}
            value={platform}
            onChange={setPlatform}
            placeholder="전체"
          />
        </div>

        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw data-icon="inline-start" className="size-4" />
            초기화
          </Button>
        </div>
      </div>

      {/* 날짜 프리셋 버튼 */}
      <DatePresets onChange={setDateRange} />
    </div>
  );
}
