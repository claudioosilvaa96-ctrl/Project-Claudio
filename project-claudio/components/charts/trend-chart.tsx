"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Card, CardHeader } from "@/components/ui/card";
import { shortDate } from "@/lib/utils";

type ChartDatum = {
  date: string;
  [key: string]: string | number | undefined;
};

type Series = {
  key: string;
  label: string;
  color: string;
};

function tooltipStyle() {
  return {
    border: "1px solid rgb(var(--line))",
    borderRadius: 8,
    background: "rgb(var(--panel))",
    color: "rgb(var(--ink))",
    boxShadow: "0 14px 40px rgba(20, 28, 42, 0.12)"
  };
}

export function TrendChart({
  title,
  eyebrow,
  data,
  series,
  height = 260,
  kind = "line"
}: {
  title: string;
  eyebrow?: string;
  data: ChartDatum[];
  series: Series[];
  height?: number;
  kind?: "line" | "area";
}) {
  const Chart = kind === "area" ? AreaChart : LineChart;

  return (
    <Card>
      <CardHeader title={title} eyebrow={eyebrow} />
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={data} margin={{ left: -18, right: 8, top: 6, bottom: 0 }}>
            <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={shortDate}
              tick={{ fill: "rgb(var(--muted))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: "rgb(var(--muted))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle()} labelFormatter={(value) => shortDate(String(value))} />
            <Legend wrapperStyle={{ color: "rgb(var(--muted))", fontSize: 12 }} />
            {series.map((item) =>
              kind === "area" ? (
                <Area
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.label}
                  stroke={item.color}
                  fill={item.color}
                  fillOpacity={0.16}
                  strokeWidth={2.5}
                />
              ) : (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.label}
                  stroke={item.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              )
            )}
          </Chart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function BarTrendChart({
  title,
  eyebrow,
  data,
  series,
  height = 260,
  stacked = false
}: {
  title: string;
  eyebrow?: string;
  data: ChartDatum[];
  series: Series[];
  height?: number;
  stacked?: boolean;
}) {
  return (
    <Card>
      <CardHeader title={title} eyebrow={eyebrow} />
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -18, right: 8, top: 6, bottom: 0 }}>
            <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={shortDate}
              tick={{ fill: "rgb(var(--muted))", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: "rgb(var(--muted))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle()} labelFormatter={(value) => shortDate(String(value))} />
            <Legend wrapperStyle={{ color: "rgb(var(--muted))", fontSize: 12 }} />
            {series.map((item) => (
              <Bar key={item.key} dataKey={item.key} name={item.label} fill={item.color} radius={[6, 6, 0, 0]} stackId={stacked ? "stack" : undefined} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
