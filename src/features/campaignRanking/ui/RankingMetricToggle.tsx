"use client";

import { Button } from "@/shared/ui";
import { RANKING_METRIC_OPTIONS } from "../constants";
import type { RankingMetric } from "../types";

interface RankingMetricToggleProps {
  selectedMetric: RankingMetric;
  onSelect: (metric: RankingMetric) => void;
}

export function RankingMetricToggle({
  selectedMetric,
  onSelect,
}: RankingMetricToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {RANKING_METRIC_OPTIONS.map((option) => (
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
