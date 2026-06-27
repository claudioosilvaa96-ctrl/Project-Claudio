import type { DailyLog, FinanceSnapshot, SalesDay, WorkoutSession } from "@/lib/types";
import { daysAgo } from "@/lib/utils";

export function getDemoDailyLogs(): DailyLog[] {
  return Array.from({ length: 35 }, (_, offset) => {
    const index = 34 - offset;
    const hardDay = index === 4 || index === 12 || index === 19;
    const gym = index % 3 === 0 || index % 8 === 0;
    const football = index % 4 === 1;
    const mobility = index % 2 === 0;

    return {
      id: "demo-log-" + index,
      logDate: daysAgo(index),
      weightKg: Number((88.6 - offset * 0.045 + Math.sin(offset / 2) * 0.28).toFixed(1)),
      mood: hardDay ? 4 : Math.max(5, 8 - (index % 5 === 0 ? 1 : 0)),
      sleepHours: Number((6.4 + (offset % 5) * 0.22).toFixed(1)),
      calories: 2360 + ((offset % 6) - 2) * 70,
      protein: 168 + (offset % 5) * 6,
      waterLitres: Number((2.1 + (offset % 4) * 0.25).toFixed(1)),
      steps: 6200 + (offset % 7) * 620,
      gym,
      football,
      mobility,
      moneySpent: index % 9 === 0 ? 46 : 12 + (offset % 4) * 3,
      unnecessarySpending: index % 9 === 0,
      salesActivity: index % 6 === 0 ? 0 : 2 + (offset % 4),
      timeWithFamily: index % 3 !== 2,
      notes: hardDay ? "Lower mood. Keep the floor high." : "",
      badDay: false
    };
  });
}

export function getDemoWorkoutHistory(): WorkoutSession[] {
  const types: WorkoutSession["type"][] = ["gym", "pitch", "sprint", "conditioning", "mobility"];

  return Array.from({ length: 24 }, (_, offset) => ({
    id: "workout-" + offset,
    date: daysAgo(48 - offset * 2),
    type: types[offset % types.length],
    bodyweightKg: Number((89 - offset * 0.08 + Math.sin(offset) * 0.2).toFixed(1)),
    benchKg: offset % 5 === 0 ? undefined : 82.5 + Math.floor(offset / 4) * 2.5,
    squatKg: offset % 5 === 1 ? undefined : 120 + Math.floor(offset / 5) * 2.5,
    deadliftKg: offset % 5 === 2 ? undefined : 150 + Math.floor(offset / 6) * 2.5,
    sessionRating: 6 + (offset % 4)
  }));
}

export function getDemoSalesDays(): SalesDay[] {
  return Array.from({ length: 28 }, (_, offset) => ({
    id: "sales-" + offset,
    date: daysAgo(27 - offset),
    carsSold: offset % 6 === 0 ? 1 : 0,
    appointments: 1 + (offset % 4),
    calls: 18 + (offset % 7) * 4,
    financeConversions: offset % 8 === 0 ? 1 : 0,
    commissionEstimate: offset % 6 === 0 ? 420 + (offset % 3) * 120 : 0
  }));
}

export function getDemoFinanceSnapshots(): FinanceSnapshot[] {
  return Array.from({ length: 8 }, (_, offset) => ({
    id: "finance-" + offset,
    date: daysAgo((7 - offset) * 30),
    currentSavings: 14200 + offset * 760,
    mortgageFund: 9800 + offset * 610,
    emergencyFund: 3600 + offset * 210,
    investments: 2250 + offset * 180,
    monthlySpending: 2250 + (offset % 3) * 120,
    monthlyIncome: 4100 + (offset % 2) * 160
  }));
}
