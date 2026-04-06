"use client";

import { useEffect, type ReactNode } from "react";
import { useDataStore } from "@/shared/stores";

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const fetchData = useDataStore((state) => state.fetchData);
  const isLoading = useDataStore((state) => state.isLoading);
  const isInitialized = useDataStore((state) => state.isInitialized);
  const error = useDataStore((state) => state.error);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
