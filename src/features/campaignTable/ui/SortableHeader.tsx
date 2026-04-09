"use client";

import { ArrowUp } from "lucide-react";
import { TableHead } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { SortableColumn, SortState } from "../types";

interface SortableHeaderProps {
  column: SortableColumn;
  label: string;
  width: string | number;
  align?: "left" | "right";
  sortState: SortState;
  onSort: (column: SortableColumn) => void;
}

export function SortableHeader({
  column,
  label,
  width,
  align = "left",
  sortState,
  onSort,
}: SortableHeaderProps) {
  const isActive = sortState.column === column;
  const ariaSortValue = isActive
    ? sortState.direction === "asc"
      ? "ascending"
      : "descending"
    : undefined;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSort(column);
    }
  };

  return (
    <TableHead
      className={cn(
        "cursor-pointer select-none hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        align === "right" && "text-right"
      )}
      style={{ width }}
      onClick={() => onSort(column)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="columnheader"
      aria-sort={ariaSortValue}
      aria-label={`${label} 정렬 (현재: ${isActive ? (sortState.direction === "asc" ? "오름차순" : "내림차순") : "정렬 안됨"})`}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1",
          align === "right" && "justify-end"
        )}
      >
        {label}
        <span
          className="inline-flex size-4 items-center justify-center"
          aria-hidden="true"
        >
          <ArrowUp
            className={cn(
              "size-3.5 shrink-0 transition-transform duration-200",
              !isActive && "text-muted-foreground/50",
              isActive && sortState.direction === "desc" && "rotate-180"
            )}
          />
        </span>
      </span>
    </TableHead>
  );
}
