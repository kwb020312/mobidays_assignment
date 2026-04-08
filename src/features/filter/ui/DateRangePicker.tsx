import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { cn } from "@/shared/lib";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";
import type { DateRange } from "../types";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  "aria-labelledby"?: string;
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
  "aria-labelledby": ariaLabelledby,
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
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center",
        className
      )}
      role="group"
      aria-labelledby={ariaLabelledby}
    >
      {/* 시작일 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground sm:hidden">시작</span>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="w-[140px] justify-start text-left font-normal"
                aria-label={`시작일 선택: ${format(value.from, "yyyy년 M월 d일", { locale: ko })}`}
              >
                <CalendarIcon
                  data-icon="inline-start"
                  className="text-muted-foreground"
                  aria-hidden="true"
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
      </div>

      <span
        className="hidden text-muted-foreground sm:block"
        aria-hidden="true"
      >
        ~
      </span>

      {/* 종료일 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground sm:hidden">종료</span>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="w-[140px] justify-start text-left font-normal"
                aria-label={`종료일 선택: ${format(value.to, "yyyy년 M월 d일", { locale: ko })}`}
              >
                <CalendarIcon
                  data-icon="inline-start"
                  className="text-muted-foreground"
                  aria-hidden="true"
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
    </div>
  );
}
