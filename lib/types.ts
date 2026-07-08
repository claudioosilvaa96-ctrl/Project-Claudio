export type DailyLog = {
  id?: string;
  userId?: string;
  logDate: string;
  weightKg: number;
  mood: number;
  sleepHours: number;
  calories: number;
  protein: number;
  waterLitres: number;
  steps: number;
  gym: boolean;
  football: boolean;
  mobility: boolean;
  moneySpent: number;
  unnecessarySpending: boolean;
  salesActivity: number;
  timeWithFamily: boolean;
  notes: string;
  badDay: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ScoreCategory =
  | "calories"
  | "protein"
  | "gym"
  | "football"
  | "mobility"
  | "family"
  | "spending"
  | "sales"
  | "sleep";

export type ScoreBreakdownItem = {
  category: ScoreCategory;
  label: string;
  points: number;
  maxPoints: number;
  achieved: boolean;
  message: string;
};

export type DailyScore = {
  total: number;
  max: number;
  percentage: number;
  breakdown: ScoreBreakdownItem[];
};

export type WeeklyReview = {
  id?: string;
  weekStart: string;
  wentWell: string;
  didnt: string;
  learned: string;
  nextFocus: string;
  generatedSummary: string;
  createdAt?: string;
};

export type WorkoutSession = {
  id: string;
  date: string;
  type: "gym" | "pitch" | "sprint" | "conditioning" | "mobility";
  bodyweightKg: number;
  benchKg?: number;
  squatKg?: number;
  deadliftKg?: number;
  sessionRating: number;
};

export type SalesDay = {
  id: string;
  date: string;
  carsSold: number;
  appointments: number;
  calls: number;
  financeConversions: number;
  commissionEstimate: number;
};

export type FinanceSnapshot = {
  id: string;
  date: string;
  currentSavings: number;
  mortgageFund: number;
  emergencyFund: number;
  investments: number;
  monthlySpending: number;
  monthlyIncome: number;
};

export type UserSettings = {
  displayName: string;
  calorieTarget: number;
  calorieTolerance: number;
  proteinTarget: number;
  waterTargetLitres: number;
  stepsTarget: number;
  sleepTargetHours: number;
  dailySpendLimit: number;
  monthlySalesTarget: number;
  houseDepositTarget: number;
  emergencyFundTarget: number;
  weeklyTrainingTarget: number;
};

export type CoachInsight = {
  title: string;
  body: string;
  tone: "encourage" | "recover" | "focus";
};
