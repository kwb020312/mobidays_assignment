"use client";

import { ArrowUp } from "lucide-react";
import { TableHead } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { SortableColumn, SortState } from "../types";

interface SortableHeaderProps {
  column: SortableColumn;
  label: string;
  width: string;
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
  return (
    <TableHead
      className={cn(
        "cursor-pointer select-none hover:bg-muted/50",
        align === "right" && "text-right"
      )}
      style={{ width }}
      onClick={() => onSort(column)}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1",
          align === "right" && "justify-end"
        )}
      >
        {label}
        <span className="inline-flex size-4 items-center justify-center">
          <ArrowUp
            className={cn(
              "size-3.5 shrink-0 transition-transform duration-200",
              sortState.column !== column && "text-muted-foreground/50",
              sortState.column === column &&
                sortState.direction === "desc" &&
                "rotate-180"
            )}
          />
        </span>
      </span>
    </TableHead>
  );
}
