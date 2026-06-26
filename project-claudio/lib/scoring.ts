import type { DailyLog, DailyScore, ScoreBreakdownItem, UserSettings } from "@/lib/types";
import { clamp } from "@/lib/utils";

export const defaultSettings: UserSettings = {
  displayName: "Claudio",
  calorieTarget: 2400,
  calorieTolerance: 180,
  proteinTarget: 180,
  waterTargetLitres: 2.5,
  stepsTarget: 8000,
  sleepTargetHours: 7,
  dailySpendLimit: 25,
  monthlySalesTarget: 18,
  houseDepositTarget: 45000,
  emergencyFundTarget: 10000,
  weeklyTrainingTarget: 4
};

export function createEmptyDailyLog(logDate: string): DailyLog {
  return {
    logDate,
    weightKg: 88,
    mood: 7,
    sleepHours: 7,
    calories: defaultSettings.calorieTarget,
    protein: defaultSettings.proteinTarget,
    waterLitres: 2.5,
    steps: 8000,
    gym: false,
    football: false,
    mobility: false,
    moneySpent: 0,
    unnecessarySpending: false,
    salesActivity: 0,
    timeWithFamily: false,
    notes: "",
    badDay: false
  };
}

function scoreItem(
  category: ScoreBreakdownItem["category"],
  label: string,
  points: number,
  maxPoints: number,
  achieved: boolean,
  message: string
): ScoreBreakdownItem {
  return {
    category,
    label,
    points: achieved ? points : 0,
    maxPoints,
    achieved,
    message
  };
}

export function calculateDailyScore(log: DailyLog, settings = defaultSettings): DailyScore {
  const caloriesInRange = Math.abs(log.calories - settings.calorieTarget) <= settings.calorieTolerance;
  const noUnnecessarySpending = !log.unnecessarySpending && log.moneySpent <= settings.dailySpendLimit;

  const breakdown: ScoreBreakdownItem[] = [
    scoreItem("calories", "Calories", 2, 2, caloriesInRange, "Close to target"),
    scoreItem("protein", "Protein", 1, 1, log.protein >= settings.proteinTarget, "Protein floor hit"),
    scoreItem("gym", "Gym", 2, 2, log.gym, "Strength work complete"),
    scoreItem("football", "Football", 2, 2, log.football, "Football work complete"),
    scoreItem("mobility", "Mobility", 1, 1, log.mobility, "Body cared for"),
    scoreItem("family", "Family", 2, 2, log.timeWithFamily, "Connection protected"),
    scoreItem("spending", "No unnecessary spending", 2, 2, noUnnecessarySpending, "Momentum protected"),
    scoreItem("sales", "Sales activity", 2, 2, log.salesActivity > 0, "Career action taken"),
    scoreItem("sleep", "Sleep", 1, 1, log.sleepHours >= settings.sleepTargetHours, "Enough recovery")
  ];

  const total = breakdown.reduce((sum, item) => sum + item.points, 0);
  const max = breakdown.reduce((sum, item) => sum + item.maxPoints, 0);

  return {
    total,
    max,
    percentage: clamp(Math.round((total / max) * 100)),
    breakdown
  };
}

export function isRecoveryMode(log: DailyLog) {
  return log.badDay || log.mood <= 4;
}

export function calculateRecoveryScore(log: DailyLog, settings = defaultSettings) {
  const supports = [
    log.waterLitres >= Math.min(2, settings.waterTargetLitres),
    Math.abs(log.calories - settings.calorieTarget) <= settings.calorieTolerance * 1.5,
    log.steps >= 3000,
    !log.unnecessarySpending,
    log.timeWithFamily,
    log.sleepHours >= 6,
    log.mobility || log.football || log.gym
  ];

  const base = supports.filter(Boolean).length / supports.length;
  const moodSupport = clamp(log.mood * 7, 15, 70);
  return clamp(Math.round(base * 70 + moodSupport * 0.3));
}

export function averageScore(logs: DailyLog[], days: number, settings = defaultSettings) {
  const slice = logs.slice(-days);
  if (!slice.length) return 0;
  const total = slice.reduce((sum, log) => sum + calculateDailyScore(log, settings).total, 0);
  return Math.round((total / slice.length) * 10) / 10;
}

export function currentStreak(logs: DailyLog[], settings = defaultSettings) {
  let streak = 0;
  for (let index = logs.length - 1; index >= 0; index -= 1) {
    const score = calculateDailyScore(logs[index], settings);
    if (score.percentage < 50) break;
    streak += 1;
  }
  return streak;
}

export function motivationalQuote(logs: DailyLog[], today: DailyLog, settings = defaultSettings) {
  const score = calculateDailyScore(today, settings);
  const recovery = isRecoveryMode(today);
  const weekAverage = averageScore(logs, 7, settings);

  if (recovery) {
    return "Today's goal is not progress. Today's goal is protecting momentum.";
  }

  if (score.percentage >= 80) {
    return "Stack the boring wins. They become identity.";
  }

  if (weekAverage >= 10) {
    return "You are building proof, one quiet action at a time.";
  }

  return "Progress does not need a perfect day. It needs a next action.";
}
