import { RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui";
import { useFilterStore } from "@/shared/stores";
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
    <div
      className="flex flex-col gap-3 rounded-lg border bg-card p-4"
      role="search"
      aria-label="캠페인 필터"
    >
      {/* 필터 행 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            id="date-range-label"
            className="text-sm font-medium text-muted-foreground"
          >
            집행 기간
          </span>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            aria-labelledby="date-range-label"
          />
        </div>

        <div className="h-6 w-px bg-border" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <span
            id="status-label"
            className="text-sm font-medium text-muted-foreground"
          >
            상태
          </span>
          <MultiSelect
            options={STATUS_OPTIONS}
            value={status}
            onChange={setStatus}
            placeholder="전체"
            aria-labelledby="status-label"
          />
        </div>

        <div className="h-6 w-px bg-border" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <span
            id="platform-label"
            className="text-sm font-medium text-muted-foreground"
          >
            매체
          </span>
          <MultiSelect
            options={PLATFORM_OPTIONS}
            value={platform}
            onChange={setPlatform}
            placeholder="전체"
            aria-labelledby="platform-label"
          />
        </div>

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            aria-label="필터 초기화"
          >
            <RotateCcw
              data-icon="inline-start"
              className="size-4"
              aria-hidden="true"
            />
            초기화
          </Button>
        </div>
      </div>

      {/* 날짜 프리셋 버튼 */}
      <DatePresets onChange={setDateRange} />
    </div>
  );
}
