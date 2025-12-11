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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { analytics, loading, error } = useAnalyticsStore();
  const { fetchAnalytics } = useAnalyticsApi();

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  const handleRefresh = () => {
    void fetchAnalytics();
  };

  if (error && !analytics) {
    return (
      <div className="p-3 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertCircle className="h-12 w-12 text-red-600" />
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-2">Failed to load analytics</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { bookingStats, statusBreakdown, monthlyRevenue, revenueByHostel, paymentStatus } =
    analytics || {};

  return (
    <div className="p-3 md:px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          {analytics && (
            <p className="text-sm text-gray-600">
              Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={loading} size="sm">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && !analytics ? (
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
              value={`GHS ${(bookingStats?.totalRevenue || 0).toLocaleString("en-GH", { minimumFractionDigits: 2 })}`}
              icon={DollarSign}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
          </>
        )}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading && !analytics ? (
          <>
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
              value={`GHS ${(bookingStats?.averageBookingValue || 0).toLocaleString("en-GH", { minimumFractionDigits: 2 })}`}
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
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading && !analytics ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            {statusBreakdown && <StatusDistributionChart data={statusBreakdown} />}
            {monthlyRevenue && <RevenueChart data={monthlyRevenue} />}
          </>
        )}
      </div>

      {/* Hostel Performance Table */}
      {loading && !analytics ? (
        <TableSkeleton rows={5} />
      ) : (
        revenueByHostel && <HostelRevenueTable data={revenueByHostel} />
      )}
    </div>
  );
}

