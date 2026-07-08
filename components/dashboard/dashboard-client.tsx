"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Flame,
  Gauge,
  HeartPulse,
  ShieldCheck,
  Target,
} from "lucide-react";

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
  motivationalQuote,
} from "@/lib/scoring";

import type { DailyLog } from "@/lib/types";
import { daysAgo } from "@/lib/utils";

const storageKey = "project-claudio-user-data";

function normalizeLogs(logs: DailyLog[]) {
  const today = daysAgo(0);

  const cleaned = logs.filter((l) => l.logDate <= today);

  if (cleaned.some((l) => l.logDate === today)) {
    return cleaned;
  }

  return [...cleaned, createEmptyDailyLog(today)];
}

export function DashboardClient() {
  const [logs, setLogs] = useState<DailyLog[]>([
    createEmptyDailyLog(daysAgo(0)),
  ]);

  const [hydrated, setHydrated] = useState(false);

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "local"
  >("idle");
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserId(user.id);
    }
  }

  loadUser();
}, []);

useEffect(() => {
  async function loadLogs() {
 const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  setHydrated(true);
  return;
}

setUserId(user.id);

const { data, error } = await supabase
  .from("daily_logs")
  .select("*")
  .eq("user_id", user.id)
  .order("log_date");

  if (error) {
  console.error(error);
  setHydrated(true);
  return;
}
if (data) {
  const mappedLogs: DailyLog[] = data.map((row: any) => ({
    id: row.id,
    userId: row.user_id,

  logDate: row.log_date,

  weightKg: row.weight_kg,
  mood: row.mood,
  sleepHours: row.sleep_hours,

  calories: row.calories,
  protein: row.protein,
  waterLitres: row.water_litres,
  steps: row.steps,

  gym: row.gym,
  football: row.football,
  mobility: row.mobility,

  moneySpent: row.money_spent,
  unnecessarySpending: row.unnecessary_spending,
  salesActivity: row.sales_activity,
  timeWithFamily: row.time_with_family,

  notes: row.notes,
  badDay: row.bad_day,

  createdAt: row.created_at,
  updatedAt: row.updated_at,
}));

      setLogs(normalizeLogs(mappedLogs));
    }

    setHydrated(true);
  }

  loadLogs();
}, []);

  const todayDate = daysAgo(0);

  const today =
    logs.find((l) => l.logDate === todayDate) ??
    createEmptyDailyLog(todayDate);

  const score = calculateDailyScore(today, defaultSettings);

  const recoveryScore = calculateRecoveryScore(today, defaultSettings);

  const recoveryMode = isRecoveryMode(today);

  const streak = currentStreak(logs, defaultSettings);

  const weekAverage = averageScore(logs, 7, defaultSettings);

  const monthAverage = averageScore(logs, 30, defaultSettings);

  const coachInsights = useMemo(
  () => generateCoachInsights(logs, defaultSettings),
  [logs]
);

  const scoreTrend = useMemo(() => {
    const recent = logs.slice(-14);

    const averages = rollingAverage(
      recent.map((l) => calculateDailyScore(l, defaultSettings).total),
      7
    );

    return recent.map((log, index) => ({
      date: log.logDate,
      score: calculateDailyScore(log, defaultSettings).total,
      average: averages[index],
    }));
  }, [logs]);

useEffect(() => {
 if (!hydrated || !userId) return;

  async function saveLogs() {
    setSaveStatus("saving");

    const rows = logs.map((log) => ({
      id: log.id,
      user_id:userId,

      log_date: log.logDate,

      weight_kg: log.weightKg,
      mood: log.mood,
      sleep_hours: log.sleepHours,

      calories: log.calories,
      protein: log.protein,
      water_litres: log.waterLitres,
      steps: log.steps,

      gym: log.gym,
      football: log.football,
      mobility: log.mobility,

      money_spent: log.moneySpent,
      unnecessary_spending: log.unnecessarySpending,
      sales_activity: log.salesActivity,
      time_with_family: log.timeWithFamily,

      notes: log.notes,
      bad_day: log.badDay,

      created_at: log.createdAt,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("daily_logs")
      .upsert(rows);

    if (error) {
      console.error(error);
      setSaveStatus("local");
      return;
    }

    setSaveStatus("saved");
  }

  saveLogs();

}, [logs, hydrated]);

  function updateToday(nextLog: DailyLog) {
    setLogs((current) => {
      const exists = current.some(
        (log) => log.logDate === nextLog.logDate
      );

      if (exists) {
        return current.map((log) =>
          log.logDate === nextLog.logDate
            ? {
                ...nextLog,
                updatedAt: new Date().toISOString(),
              }
            : log
        );
      }

      return [
        ...current,
        {
          ...nextLog,
          updatedAt: new Date().toISOString(),
        },
      ];
    });
  }

  return (
    <div className="page-grid">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Good Morning, Claudio
          </p>

          <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-normal text-ink sm:text-5xl">
            Today's Focus
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            {motivationalQuote(logs, today, defaultSettings)}
          </p>
        </div>

        <Card className="bg-ink text-white dark:bg-white dark:text-[#0c1118]">
          <p className="text-sm font-medium opacity-70">Today</p>

          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-semibold">
                {score.total}/{score.max}
              </p>

              <p className="mt-1 text-sm opacity-70">
                Behaviour score
              </p>
            </div>

            <ProgressRing
              value={score.percentage}
              label="Score"
              tone="inverse"
              className="scale-75"
              showLabel={false}
            />
          </div>
        </Card>
      </section>

      {recoveryMode && <RecoveryModePanel />}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Today's Score"
          value={`${score.total}/${score.max}`}
          detail="Behaviour over results"
          icon={<Gauge size={20} />}
        />

        <MetricCard
          label="Current Streak"
          value={String(streak)}
          detail="50%+ behaviour score days"
          icon={<Flame size={20} />}
          accent="amber"
        />

        <MetricCard
          label="Recovery Score"
          value={`${recoveryScore}%`}
          detail="Momentum protection"
          icon={<ShieldCheck size={20} />}
          accent="focus"
        />

        <MetricCard
          label="Averages"
          value={`${weekAverage} / ${monthAverage}`}
          detail="Weekly / Monthly"
          icon={<Activity size={20} />}
          accent="coral"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DailyCheckIn
          log={today}
          onChange={updateToday}
          status={saveStatus}
        />

        <div className="grid gap-4">
          <TodaysTasks
            score={score}
            recoveryMode={recoveryMode}
            log={today}
          />

          <AICoachCard insights={coachInsights} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <TrendChart
          title="Score trend"
          eyebrow="Weekly average"
          data={scoreTrend}
          kind="area"
          series={[
            {
              key: "score",
              label: "Daily",
              color: "#24786d",
            },
            {
              key: "average",
              label: "7-day average",
              color: "#4967c9",
            },
          ]}
        />

        <Card>
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Target
              size={18}
              className="text-brand"
            />
            Today's focus
          </div>

          <p className="mt-4 text-2xl font-semibold text-ink">
            {recoveryMode
              ? "Protect the floor"
              : "Win the behaviours"}
          </p>

          <p className="mt-3 text-sm leading-6 text-muted">
            {recoveryMode
              ? "Strip the day back to the actions that stop a spiral. Complete the floor and let that be enough."
              : "Hit calories, protein, one training action, family time and one career action. The outcome can catch up later."}
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-lg border border-line bg-ink/[0.03] p-3 text-sm text-muted dark:bg-white/[0.04]">
            <HeartPulse
              size={17}
              className="text-coral"
            />

            Daily weight is logged for trends only, never judgement.
          </div>
        </Card>
      </section>
    </div>
  );
}