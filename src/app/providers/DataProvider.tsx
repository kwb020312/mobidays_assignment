import { useEffect, type ReactNode } from "react";
import { useCampaignStore } from "@/entities/campaign";
import { useDailyStatStore } from "@/entities/dailyStat";

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const fetchCampaigns = useCampaignStore((state) => state.fetchCampaigns);
  const campaignLoading = useCampaignStore((state) => state.isLoading);
  const campaignInitialized = useCampaignStore((state) => state.isInitialized);
  const campaignError = useCampaignStore((state) => state.error);

  const fetchDailyStats = useDailyStatStore((state) => state.fetchDailyStats);
  const dailyStatLoading = useDailyStatStore((state) => state.isLoading);
  const dailyStatInitialized = useDailyStatStore((state) => state.isInitialized);
  const dailyStatError = useDailyStatStore((state) => state.error);

  useEffect(() => {
    fetchCampaigns();
    fetchDailyStats();
  }, [fetchCampaigns, fetchDailyStats]);

  const isLoading = campaignLoading || dailyStatLoading;
  const isInitialized = campaignInitialized && dailyStatInitialized;
  const error = campaignError || dailyStatError;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-destructive">
          <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">데이터를 불러오는 중...</div>
      </div>
    );
  }

  return <>{children}</>;
}
