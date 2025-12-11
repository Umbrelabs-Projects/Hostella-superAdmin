// src/app/dashboard/home/_hooks/useAnalyticsApi.ts

import { useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { useAnalyticsStore } from "@/stores/useAnalyticsStore";
import { DashboardAnalytics } from "@/types/analytics";

export function useAnalyticsApi() {
  const { setAnalytics, setLoading, setError, dateRange } = useAnalyticsStore();

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const data = await apiFetch<DashboardAnalytics>(
        `/analytics/dashboard?${params.toString()}`,
        {
          method: "GET",
        },
      );

      setAnalytics(data);
      setLoading(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch analytics data";
      setError(message);
      setLoading(false);
    }
  }, [dateRange.endDate, dateRange.startDate, setAnalytics, setError, setLoading]);

  return { fetchAnalytics };
}
