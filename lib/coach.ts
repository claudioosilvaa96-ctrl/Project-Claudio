import type { CoachInsight, DailyLog, FinanceSnapshot, UserSettings } from "@/lib/types";
import { defaultSettings } from "@/lib/scoring";

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function generateCoachInsights(
  logs: DailyLog[],
  finance: FinanceSnapshot[] = [],
  settings: UserSettings = defaultSettings
): CoachInsight[] {
  const insights: CoachInsight[] = [];
  const recent = logs.slice(-7);
  const previous = logs.slice(-14, -7);
  const latest = logs.at(-1);

  if (!latest) return insights;

  const recentWeight = average(recent.map((log) => log.weightKg));
  const previousWeight = average(previous.map((log) => log.weightKg));
  const caloriesOnTarget = recent.filter(
    (log) => Math.abs(log.calories - settings.calorieTarget) <= settings.calorieTolerance
  ).length >= 5;

  if (recentWeight > previousWeight + 0.25 && caloriesOnTarget) {
    insights.push({
      title: "The scale is not the story",
      body:
        "Weight is up a touch while calories are on target. That usually points to water, salt, stress, or training soreness. Keep judging the behaviour, not one weigh-in.",
      tone: "encourage"
    });
  }

  const missedGym = recent.filter((log) => !log.gym).length;
  if (missedGym >= 3) {
    insights.push({
      title: "Rebuild the training rhythm",
      body:
        "You have missed a few gym sessions. Make the next one deliberately small: warm-up, two compound lifts, leave. The win is showing up again.",
      tone: "focus"
    });
  }

  const lowMood = recent.filter((log) => log.mood <= 4).length;
  if (lowMood > 0 || latest.badDay) {
    insights.push({
      title: "Protect momentum today",
      body:
        "A lower mood day is a signal to reduce the load, not to quit. Water, a walk, family, and no unnecessary spending is a successful day.",
      tone: "recover"
    });
  }

  const latestFinance = finance.at(-1);
  const previousFinance = finance.at(-2);
  if (latestFinance && previousFinance) {
    const latestSaving = latestFinance.monthlyIncome - latestFinance.monthlySpending;
    const previousSaving = previousFinance.monthlyIncome - previousFinance.monthlySpending;

    if (latestSaving < previousSaving) {
      insights.push({
        title: "Savings slowed, but the system is still working",
        body:
          "One slower month does not break the house deposit plan. Pick one spending leak to close and keep the mortgage fund contribution automatic.",
        tone: "encourage"
      });
    }
  }

  if (!insights.length) {
    insights.push({
      title: "Quiet consistency is compounding",
      body:
        "Your recent behaviours are lining up. Keep the check-in short, keep the standard realistic, and let the trend do the talking.",
      tone: "encourage"
    });
  }

  return insights.slice(0, 3);
}
