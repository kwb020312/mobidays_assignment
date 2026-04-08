"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Skeleton,
} from "@/shared/ui";
import { cn, formatNumber } from "@/shared/lib";
import { useFilterStore } from "@/shared/stores";
import type { Platform } from "@/shared/types";
import { usePlatformStats } from "../hooks/usePlatformStats";
import { PlatformMetricToggle } from "./PlatformMetricToggle";
import {
  DEFAULT_PLATFORM_METRIC,
  PLATFORM_METRIC_OPTIONS,
  PLATFORM_CHART_CONFIG,
} from "../constants";
import type { PlatformMetric } from "../types";

function isPlatformSelected(
  platform: Platform,
  selectedPlatforms: Set<Platform>
): boolean {
  return selectedPlatforms.size === 0 || selectedPlatforms.has(platform);
}

export function PlatformChart() {
  const [selectedMetric, setSelectedMetric] = useState<PlatformMetric>(
    DEFAULT_PLATFORM_METRIC
  );
  const { data, total, isLoading, error, isEmpty } =
    usePlatformStats(selectedMetric);
  const togglePlatform = useFilterStore((state) => state.togglePlatform);
  const selectedPlatforms = useFilterStore((state) => state.platform);

  const metricLabel =
    PLATFORM_METRIC_OPTIONS.find((opt) => opt.key === selectedMetric)?.label ||
    "";
  const metricUnit = selectedMetric === "cost" ? "원" : "회";

  const handlePieClick = (platform: Platform) => {
    togglePlatform(platform);
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>플랫폼별 성과</CardTitle>
          <CardDescription>매체별 성과 비중</CardDescription>
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
    <Card data-testid="platform-chart">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>플랫폼별 성과</CardTitle>
          <CardDescription>매체별 {metricLabel} 비중</CardDescription>
        </div>
        <PlatformMetricToggle
          selectedMetric={selectedMetric}
          onSelect={setSelectedMetric}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[280px] items-center gap-4">
            {/* 도넛 차트 Skeleton */}
            <div className="flex flex-1 items-center justify-center">
              <Skeleton className="h-[220px] w-[220px] rounded-full" />
            </div>
            {/* 우측 범례 Skeleton */}
            <div className="flex flex-1 flex-col gap-3">
              <div className="border-b pb-2">
                <Skeleton className="mb-1 h-3 w-16" />
                <Skeleton className="h-6 w-28" />
              </div>
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            선택한 조건에 해당하는 데이터가 없습니다.
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* 좌측: 도넛 차트 */}
            <ChartContainer
              config={PLATFORM_CHART_CONFIG}
              className="aspect-square h-[280px] flex-1"
            >
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => {
                        const percentage = item.payload?.percentage as number;
                        return (
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: item.payload?.fill }}
                            />
                            <span>{name}</span>
                            <span className="font-medium">
                              {formatNumber(value as number)}
                              {metricUnit} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="platform"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  onClick={(_, index) => handlePieClick(data[index].platform)}
                  style={{ cursor: "pointer" }}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.platform}
                      fill={entry.fill}
                      opacity={
                        isPlatformSelected(entry.platform, selectedPlatforms)
                          ? 1
                          : 0.3
                      }
                    />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-muted-foreground text-xs"
                          >
                            {metricLabel}
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* 우측: 총액 + 순위별 범례 */}
            <div className="flex flex-1 flex-col gap-3">
              {/* 총액 */}
              <div className="border-b pb-2">
                <p className="text-xs text-muted-foreground">
                  총 {metricLabel}
                </p>
                <p className="text-xl font-bold">
                  {formatNumber(total)}
                  <span className="ml-0.5 text-sm font-normal text-muted-foreground">
                    {metricUnit}
                  </span>
                </p>
              </div>

              {/* 순위별 범례 */}
              <div className="flex flex-col gap-1">
                {data.map((item, index) => (
                  <button
                    key={item.platform}
                    onClick={() => handlePieClick(item.platform)}
                    className={cn(
                      "flex items-center gap-2 rounded px-2 py-1 text-left opacity-40 transition-opacity hover:bg-muted",
                      isPlatformSelected(item.platform, selectedPlatforms) &&
                        "opacity-100"
                    )}
                  >
                    <span className="w-4 text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="flex-1 text-sm">{item.platform}</span>
                    <span className="text-sm font-medium">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
