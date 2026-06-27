import type { DailyLog, SalesDay, WorkoutSession } from "@/lib/types";

export function rollingAverage(values: number[], windowSize: number) {
  return values.map((_, index) => {
    const window = values.slice(Math.max(0, index - windowSize + 1), index + 1);
    return Number((window.reduce((sum, value) => sum + value, 0) / window.length).toFixed(1));
  });
}

export function trainingSessionsThisWeek(logs: DailyLog[]) {
  return logs.slice(-7).filter((log) => log.gym || log.football || log.mobility).length;
}

export function workoutTypeCount(history: WorkoutSession[], type: WorkoutSession["type"]) {
  return history.filter((session) => session.type === type).length;
}

export function monthlySalesTotal(days: SalesDay[]) {
  return days.reduce((sum, day) => sum + day.carsSold, 0);
}

export function monthlyCommissionTotal(days: SalesDay[]) {
  return days.reduce((sum, day) => sum + day.commissionEstimate, 0);
}
