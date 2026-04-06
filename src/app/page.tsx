import { GlobalFilter } from "@/features/filter";

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
          {/* 추후 차트 및 테이블 컴포넌트가 들어갈 영역 */}
          <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
            일별 추이 차트 영역 (3.2)
          </div>
          <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
            캠페인 관리 테이블 영역 (3.3)
          </div>
        </div>
      </main>
    </div>
  );
}
