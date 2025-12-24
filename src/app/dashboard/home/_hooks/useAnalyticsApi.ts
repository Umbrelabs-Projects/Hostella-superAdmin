// src/app/dashboard/home/_hooks/useAnalyticsApi.ts

import { useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { useAnalyticsStore } from "@/stores/useAnalyticsStore";
import { DashboardAnalytics } from "@/types/analytics";

/**
 * Hook for fetching dashboard analytics data.
 * 
 * Date Range Handling:
 * - Dates are sent in YYYY-MM-DD format (e.g., "2024-01-31")
 * - Backend automatically normalizes to full day boundaries:
 *   - Start date: beginning of day (00:00:00.000)
 *   - End date: end of day (23:59:59.999)
 * - This ensures bookings created on the end date are included
 * - Backend handles timezone normalization, so no timezone conversion needed
 */
export function useAnalyticsApi() {
  const { setAnalytics, setLoading, setError, dateRange } = useAnalyticsStore();

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters with date range in YYYY-MM-DD format
      // Backend will normalize these to full day boundaries automatically
      const params = new URLSearchParams({
        startDate: dateRange.startDate, // Format: "YYYY-MM-DD"
        endDate: dateRange.endDate,     // Format: "YYYY-MM-DD"
      });

      if (process.env.NODE_ENV === "development") {
        console.log("[Analytics] Fetching with date range:", {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          note: "Backend normalizes dates to full day boundaries automatically",
        });
      }

      const data = await apiFetch<DashboardAnalytics>(
        `/analytics/dashboard?${params.toString()}`,
        {
          method: "GET",
        },
      );

      if (process.env.NODE_ENV === "development") {
        console.log("[Analytics] Received data:", {
          total: data.bookingStats?.total,
          pendingPayment: data.bookingStats?.pendingPayment,
          pendingApproval: data.bookingStats?.pendingApproval,
          approved: data.bookingStats?.approved,
          lastUpdated: data.lastUpdated,
        });
      }

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
