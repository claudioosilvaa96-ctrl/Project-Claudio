import { Bot, HeartHandshake, Sparkles } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import type { CoachInsight } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AICoachCard({ insights }: { insights: CoachInsight[] }) {
  return (
    <Card>
      <CardHeader title="AI coach" eyebrow="Trend analysis" action={<Bot size={20} className="text-brand" />} />
      <div className="grid gap-3">
        {insights.map((insight) => (
          <article
            key={insight.title}
            className={cn(
              "rounded-lg border p-3",
              insight.tone === "recover"
                ? "border-coral/30 bg-coral/10"
                : insight.tone === "focus"
                  ? "border-focus/30 bg-focus/10"
                  : "border-brand/30 bg-brand/10"
            )}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              {insight.tone === "recover" ? <HeartHandshake size={16} /> : <Sparkles size={16} />}
              {insight.title}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{insight.body}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
