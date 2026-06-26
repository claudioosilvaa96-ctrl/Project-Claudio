import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-lg border border-line/80 bg-panel/88 p-4 shadow-soft backdrop-blur transition dark:shadow-darkSoft sm:p-5",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  eyebrow,
  action,
  className
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)}>
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{eyebrow}</p> : null}
        <h2 className="mt-1 text-base font-semibold text-ink sm:text-lg">{title}</h2>
      </div>
      {action}
    </div>
  );
}
