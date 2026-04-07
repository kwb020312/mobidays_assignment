"use client";

import { Button } from "@/shared/ui";
import { PLATFORM_METRIC_OPTIONS } from "../constants";
import type { PlatformMetric } from "../types";

interface PlatformMetricToggleProps {
  selectedMetric: PlatformMetric;
  onSelect: (metric: PlatformMetric) => void;
}

export function PlatformMetricToggle({
  selectedMetric,
  onSelect,
}: PlatformMetricToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORM_METRIC_OPTIONS.map((option) => (
        <Button
          key={option.key}
          variant={selectedMetric === option.key ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(option.key)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
