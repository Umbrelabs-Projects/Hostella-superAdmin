// src/stores/useAnalyticsStore.ts

import { create } from "zustand";
import { DashboardAnalytics } from "@/types/analytics";

export interface AnalyticsState {
  analytics: DashboardAnalytics | null;
  loading: boolean;
  error: string | null;
  dateRange: {
    startDate: string;
    endDate: string;
  };

  // Actions
  setAnalytics: (analytics: DashboardAnalytics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDateRange: (startDate: string, endDate: string) => void;
  refreshAnalytics: () => void;
}

/**
 * Formats a Date object to YYYY-MM-DD format for API requests.
 * The backend automatically normalizes dates to full day boundaries:
 * - Start date: beginning of day (00:00:00.000)
 * - End date: end of day (23:59:59.999)
 * This ensures bookings created on the end date are included.
 */
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Gets the default date range (last 30 days).
 * Returns dates in YYYY-MM-DD format as required by the API.
 * The backend handles timezone normalization automatically.
 */
const getDefaultDateRange = () => {
  const endDate = new Date(); // Today
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // Last 30 days

  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
  };
};

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analytics: null,
  loading: false,
  error: null,
  dateRange: getDefaultDateRange(),

  setAnalytics: (analytics) => set({ analytics, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setDateRange: (startDate, endDate) => set({ dateRange: { startDate, endDate } }),
  refreshAnalytics: () => set({ analytics: null, loading: true, error: null }),
}));
