"use client";

import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  setMonth,
  startOfYear,
} from "date-fns";

import { Button } from "@/shared/ui";
import type { DateRange } from "../types";

type DatePreset = {
  label: string;
  getRange: () => DateRange;
};

const DATE_PRESETS: DatePreset[] = [
  {
    label: "오늘",
    getRange: () => {
      const today = new Date();
      return { from: startOfDay(today), to: endOfDay(today) };
    },
  },
  {
    label: "이번 주",
    getRange: () => {
      const today = new Date();
      return {
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      };
    },
  },
  {
    label: "이번 달",
    getRange: () => {
      const today = new Date();
      return { from: startOfMonth(today), to: endOfMonth(today) };
    },
  },
  {
    label: "최근 3개월",
    getRange: () => {
      const today = new Date();
      return { from: startOfMonth(subMonths(today, 2)), to: endOfDay(today) };
    },
  },
];

const MONTH_PRESETS: DatePreset[] = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  getRange: () => {
    const year = new Date().getFullYear();
    const monthStart = startOfMonth(setMonth(startOfYear(new Date(year, 0)), i));
    return { from: monthStart, to: endOfMonth(monthStart) };
  },
}));

interface DatePresetsProps {
  onChange: (range: DateRange) => void;
}

export function DatePresets({ onChange }: DatePresetsProps) {
  const handleClick = (preset: DatePreset) => {
    onChange(preset.getRange());
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">빠른 선택:</span>
      {DATE_PRESETS.map((preset) => (
        <Button
          key={preset.label}
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => handleClick(preset)}
        >
          {preset.label}
        </Button>
      ))}
      <div className="h-4 w-px bg-border" />
      {MONTH_PRESETS.map((preset) => (
        <Button
          key={preset.label}
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => handleClick(preset)}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
