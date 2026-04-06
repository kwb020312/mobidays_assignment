import { GlobalFilter } from "@/features/filter";
import { DailyTrendChart } from "@/features/dailyTrendChart";
import { CampaignTable } from "@/features/campaignTable";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4">
          <h1 className="text-lg font-semibold">마케팅 캠페인 대시보드</h1>
        </div>
      </header>

      <main className="container mx-auto space-y-6 p-4 md:p-6">
        <GlobalFilter />

        <div className="grid gap-6">
          <DailyTrendChart />
          <CampaignTable />
        </div>
      </main>
    </div>
  );
}
