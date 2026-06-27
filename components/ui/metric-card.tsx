import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  detail,
  icon,
  accent = "brand"
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  accent?: "brand" | "focus" | "amber" | "coral";
}) {
  const accents = {
    brand: "bg-brand/10 text-brand dark:text-brand-dark",
    focus: "bg-focus/10 text-focus dark:text-[#9aacff]",
    amber: "bg-amber/10 text-amber dark:text-[#f2bd61]",
    coral: "bg-coral/10 text-coral dark:text-[#ff9b86]"
  };

  return (
    <Card className="min-h-[132px]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {icon ? <div className={cn("rounded-lg p-2", accents[accent])}>{icon}</div> : null}
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-normal text-ink">{value}</p>
      {detail ? <p className="mt-2 text-sm text-muted">{detail}</p> : null}
    </Card>
  );
}
