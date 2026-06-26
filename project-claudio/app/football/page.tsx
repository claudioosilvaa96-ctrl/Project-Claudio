import { Activity, Dumbbell, Footprints, Gauge, Medal, Timer } from "lucide-react";
import { BarTrendChart, TrendChart } from "@/components/charts/trend-chart";
import { MetricCard } from "@/components/ui/metric-card";
import { workoutTypeCount } from "@/lib/analytics";
import { getDemoWorkoutHistory } from "@/lib/sample-data";

export default function FootballPage() {
  const history = getDemoWorkoutHistory();
  const latest = history.at(-1);

  const sessionData = history.map((session) => ({
    date: session.date,
    gym: session.type === "gym" ? 1 : 0,
    pitch: session.type === "pitch" ? 1 : 0,
    sprint: session.type === "sprint" ? 1 : 0,
    conditioning: session.type === "conditioning" ? 1 : 0,
    mobility: session.type === "mobility" ? 1 : 0
  }));

  const strengthData = history.map((session) => ({
    date: session.date,
    bench: session.benchKg,
    squat: session.squatKg,
    deadlift: session.deadliftKg
  }));

  const bodyweightData = history.map((session) => ({ date: session.date, bodyweight: session.bodyweightKg }));
  const ratingData = history.map((session) => ({ date: session.date, rating: session.sessionRating }));

  return (
    <div className="page-grid">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Football</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-normal text-ink">Build the athlete</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">Strength, pitch exposure, speed, conditioning, mobility, and bodyweight all in one progression view.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Gym" value={String(workoutTypeCount(history, "gym"))} detail="Sessions logged" icon={<Dumbbell size={20} />} />
        <MetricCard label="Pitch" value={String(workoutTypeCount(history, "pitch"))} detail="Ball work" icon={<Medal size={20} />} accent="focus" />
        <MetricCard label="Sprint" value={String(workoutTypeCount(history, "sprint"))} detail="Speed days" icon={<Timer size={20} />} accent="amber" />
        <MetricCard label="Conditioning" value={String(workoutTypeCount(history, "conditioning"))} detail="Engine work" icon={<Activity size={20} />} accent="coral" />
        <MetricCard label="Bodyweight" value={(latest?.bodyweightKg ?? 0).toFixed(1) + "kg"} detail="Latest logged" icon={<Gauge size={20} />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <BarTrendChart
          title="Session mix"
          eyebrow="Training exposure"
          data={sessionData}
          stacked
          series={[
            { key: "gym", label: "Gym", color: "#24786d" },
            { key: "pitch", label: "Pitch", color: "#4967c9" },
            { key: "sprint", label: "Sprint", color: "#d18b18" },
            { key: "conditioning", label: "Conditioning", color: "#d95f46" },
            { key: "mobility", label: "Mobility", color: "#7c8a96" }
          ]}
        />
        <TrendChart
          title="Strength progression"
          eyebrow="Main lifts"
          data={strengthData}
          series={[
            { key: "bench", label: "Bench", color: "#24786d" },
            { key: "squat", label: "Squat", color: "#4967c9" },
            { key: "deadlift", label: "Deadlift", color: "#d95f46" }
          ]}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <TrendChart title="Bodyweight" eyebrow="Trend context" data={bodyweightData} series={[{ key: "bodyweight", label: "Bodyweight", color: "#24786d" }]} kind="area" />
        <TrendChart title="Session rating" eyebrow="Load tolerance" data={ratingData} series={[{ key: "rating", label: "Rating", color: "#d18b18" }]} />
      </section>
    </div>
  );
}
