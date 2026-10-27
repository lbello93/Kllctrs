"use client";

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Area,
  AreaChart,
} from "recharts";

interface TooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  valueLabel: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  valueLabel,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-xl">
      <p className="mb-1 text-sm font-semibold text-[#1a0a3d]">{label}</p>
      <p className="text-sm text-[#5f2eea]">
        {payload[0].value.toLocaleString()} {valueLabel}
      </p>
    </div>
  );
}

interface AnalyticsLineChartProps {
  data: object[];
  dataKey: string;
  xKey: string;
  valueLabel?: string;
}

export default function AnalyticsLineChart({
  data,
  dataKey,
  xKey,
  valueLabel = "Views",
}: AnalyticsLineChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-[350px] items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-white">
        <p className="text-[#4a3f6b]/50">No analytics available yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5f2eea" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#5f2eea" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#ede9fe"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey={xKey}
            tick={{ fill: "#4a3f6b", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{ fill: "#4a3f6b", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            cursor={{ stroke: "#5f2eea", strokeDasharray: "4 4" }}
            content={<CustomTooltip valueLabel={valueLabel} />}
          />

          <Area
            type="monotone"
            dataKey={dataKey}
            fill="url(#analyticsGradient)"
            stroke="none"
          />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#5f2eea"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 7,
              fill: "#ffffff",
              stroke: "#5f2eea",
              strokeWidth: 3,
            }}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
