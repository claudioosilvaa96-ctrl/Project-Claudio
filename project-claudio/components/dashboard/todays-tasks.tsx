import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import type { DailyLog, DailyScore } from "@/lib/types";

export function TodaysTasks({ score, recoveryMode, log }: { score: DailyScore; recoveryMode: boolean; log: DailyLog }) {
  const caloriesAchieved = score.breakdown.some((item) => item.category === "calories" && item.achieved);
  const spendingAchieved = score.breakdown.some((item) => item.category === "spending" && item.achieved);
  const familyAchieved = score.breakdown.some((item) => item.category === "family" && item.achieved);

  const tasks = recoveryMode
    ? [
        { label: "Drink water", achieved: log.waterLitres >= 2 },
        { label: "Stay close to calorie target", achieved: caloriesAchieved },
        { label: "20 minute walk", achieved: log.steps >= 3000 },
        { label: "No unnecessary spending", achieved: spendingAchieved },
        { label: "Spend time with family", achieved: familyAchieved }
      ]
    : score.breakdown.map((item) => ({ label: item.label, achieved: item.achieved }));

  return (
    <Card>
      <CardHeader title="Today's tasks" eyebrow={recoveryMode ? "Recovery floor" : "Behaviour score"} />
      <div className="grid gap-2">
        {tasks.map((task) => (
          <div key={task.label} className="flex items-center justify-between rounded-lg border border-line bg-ink/[0.025] px-3 py-2.5 dark:bg-white/[0.04]">
            <span className="text-sm font-medium text-ink">{task.label}</span>
            {task.achieved ? <CheckCircle2 size={18} className="text-brand" /> : <Circle size={18} className="text-muted" />}
          </div>
        ))}
      </div>
    </Card>
  );
}
