"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { DateRange as DayPickerDateRange } from "react-day-picker";

import { cn } from "@/shared/lib";
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import type { DateRange } from "../types";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

function formatDateRange(range: DateRange): string {
  const fromStr = format(range.from, "yyyy.MM.dd", { locale: ko });
  const toStr = format(range.to, "yyyy.MM.dd", { locale: ko });
  return `${fromStr} - ${toStr}`;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const handleSelect = (range: DayPickerDateRange | undefined) => {
    if (!range?.from) return;

    const newRange: DateRange = {
      from: range.from,
      to: range.to ?? range.from,
    };
    onChange(newRange);
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              className
            )}
          >
            <CalendarIcon
              data-icon="inline-start"
              className="text-muted-foreground"
            />
            {formatDateRange(value)}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={value.from}
          selected={{ from: value.from, to: value.to }}
          onSelect={handleSelect}
          numberOfMonths={2}
          locale={ko}
        />
      </PopoverContent>
    </Popover>
  );
}
