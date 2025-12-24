// src/app/dashboard/home/page.tsx

"use client";

import { useEffect } from "react";
import { useAnalyticsStore } from "@/stores/useAnalyticsStore";
import { useAnalyticsApi } from "./_hooks/useAnalyticsApi";
import StatsCard from "./components/StatsCard";
import StatusDistributionChart from "./components/StatusDistributionChart";
import RevenueChart from "./components/RevenueChart";
import HostelRevenueTable from "./components/HostelRevenueTable";
import StatsCardSkeleton from "@/components/_reusable_components/StatsCardSkeleton";
import ChartSkeleton from "@/components/_reusable_components/ChartSkeleton";
import TableSkeleton from "@/components/_reusable_components/TableSkeleton";
import {
  BookOpen,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
  RefreshCw,
  AlertCircle,
  Calendar,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { analytics, loading, error, dateRange } = useAnalyticsStore();
  const { fetchAnalytics } = useAnalyticsApi();

  useEffect(() => {
    void fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchAnalytics is stable - run only once on mount

  // Auto-refresh when page becomes visible (to catch new bookings)
  useEffect(() => {
    const refreshOnVisibility = async () => {
      if (document.visibilityState === "visible") {
        await fetchAnalytics();
      }
    };

    document.addEventListener("visibilitychange", refreshOnVisibility);
    return () => document.removeEventListener("visibilitychange", refreshOnVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    void fetchAnalytics();
  };

  const showLoading = loading && !analytics;

  const {
    bookingStats,
    statusBreakdown,
    monthlyRevenue,
    revenueByHostel,
    paymentStatus,
    recentBookings,
    revenueTrend,
  } = analytics || {};

  return (
    <div className="p-3 md:px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {analytics && (
            <>
              <p className="text-sm text-gray-600">
                Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                Date range: {dateRange.startDate} - {dateRange.endDate}
                <span className="ml-2 text-gray-400">(includes full day boundaries)</span>
              </p>
            </>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={loading}
          size="sm"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Error banner (non-blocking) */}
      {error && (
        <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <div className="space-y-1">
            <p className="font-medium">Failed to load analytics</p>
            <p className="text-red-700">{error}</p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {showLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Bookings"
              value={bookingStats?.total || 0}
              icon={BookOpen}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <StatsCard
              title="Pending Payment"
              value={bookingStats?.pendingPayment || 0}
              icon={Clock}
              iconColor="text-amber-600"
              iconBgColor="bg-amber-100"
            />
            <StatsCard
              title="Approved"
              value={bookingStats?.approved || 0}
              icon={CheckCircle}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <StatsCard
              title="Total Revenue"
              value={`GHS ${(bookingStats?.totalRevenue || 0).toLocaleString(
                "en-GH",
                { minimumFractionDigits: 2 }
              )}`}
              icon={DollarSign}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
          </>
        )}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {showLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Pending Approval"
              value={bookingStats?.pendingApproval || 0}
              icon={Users}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
            />
            <StatsCard
              title="Avg. Booking Value"
              value={`GHS ${(
                bookingStats?.averageBookingValue || 0
              ).toLocaleString("en-GH", { minimumFractionDigits: 2 })}`}
              icon={TrendingUp}
              iconColor="text-indigo-600"
              iconBgColor="bg-indigo-100"
            />
            <StatsCard
              title="Collection Rate"
              value={`${(paymentStatus?.collectionRate || 0).toFixed(1)}%`}
              icon={DollarSign}
              iconColor="text-emerald-600"
              iconBgColor="bg-emerald-100"
            />
            <StatsCard
              title="Recent Bookings"
              value={recentBookings ?? 0}
              icon={Calendar}
              iconColor="text-cyan-600"
              iconBgColor="bg-cyan-100"
            />
            {revenueTrend && (
              <StatsCard
                title="Revenue Trend"
                value={`${revenueTrend.percentageChange >= 0 ? "+" : ""}${revenueTrend.percentageChange.toFixed(1)}%`}
                icon={revenueTrend.percentageChange >= 0 ? TrendingUp : TrendingDown}
                iconColor={
                  revenueTrend.percentageChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
                iconBgColor={
                  revenueTrend.percentageChange >= 0
                    ? "bg-green-100"
                    : "bg-red-100"
                }
                trend={{
                  value: Math.abs(revenueTrend.percentageChange),
                  isPositive: revenueTrend.percentageChange >= 0,
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            {statusBreakdown && (
              <StatusDistributionChart data={statusBreakdown} />
            )}
            {monthlyRevenue && <RevenueChart data={monthlyRevenue} />}
          </>
        )}
      </div>

      {/* Hostel Performance Table */}
      {showLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        revenueByHostel && <HostelRevenueTable data={revenueByHostel} />
      )}
    </div>
  );
}
