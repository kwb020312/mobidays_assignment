"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui";
import { STATUS_LABELS, PLATFORM_LABELS } from "@/shared/types";
import type { CampaignStatus, Platform } from "@/shared/types";
import { useFilterStore } from "../store";
import { DateRangePicker } from "./DateRangePicker";
import { MultiSelect, type MultiSelectOption } from "./MultiSelect";

const STATUS_OPTIONS: MultiSelectOption<CampaignStatus>[] = [
  { value: "active", label: STATUS_LABELS.active },
  { value: "paused", label: STATUS_LABELS.paused },
  { value: "ended", label: STATUS_LABELS.ended },
];

const PLATFORM_OPTIONS: MultiSelectOption<Platform>[] = [
  { value: "Google", label: PLATFORM_LABELS.Google },
  { value: "Meta", label: PLATFORM_LABELS.Meta },
  { value: "Naver", label: PLATFORM_LABELS.Naver },
];

export function GlobalFilter() {
  const dateRange = useFilterStore((state) => state.dateRange);
  const status = useFilterStore((state) => state.status);
  const platform = useFilterStore((state) => state.platform);
  const setDateRange = useFilterStore((state) => state.setDateRange);
  const setStatus = useFilterStore((state) => state.setStatus);
  const setPlatform = useFilterStore((state) => state.setPlatform);
  const reset = useFilterStore((state) => state.reset);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
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
  );
}
