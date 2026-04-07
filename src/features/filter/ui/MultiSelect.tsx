
import { ChevronDown, Check } from "lucide-react";

import { cn } from "@/shared/lib";
import { Button, Badge, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";

export interface MultiSelectOption<T extends string> {
  value: T;
  label: string;
}

interface MultiSelectProps<T extends string> {
  options: MultiSelectOption<T>[];
  value: Set<T>;
  onChange: (value: Set<T>) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = "전체",
  className,
}: MultiSelectProps<T>) {
  const handleToggle = (optionValue: T) => {
    const newValue = new Set(value);
    if (newValue.has(optionValue)) {
      newValue.delete(optionValue);
    } else {
      newValue.add(optionValue);
    }
    onChange(newValue);
  };

  const handleSelectAll = () => {
    onChange(new Set<T>());
  };

  const isAllSelected = value.size === 0;
  const selectedLabels = options
    .filter((opt) => value.has(opt.value))
    .map((opt) => opt.label);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "min-w-[140px] justify-between text-left font-normal",
              className
            )}
          >
            <span className="flex items-center gap-1.5 truncate">
              {isAllSelected && placeholder}
              {!isAllSelected && selectedLabels.length <= 2 && (
                <span className="flex gap-1">
                  {selectedLabels.map((label) => (
                    <Badge key={label} variant="secondary" className="font-normal">
                      {label}
                    </Badge>
                  ))}
                </span>
              )}
              {!isAllSelected && selectedLabels.length > 2 && (
                <Badge variant="secondary" className="font-normal">
                  {selectedLabels.length}개 선택
                </Badge>
              )}
            </span>
            <ChevronDown className="size-4 opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-[180px] p-1" align="start">
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={handleSelectAll}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
              isAllSelected && "bg-muted"
            )}
          >
            <div
              className={cn(
                "size-4 rounded border border-input flex items-center justify-center",
                isAllSelected && "bg-primary border-primary"
              )}
            >
              {isAllSelected && <Check className="size-3 text-primary-foreground" />}
            </div>
            전체
          </button>
          {options.map((option) => {
            const isSelected = value.has(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleToggle(option.value)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
              >
                <div
                  className={cn(
                    "size-4 rounded border border-input flex items-center justify-center",
                    isSelected && "bg-primary border-primary"
                  )}
                >
                  {isSelected && <Check className="size-3 text-primary-foreground" />}
                </div>
                {option.label}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
