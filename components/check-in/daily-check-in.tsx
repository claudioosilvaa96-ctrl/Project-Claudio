"use client";

import type { ElementType } from "react";
import type { DailyLog } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Dumbbell, Heart, ShieldAlert, Trophy } from "lucide-react";

type NumberField = "weightKg" | "mood" | "sleepHours" | "calories" | "protein" | "waterLitres" | "steps" | "moneySpent" | "salesActivity";

type BooleanField = "gym" | "football" | "mobility" | "unnecessarySpending" | "timeWithFamily" | "badDay";

const numberFields: Array<{
  key: NumberField;
  label: string;
  step?: string;
  min?: number;
  max?: number;
  suffix?: string;
}> = [
  { key: "weightKg", label: "Weight", step: "0.1", min: 40, suffix: "kg" },
  { key: "mood", label: "Mood", step: "1", min: 1, max: 10, suffix: "/10" },
  { key: "sleepHours", label: "Sleep", step: "0.1", min: 0, max: 14, suffix: "hrs" },
  { key: "calories", label: "Calories", step: "10", min: 0 },
  { key: "protein", label: "Protein", step: "1", min: 0, suffix: "g" },
  { key: "waterLitres", label: "Water", step: "0.1", min: 0, suffix: "L" },
  { key: "steps", label: "Steps", step: "100", min: 0 },
  { key: "moneySpent", label: "Money spent", step: "1", min: 0, suffix: "€" },
  { key: "salesActivity", label: "Sales activity", step: "1", min: 0 }
];

const toggles: Array<{ key: BooleanField; label: string; icon: ElementType }> = [
  { key: "gym", label: "Gym", icon: Dumbbell },
  { key: "football", label: "Football", icon: Trophy },
  { key: "mobility", label: "Mobility", icon: Check },
  { key: "unnecessarySpending", label: "Unnecessary spend", icon: ShieldAlert },
  { key: "timeWithFamily", label: "Family", icon: Heart }
];

export function DailyCheckIn({
  log,
  onChange,
  status
}: {
  log: DailyLog;
  onChange: (log: DailyLog) => void;
  status: "idle" | "saving" | "saved" | "local";
}) {
  function updateNumber(key: NumberField, value: string) {
    onChange({ ...log, [key]: Number(value) });
  }

  function updateBoolean(key: BooleanField, value: boolean) {
    onChange({ ...log, [key]: value });
  }

  return (
    <Card className="animate-fade-up">
      <CardHeader
        title="Daily check-in"
        eyebrow="Under 2 minutes"
        action={
          <span className="rounded-lg bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand dark:text-brand-dark">
            {status === "saving" ? "Saving" : status === "saved" ? "Saved" : status === "local" ? "Local" : "Ready"}
          </span>
        }
      />
<div className="grid gap-5 lg:grid-cols-2">
  {numberFields.map((field) => (
    <label key={field.key} className="grid gap-2">
      <span className="text-base font-medium text-muted">
        {field.label}
      </span>

      <div className="flex h-14 items-center rounded-xl border border-line bg-panel px-4">
        <input
          className="w-full bg-transparent text-lg font-semibold outline-none"
          type="number"
          value={log[field.key]}
          step={field.step}
          min={field.min}
          max={field.max}
          onChange={(event) => updateNumber(field.key, event.target.value)}
        />

        {field.suffix && (
          <span className="ml-3 whitespace-nowrap text-sm text-muted">
            {field.suffix}
          </span>
        )}
      </div>
    </label>
  ))}
</div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {toggles.map((toggle) => {
          const Icon = toggle.icon;
          const active = Boolean(log[toggle.key]);

          return (
            <button
              key={toggle.key}
              type="button"
              onClick={() => updateBoolean(toggle.key, !active)}
              className={cn(
                "focus-ring flex min-h-12 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition",
                active
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-panel text-muted hover:border-brand/60 hover:text-ink"
              )}
            >
              <Icon size={16} />
              <span className="truncate">{toggle.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3">
        <label className="flex flex-col gap-2">
          <span className="text-base font-medium text-muted">Notes</span>
          <textarea
            value={log.notes}
            onChange={(event) => onChange({ ...log, notes: event.target.value })}
            className="min-h-24 rounded-lg border border-line bg-ink/[0.03] p-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand dark:bg-white/[0.04]"
            placeholder="Anything useful to remember?"
          />
        </label>

        <Button
          variant={log.badDay ? "danger" : "secondary"}
          onClick={() => updateBoolean("badDay", !log.badDay)}
          className="w-full justify-center"
        >
          <ShieldAlert size={16} />
          {log.badDay ? "Recovery Mode On" : "Bad Day"}
        </Button>
      </div>
    </Card>
  );
}
