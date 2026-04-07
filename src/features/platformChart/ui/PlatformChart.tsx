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
} from "@/shared/ui";
import { formatNumber } from "@/shared/lib";
import { useFilterStore } from "@/features/filter";
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
    <Card>
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
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            데이터를 불러오는 중...
          </div>
        ) : isEmpty ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            선택한 조건에 해당하는 데이터가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <ChartContainer
              config={PLATFORM_CHART_CONFIG}
              className="mx-auto aspect-square h-[250px]"
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
                              {selectedMetric === "cost" ? "원" : "회"} ({percentage.toFixed(1)}%)
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
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  onClick={(_, index) => handlePieClick(data[index].platform)}
                  style={{ cursor: "pointer" }}
                >
                  {data.map((entry) => {
                    const isSelected = isPlatformSelected(
                      entry.platform,
                      selectedPlatforms
                    );
                    return (
                      <Cell
                        key={entry.platform}
                        fill={entry.fill}
                        opacity={isSelected ? 1 : 0.3}
                      />
                    );
                  })}
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-xl font-bold"
                            >
                              {formatNumber(total)}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-sm"
                            >
                              {metricLabel}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* 범례 */}
            <div className="flex flex-wrap justify-center gap-4">
              {data.map((item) => {
                const isSelected = isPlatformSelected(
                  item.platform,
                  selectedPlatforms
                );
                return (
                  <button
                    key={item.platform}
                    onClick={() => handlePieClick(item.platform)}
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 transition-opacity hover:bg-muted ${
                      isSelected ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm font-medium">{item.platform}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(item.value)}
                      {selectedMetric === "cost" ? "원" : "회"} (
                      {item.percentage.toFixed(1)}%)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
