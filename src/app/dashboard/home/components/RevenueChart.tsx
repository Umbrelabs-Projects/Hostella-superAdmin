// src/app/dashboard/home/components/RevenueChart.tsx

"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MonthlyRevenue } from "@/types/analytics";
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-gray-200">
        <p className="font-bold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: TooltipPayload, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {entry.name === "Revenue"
                  ? `GHS ${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((item) => ({
    month: item.month,
    Revenue: item.revenue,
    Bookings: item.bookings,
  }));

  const maxRevenue = Math.max(...chartData.map((d) => d.Revenue));
  const maxBookings = Math.max(...chartData.map((d) => d.Bookings));

  return (
    <Card className="overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Monthly Performance
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Revenue & bookings over the last {data.length} months
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-blue-500 shadow-sm" />
            <span className="text-sm font-medium text-gray-700">
              Revenue (GHS)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-500 shadow-sm" />
            <span className="text-sm font-medium text-gray-700">Bookings</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              vertical={false}
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              style={{ fontSize: 13, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value;
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              dataKey="Revenue"
              fill="url(#revenueGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
              animationDuration={800}
              animationBegin={0}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`revenue-${index}`}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Bar>
            <Bar
              dataKey="Bookings"
              fill="url(#bookingsGradient)"
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
              animationDuration={800}
              animationBegin={100}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`bookings-${index}`}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Highest Revenue
            </p>
            <p className="text-xl font-bold text-blue-900">
              GHS {maxRevenue.toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              Peak Bookings
            </p>
            <p className="text-xl font-bold text-emerald-900">
              {maxBookings.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
