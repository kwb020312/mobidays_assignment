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
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        {/* 집행 기간 */}
        <div className="flex items-center justify-between gap-2 md:justify-start">
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

        <div
          className="hidden h-6 w-px bg-border md:block"
          aria-hidden="true"
        />

        {/* 상태 */}
        <div className="flex items-center justify-between gap-2 md:justify-start">
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

        <div
          className="hidden h-6 w-px bg-border md:block"
          aria-hidden="true"
        />

        {/* 매체 */}
        <div className="flex items-center justify-between gap-2 md:justify-start">
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

        {/* 초기화 버튼 */}
        <div className="md:ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="w-full md:w-auto"
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

      {/* 날짜 프리셋 버튼 - 모바일에서 숨김 */}
      <div className="hidden md:block">
        <DatePresets onChange={setDateRange} />
      </div>
    </div>
  );
}
