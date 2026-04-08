import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  Skeleton,
  type ChartConfig,
} from "@/shared/ui";
import { useFilterStore } from "@/shared/stores";
import { useFilteredDailyStats } from "../hooks/useFilteredDailyStats";
import { MetricToggle } from "./MetricToggle";
import { METRIC_OPTIONS, DEFAULT_METRICS, type DailyMetric } from "../types";
import {
  formatNumber,
  formatXAxisDate,
  formatTooltipDate,
  formatDateRange,
} from "../lib/formatters";

export function DailyTrendChart() {
  const { data, isLoading, error, isEmpty } = useFilteredDailyStats();
  const dateRange = useFilterStore((state) => state.dateRange);
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
          <CardDescription>
            {formatDateRange(dateRange.from, dateRange.to)}
          </CardDescription>
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
          <CardTitle>일별 추이</CardTitle>
          <CardDescription>
            {formatDateRange(dateRange.from, dateRange.to)}
          </CardDescription>
        </div>
        <MetricToggle
          selectedMetrics={selectedMetrics}
          onToggle={handleToggleMetric}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] space-y-4">
            {/* Y축 + 차트 영역 */}
            <div className="flex h-[260px] gap-4">
              <Skeleton className="h-full w-16" />
              <Skeleton className="h-full flex-1" />
              <Skeleton className="h-full w-16" />
            </div>
            {/* 범례 영역 */}
            <div className="flex justify-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ) : isEmpty ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            선택한 조건에 해당하는 데이터가 없습니다.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
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
                yAxisId="left"
                tickFormatter={formatNumber}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={80}
              >
                <Label
                  value="노출수"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle", fill: "var(--chart-1)" }}
                />
              </YAxis>
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={formatNumber}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={80}
              >
                <Label
                  value="클릭수"
                  angle={90}
                  position="insideRight"
                  style={{ textAnchor: "middle", fill: "var(--chart-2)" }}
                />
              </YAxis>
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
                  yAxisId={metric.key === "impressions" ? "left" : "right"}
                />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
