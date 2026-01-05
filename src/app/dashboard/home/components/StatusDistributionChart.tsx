// src/app/dashboard/home/components/StatusDistributionChart.tsx

"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { StatusBreakdown } from "@/types/analytics";
import { PieChart as PieChartIcon } from "lucide-react";

interface StatusDistributionChartProps {
  data: StatusBreakdown[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  "Pending Payment": {
    label: "Pending Payment",
    color: "#f59e0b", // amber
  },
  "Pending Approval": {
    label: "Pending Approval",
    color: "#fb923c", // orange
  },
  Approved: {
    label: "Approved",
    color: "#8b5cf6", // purple
  },
  "Room Allocated": {
    label: "Room Allocated",
    color: "#3b82f6", // blue
  },
  Completed: {
    label: "Completed",
    color: "#10b981", // green
  },
  Cancelled: {
    label: "Cancelled",
    color: "#ef4444", // red
  },
  Rejected: {
    label: "Rejected",
    color: "#dc2626", // dark red
  },
  Expired: {
    label: "Expired",
    color: "#6b7280", // gray
  },
};

interface TooltipPayload {
  name: string;
  value: number;
  fill: string;
  payload: {
    name: string;
    value: number;
    percentage: number;
    rawStatus: string;
  };
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm px-4 py-3.5 rounded-xl shadow-xl border border-gray-200/80">
        <p className="font-bold text-gray-900 mb-2.5 text-sm">{data.name}</p>
        <div className="space-y-1">
          <p className="text-xs text-gray-600">
            Count: <span className="font-bold text-gray-900">{data.value}</span>
          </p>
          <p className="text-xs text-gray-600">
            Share:{" "}
            <span className="font-bold text-gray-900">
              {data.percentage.toFixed(1)}%
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function StatusDistributionChart({
  data,
}: StatusDistributionChartProps) {
  const chartData = data.map((item) => {
    const config = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
    return {
      name: config?.label || item.status,
      value: item.count,
      percentage: item.percentage,
      color: config?.color || "#6b7280",
      rawStatus: item.status,
    };
  });

  const totalBookings = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="overflow-hidden border border-gray-200/80 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              Status Distribution
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Booking status breakdown
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-50 to-blue-100/80 border border-blue-200/50 shadow-sm">
            <PieChartIcon className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8">
        <div className="flex flex-col items-center">
          {/* Donut Chart */}
          <div className="relative shrink-0">
            <ResponsiveContainer width={380} height={380}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={170}
                  innerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={3}
                  stroke="white"
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute z-10 inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-5xl font-bold text-gray-900 tabular-nums">
                {totalBookings}
              </p>
              <p className="text-sm text-gray-500 mt-1">Sessions</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3 w-full z-20">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full px-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-sm shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </div>
                <span className="text-base font-bold text-gray-900 tabular-nums">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
