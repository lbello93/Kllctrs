"use client";

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
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
      <p className="text-sm font-semibold text-[#1a0a3d]">{label}</p>
      <p className="mt-1 text-sm text-[#5f2eea]">
        {payload[0].value.toLocaleString()} {valueLabel}
      </p>
    </div>
  );
}

interface AnalyticsBarChartProps {
  data: object[];
  dataKey: string;
  xKey: string;
  valueLabel?: string;
}

export default function AnalyticsBarChart({
  data,
  dataKey,
  xKey,
  valueLabel = "Views",
}: AnalyticsBarChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-[360px] items-center justify-center">
        <p className="text-[#4a3f6b]/50">No analytics available.</p>
      </div>
    );
  }

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
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
            cursor={{ fill: "rgba(95,46,234,0.06)" }}
            content={<CustomTooltip valueLabel={valueLabel} />}
          />

          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} animationDuration={1000}>
            {data.map((_, index) => (
              <Cell key={index} fill={index === 0 ? "#5f2eea" : "#a78bfa"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
