"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/shared/ui";
import { cn, formatNumber } from "@/shared/lib";
import { useCampaignRanking } from "../hooks/useCampaignRanking";
import { RankingMetricToggle } from "./RankingMetricToggle";
import { DEFAULT_RANKING_METRIC, RANK_STYLES } from "../constants";
import type { RankingMetric } from "../types";

export function CampaignRankingChart() {
  const [selectedMetric, setSelectedMetric] = useState<RankingMetric>(
    DEFAULT_RANKING_METRIC
  );
  const { data, isLoading, error, isEmpty, metricOption } =
    useCampaignRanking(selectedMetric);

  const metricLabel = metricOption?.label ?? "";
  const metricUnit = metricOption?.unit ?? "";

  // 최대값 계산 (프로그레스 바 비율용)
  const maxValue =
    data.length > 0 ? Math.max(...data.map((d) => d.value ?? 0)) : 0;

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>캠페인 랭킹 Top3</CardTitle>
          <CardDescription>상위 3개 캠페인</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[280px] items-center justify-center text-destructive">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>캠페인 랭킹 Top3</CardTitle>
          <CardDescription>{metricLabel} 기준 상위 캠페인</CardDescription>
        </div>
        <RankingMetricToggle
          selectedMetric={selectedMetric}
          onSelect={setSelectedMetric}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative rounded-lg border bg-card p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="mb-2 h-5 w-3/4" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex h-[280px] items-center justify-center text-muted-foreground">
            선택한 조건에 해당하는 데이터가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {data.map((item, index) => {
              const style = RANK_STYLES[index] || RANK_STYLES[2];
              const percentage =
                maxValue > 0 ? ((item.value ?? 0) / maxValue) * 100 : 0;

              return (
                <div
                  key={item.campaignId}
                  className={cn(
                    "relative rounded-lg border bg-card p-4 ring-2 transition-all hover:shadow-md",
                    style.ring
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* 순위 뱃지 */}
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm",
                        style.badge
                      )}
                    >
                      {index + 1}
                    </div>

                    {/* 캠페인 정보 */}
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate font-medium"
                        title={item.campaignName}
                      >
                        {item.campaignName}
                      </p>

                      {/* 프로그레스 바 */}
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            style.bar
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* 메트릭 값 */}
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-bold tabular-nums">
                        {formatNumber(item.value ?? 0)}
                        <span className="ml-0.5 text-sm font-normal text-muted-foreground">
                          {metricUnit}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 빈 슬롯 채우기 (3개 미만일 때) */}
            {Array.from({ length: 3 - data.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex h-[72px] items-center justify-center rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground"
              >
                데이터 없음
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
