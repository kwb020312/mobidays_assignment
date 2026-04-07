
import { Button } from "@/shared/ui";
import { METRIC_OPTIONS, type DailyMetric } from "../types";

interface MetricToggleProps {
  selectedMetrics: Set<DailyMetric>;
  onToggle: (metric: DailyMetric) => void;
}

export function MetricToggle({ selectedMetrics, onToggle }: MetricToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {METRIC_OPTIONS.map((option) => {
        const isSelected = selectedMetrics.has(option.key);
        // 최소 1개는 선택된 상태 유지 - 마지막 하나면 비활성화 불가
        const isDisabled = isSelected && selectedMetrics.size === 1;

        return (
          <Button
            key={option.key}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onToggle(option.key)}
            disabled={isDisabled}
            className="gap-2"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: option.color }}
            />
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
