import { Activity, BedDouble, Dumbbell, Scale, ShieldCheck, Utensils } from "lucide-react";
import { BarTrendChart, TrendChart } from "@/components/charts/trend-chart";
import { MetricCard } from "@/components/ui/metric-card";
import { calculateRecoveryScore } from "@/lib/scoring";
import { getDemoDailyLogs } from "@/lib/sample-data";
import { rollingAverage } from "@/lib/analytics";

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export default function HealthPage() {
  const logs = getDemoDailyLogs();
  const weights = logs.map((log) => log.weightKg);
  const weightAverage = rollingAverage(weights, 7);
  const startAverage = average(weightAverage.slice(0, 7));
  const endAverage = average(weightAverage.slice(-7));
  const trendDirection = Number((endAverage - startAverage).toFixed(1));

  const weightTrend = logs.map((log, index) => ({
    date: log.logDate,
    weight: log.weightKg,
    trend: weightAverage[index]
  }));

  const weeklyWeight = Array.from({ length: Math.ceil(logs.length / 7) }, (_, index) => {
    const chunk = logs.slice(index * 7, index * 7 + 7);
    return {
      date: chunk.at(-1)?.logDate ?? logs.at(-1)?.logDate ?? "",
      average: Number(average(chunk.map((log) => log.weightKg)).toFixed(1))
    };
  });

  const nutrition = logs.map((log) => ({ date: log.logDate, calories: log.calories, protein: log.protein }));
  const training = logs.map((log) => ({ date: log.logDate, gym: log.gym ? 1 : 0, football: log.football ? 1 : 0, mobility: log.mobility ? 1 : 0 }));
  const sleep = logs.map((log) => ({ date: log.logDate, sleep: log.sleepHours }));
  const recovery = logs.map((log) => ({ date: log.logDate, recovery: calculateRecoveryScore(log) }));

  return (
    <div className="page-grid">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Health</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-normal text-ink">Trends over noise</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">Daily entries feed the system, but decisions come from weekly and monthly direction.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Weight trend" value={(trendDirection > 0 ? "+" : "") + trendDirection + "kg"} detail="30-day rolling direction" icon={<Scale size={20} />} />
        <MetricCard label="Avg sleep" value={average(logs.slice(-7).map((log) => log.sleepHours)).toFixed(1) + "h"} detail="Last 7 days" icon={<BedDouble size={20} />} accent="focus" />
        <MetricCard label="Training" value={String(training.slice(-7).filter((day) => day.gym || day.football || day.mobility).length)} detail="Sessions this week" icon={<Dumbbell size={20} />} accent="amber" />
        <MetricCard label="Recovery" value={String(Math.round(average(recovery.slice(-7).map((day) => day.recovery)))) + "%"} detail="Weekly average" icon={<ShieldCheck size={20} />} accent="coral" />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <TrendChart
          title="Weight trend"
          eyebrow="Trend line prioritised"
          data={weightTrend}
          series={[
            { key: "trend", label: "7-day average", color: "#24786d" },
            { key: "weight", label: "Daily log", color: "#a5b4c0" }
          ]}
          kind="area"
        />
        <TrendChart
          title="Weekly average weight"
          eyebrow="Decision view"
          data={weeklyWeight}
          series={[{ key: "average", label: "Weekly average", color: "#4967c9" }]}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <TrendChart
          title="Calories and protein"
          eyebrow="Behaviour inputs"
          data={nutrition}
          series={[
            { key: "calories", label: "Calories", color: "#d18b18" },
            { key: "protein", label: "Protein", color: "#24786d" }
          ]}
        />
        <BarTrendChart
          title="Training sessions"
          eyebrow="Gym, football, mobility"
          data={training}
          stacked
          series={[
            { key: "gym", label: "Gym", color: "#24786d" },
            { key: "football", label: "Football", color: "#4967c9" },
            { key: "mobility", label: "Mobility", color: "#d18b18" }
          ]}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <TrendChart title="Sleep" eyebrow="Recovery input" data={sleep} series={[{ key: "sleep", label: "Hours", color: "#4967c9" }]} />
        <TrendChart title="Recovery score" eyebrow="Momentum protection" data={recovery} series={[{ key: "recovery", label: "Recovery", color: "#d95f46" }]} kind="area" />
      </section>
    </div>
  );
}
