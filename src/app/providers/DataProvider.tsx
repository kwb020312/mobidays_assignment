import { useEffect, type ReactNode } from "react";
import { useCampaignStore } from "@/entities/campaign";
import { useDailyStatStore } from "@/entities/dailyStat";

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const fetchCampaigns = useCampaignStore((state) => state.fetchCampaigns);
  const campaignError = useCampaignStore((state) => state.error);

  const fetchDailyStats = useDailyStatStore((state) => state.fetchDailyStats);
  const dailyStatError = useDailyStatStore((state) => state.error);

  useEffect(() => {
    fetchCampaigns();
    fetchDailyStats();
  }, [fetchCampaigns, fetchDailyStats]);

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

  return <>{children}</>;
}
