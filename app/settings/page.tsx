import Link from "next/link";
import { Bell, Database, KeyRound, Link2, Mic, Smartphone, Watch } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { defaultSettings } from "@/lib/scoring";
import { isSupabaseServerConfigured } from "@/lib/supabase/server";

const futureIntegrations = [
  { label: "Garmin", icon: Watch },
  { label: "MyFitnessPal", icon: Link2 },
  { label: "Bank feeds", icon: Database },
  { label: "Calendar", icon: Bell },
  { label: "Push notifications", icon: Smartphone },
  { label: "AI voice coach", icon: Mic },
  { label: "Apple Watch", icon: Watch }
];

export default function SettingsPage() {
  const configured = isSupabaseServerConfigured();

  return (
    <div className="page-grid">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Settings</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-normal text-ink">System controls</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">Targets, login, database status, and future integration slots.</p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader title="Account" eyebrow="Auth" action={<KeyRound size={20} className="text-brand" />} />
          <p className="text-sm leading-6 text-muted">Supabase is {configured ? "configured" : "waiting for environment keys"}.</p>
          <Link href="/login" className="focus-ring mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-line bg-panel px-3.5 text-sm font-semibold text-ink transition hover:border-brand/50 hover:bg-brand/5">Manage login</Link>
        </Card>

        <Card>
          <CardHeader title="Current targets" eyebrow="Scoring engine" />
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["Calories", String(defaultSettings.calorieTarget)],
              ["Protein", defaultSettings.proteinTarget + "g"],
              ["Water", defaultSettings.waterTargetLitres + "L"],
              ["Sleep", defaultSettings.sleepTargetHours + "h"],
              ["Daily spend", "£" + defaultSettings.dailySpendLimit],
              ["Sales target", defaultSettings.monthlySalesTarget + " cars"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-line bg-ink/[0.03] p-3 dark:bg-white/[0.04]">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
                <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card>
        <CardHeader title="Future integrations" eyebrow="Architecture-ready" />
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {futureIntegrations.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex min-h-14 items-center gap-3 rounded-lg border border-line bg-ink/[0.03] px-3 text-sm font-semibold text-ink dark:bg-white/[0.04]">
                <Icon size={17} className="text-brand" />
                {item.label}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
