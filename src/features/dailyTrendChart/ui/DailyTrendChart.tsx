"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/shared/ui";
import { useFilteredDailyStats } from "../hooks/useFilteredDailyStats";
import { MetricToggle } from "./MetricToggle";
import { METRIC_OPTIONS, DEFAULT_METRICS, type DailyMetric } from "../types";

function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

function formatXAxisDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "M/d", { locale: ko });
  } catch {
    return dateStr;
  }
}

function formatTooltipDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "yyyy년 M월 d일", { locale: ko });
  } catch {
    return dateStr;
  }
}

export function DailyTrendChart() {
  const { data, isLoading, error, isEmpty } = useFilteredDailyStats();
  const [selectedMetrics, setSelectedMetrics] = useState(
    new Set<DailyMetric>(DEFAULT_METRICS)
  );

  const handleToggleMetric = (metric: DailyMetric) => {
    setSelectedMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(metric)) {
        if (next.size > 1) {
          next.delete(metric);
        }
      } else {
        next.add(metric);
      }
      return next;
    });
  };

  // 차트 설정
  const chartConfig: ChartConfig = {};
  for (const option of METRIC_OPTIONS) {
    chartConfig[option.key] = {
      label: option.label,
      color: option.color,
    };
  }

  // 선택된 메트릭 옵션들
  const activeMetrics = METRIC_OPTIONS.filter((opt) =>
    selectedMetrics.has(opt.key)
  );

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>일별 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-destructive">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>일별 추이</CardTitle>
        <MetricToggle
          selectedMetrics={selectedMetrics}
          onToggle={handleToggleMetric}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            데이터를 불러오는 중...
          </div>
        ) : isEmpty ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            선택한 조건에 해당하는 데이터가 없습니다.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={data} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxisDate}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickFormatter={formatNumber}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={60}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      if (payload?.[0]?.payload?.date) {
                        return formatTooltipDate(payload[0].payload.date);
                      }
                      return "";
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {activeMetrics.map((metric) => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
