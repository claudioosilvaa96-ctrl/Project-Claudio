import { cn } from "@/lib/utils";

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10", className)}>
      <div
        className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
        style={{ width: Math.min(100, Math.max(0, value)) + "%" }}
      />
    </div>
  );
}
