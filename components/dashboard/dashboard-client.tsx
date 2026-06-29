"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Flame, Gauge, HeartPulse, ShieldCheck, Target } from "lucide-react";
import { DailyCheckIn } from "@/components/check-in/daily-check-in";
import { ProgressRing } from "@/components/charts/progress-ring";
import { TrendChart } from "@/components/charts/trend-chart";
import { AICoachCard } from "@/components/dashboard/ai-coach-card";
import { RecoveryModePanel } from "@/components/dashboard/recovery-mode-panel";
import { TodaysTasks } from "@/components/dashboard/todays-tasks";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { rollingAverage } from "@/lib/analytics";
import { generateCoachInsights } from "@/lib/coach";
import {
  averageScore,
  calculateDailyScore,
  calculateRecoveryScore,
  createEmptyDailyLog,
  currentStreak,
  defaultSettings,
  isRecoveryMode,
  motivationalQuote
} from "@/lib/scoring";
import type { DailyLog } from "@/lib/types";
import { daysAgo } from "@/lib/utils";

const storageKey = "project-claudio-user-data";

function normalizeLogs(logs: DailyLog[]) {
  const today = daysAgo(0);
  const withoutFuture = logs.filter((log) => log.logDate <= today);
  const existingToday = withoutFuture.find((log) => log.logDate === today);

  if (existingToday) return withoutFuture;
  return [...withoutFuture, createEmptyDailyLog(today)];
}

export function DashboardClient() {
const [logs, setLogs] = useState<DailyLog[]>([
  createEmptyDailyLog(daysAgo(0)),
]);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "local">("idle");

useEffect(() => {
  async function loadLogs() {
    const { data, error } = await supabase
      .from("daily_logs")
      .select("*")
      .order("log_date", { ascending: true });

    if (error) {
      console.error(error);
      setHydrated(true);
      return;
    }

    if (data) {
      setLogs(normalizeLogs(data as DailyLog[]));
    }

    setHydrated(true);
  }

  loadLogs();
}, []);

  const todayDate = daysAgo(0);

const today =
  logs.find(log => log.logDate === todayDate)
  ?? createEmptyDailyLog(todayDate);
  const score = calculateDailyScore(today, defaultSettings);
  const recoveryScore = calculateRecoveryScore(today, defaultSettings);
  const recoveryMode = isRecoveryMode(today);
  const weekAverage = averageScore(logs, 7, defaultSettings);
  const monthAverage = averageScore(logs, 30, defaultSettings);
  const streak = currentStreak(logs, defaultSettings);

 const coachInsights = useMemo(
  () => generateCoachInsights(logs, [], defaultSettings),
  [logs]
);

  const scoreTrend = useMemo(() => {
    const recent = logs.slice(-14);
    const averages = rollingAverage(
      recent.map((log) => calculateDailyScore(log, defaultSettings).total),
      7
    );

    return recent.map((log, index) => ({
      date: log.logDate,
      score: calculateDailyScore(log, defaultSettings).total,
      average: averages[index]
    }));
  }, [logs]);

  import { supabase } from "@/lib/supabase/client";
  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(storageKey, JSON.stringify(logs));
    setSaveStatus("saving");

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/daily-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(today)
        });
        setSaveStatus(response.ok ? "saved" : "local");
      } catch {
        setSaveStatus("local");
      }
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [hydrated, logs, today]);

function updateToday(nextLog: DailyLog) {
  setLogs(current => {
    const exists = current.some(
      log => log.logDate === nextLog.logDate
    );

    if (exists) {
      return current.map(log =>
        log.logDate === nextLog.logDate
          ? {
              ...nextLog,
              updatedAt: new Date().toISOString()
            }
          : log
      );
    }

    return [
      ...current,
      {
        ...nextLog,
        updatedAt: new Date().toISOString()
      }
    ];
  });
}

  return (
    <div className="page-grid">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Good Morning, Claudio</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-normal text-ink sm:text-5xl">Today's Focus</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{motivationalQuote(logs, today, defaultSettings)}</p>
        </div>
        <Card className="bg-ink text-white dark:bg-white dark:text-[#0c1118]">
          <p className="text-sm font-medium opacity-70">Today</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-semibold">{score.total}/{score.max}</p>
              <p className="mt-1 text-sm opacity-70">Behaviour score</p>
            </div>
            <ProgressRing value={score.percentage} label="Score" className="scale-75" tone="inverse" showLabel={false} />
          </div>
        </Card>
      </section>

      {recoveryMode ? <RecoveryModePanel /> : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Today's Score" value={score.total + "/" + score.max} detail="Behaviour over results" icon={<Gauge size={20} />} />
        <MetricCard label="Current Streak" value={String(streak)} detail="50%+ behaviour score days" icon={<Flame size={20} />} accent="amber" />
        <MetricCard label="Recovery Score" value={String(recoveryScore) + "%"} detail="Momentum protection" icon={<ShieldCheck size={20} />} accent="focus" />
        <MetricCard label="Averages" value={weekAverage + " / " + monthAverage} detail="Weekly / monthly score" icon={<Activity size={20} />} accent="coral" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DailyCheckIn log={today} onChange={updateToday} status={saveStatus} />
        <div className="grid gap-4">
          <TodaysTasks score={score} recoveryMode={recoveryMode} log={today} />
          <AICoachCard insights={coachInsights} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <TrendChart
          title="Score trend"
          eyebrow="Weekly average"
          data={scoreTrend}
          series={[
            { key: "score", label: "Daily", color: "#24786d" },
            { key: "average", label: "7-day average", color: "#4967c9" }
          ]}
          kind="area"
        />
        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Target size={18} className="text-brand" />
            Today's focus
          </div>
          <p className="mt-4 text-2xl font-semibold text-ink">{recoveryMode ? "Protect the floor" : "Win the behaviours"}</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            {recoveryMode
              ? "Strip the day back to the actions that stop a spiral. Complete the floor and let that be enough."
              : "Hit calories, protein, one training action, family time, and one career action. The outcome can catch up later."}
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-line bg-ink/[0.03] p-3 text-sm text-muted dark:bg-white/[0.04]">
            <HeartPulse size={17} className="text-coral" />
            Daily weight is logged for trends only, never judgement.
          </div>
        </Card>
      </section>
    </div>
  );
}
