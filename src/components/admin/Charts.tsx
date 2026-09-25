"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const AXIS = { fontSize: 9, fill: "#75838a", letterSpacing: 1 };
const INFO = "#27a7de";
const BRAND = "#214097";
const ORANGE = "#ffbb59";

function ChartPanel({
  title,
  legend,
  children,
  className,
}: {
  title: string;
  legend: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex h-[300px] flex-col rounded-[5px] bg-page px-[30px] pb-6 pt-11", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 px-2.5">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink">{title}</h3>
        <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.12em] text-ink-muted">{legend}</div>
      </div>
      <div className="mt-7 min-h-0 flex-1">{children}</div>
    </section>
  );
}

/** "Subscriptions chart" (design 49): thin blue monthly bars. */
export function SubscriptionsChart({ data }: { data: { month: string; value: number }[] }) {
  return (
    <ChartPanel
      title="Subscriptions chart"
      legend={
        <span className="flex items-center gap-2">
          <span className="h-[7px] w-[7px] bg-info" /> Number of subscriptions
        </span>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -12 }} barSize={5}>
          <XAxis dataKey="month" tick={AXIS} tickLine={{ stroke: "#292d32" }} axisLine={{ stroke: "#292d32" }} />
          <YAxis
            tick={AXIS}
            tickLine={{ stroke: "#292d32" }}
            axisLine={{ stroke: "#292d32" }}
            ticks={[200, 400, 600, 800, 1000]}
            domain={[0, 1100]}
          />
          <Tooltip cursor={{ fill: "rgba(39,167,222,0.08)" }} contentStyle={{ fontSize: 12 }} />
          <Bar dataKey="value" name="Subscriptions" fill={INFO} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

/** "Yearly entries chart" (designs 49, 69): navy subscriptions vs orange requests, in thousands. */
export function YearlyEntriesChart({
  data,
  className,
  subscriptionsColor = BRAND,
}: {
  data: { month: string; subscriptions: number; requests: number }[];
  className?: string;
  /** Navy on the dashboard (design 49), blue on the accounting summary (design 69). */
  subscriptionsColor?: string;
}) {
  return (
    <ChartPanel
      className={className}
      title="Yearly entries chart"
      legend={
        <>
          <span className="flex items-center gap-2 italic">
            <span className="h-px w-3 bg-info" /> Subscriptions
          </span>
          <span className="flex items-center gap-2 italic">
            <span className="h-px w-3 bg-brand-orange" /> Requests
          </span>
        </>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
          <XAxis dataKey="month" tick={AXIS} tickLine={{ stroke: "#292d32" }} axisLine={{ stroke: "#292d32" }} />
          <YAxis
            tick={AXIS}
            tickLine={{ stroke: "#292d32" }}
            axisLine={{ stroke: "#292d32" }}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(v: number) => `${v}K`}
            domain={[0, 5.5]}
          />
          <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => `${v}K`} />
          <Line type="monotone" dataKey="subscriptions" name="Subscriptions" stroke={subscriptionsColor} strokeWidth={1} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="requests" name="Requests" stroke={ORANGE} strokeWidth={1} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
