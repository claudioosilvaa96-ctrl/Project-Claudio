import { Footprints, Heart, ShieldCheck, Soup, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";

const recoveryTasks = [
  { label: "Drink water", icon: Soup },
  { label: "Stay close to calorie target", icon: ShieldCheck },
  { label: "20 minute walk", icon: Footprints },
  { label: "No unnecessary spending", icon: WalletCards },
  { label: "Spend time with family", icon: Heart }
];

export function RecoveryModePanel() {
  return (
    <Card className="border-brand/30 bg-brand/10 dark:bg-brand/15">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand dark:text-brand-dark">Recovery Mode</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Protect momentum.</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Today's goal is not progress. Today's goal is protecting momentum.
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {recoveryTasks.map((task) => {
          const Icon = task.icon;
          return (
            <div key={task.label} className="flex min-h-14 items-center gap-2 rounded-lg border border-line bg-panel/72 px-3 text-sm font-semibold text-ink">
              <Icon size={17} className="text-brand" />
              {task.label}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
