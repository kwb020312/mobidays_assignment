"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { cn } from "@/shared/lib";
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import type { DateRange } from "../types";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const calendarProps = {
  locale: ko,
  captionLayout: "dropdown" as const,
  startMonth: new Date(2000, 0),
  endMonth: new Date(2030, 11),
};

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const handleSelect = (type: "from" | "to") => (date: Date | undefined) => {
    if (!date) return;

    if (type === "from") {
      onChange({
        from: date,
        to: date > value.to ? date : value.to,
      });
    } else {
      onChange({
        from: date < value.from ? date : value.from,
        to: date,
      });
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="w-[140px] justify-start text-left font-normal"
            >
              <CalendarIcon
                data-icon="inline-start"
                className="text-muted-foreground"
              />
              {format(value.from, "yyyy.MM.dd", { locale: ko })}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value.from}
            onSelect={handleSelect("from")}
            defaultMonth={value.from}
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground">~</span>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="w-[140px] justify-start text-left font-normal"
            >
              <CalendarIcon
                data-icon="inline-start"
                className="text-muted-foreground"
              />
              {format(value.to, "yyyy.MM.dd", { locale: ko })}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value.to}
            onSelect={handleSelect("to")}
            defaultMonth={value.to}
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
