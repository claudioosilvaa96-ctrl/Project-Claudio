import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  label,
  detail,
  className,
  tone = "default",
  showLabel = true
}: {
  value: number;
  label: string;
  detail?: string;
  className?: string;
  tone?: "default" | "inverse";
  showLabel?: boolean;
}) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  const textClassName = tone === "inverse" ? "text-white dark:text-[#0c1118]" : "text-ink";
  const trackColor = tone === "inverse" ? "rgba(255, 255, 255, 0.22)" : "rgb(var(--line))";

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
          <circle cx="56" cy="56" r={radius} stroke={trackColor} strokeWidth="10" fill="none" />
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="#8ce0d2"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className={cn("absolute inset-0 flex items-center justify-center text-2xl font-semibold", textClassName)}>{value}%</div>
      </div>
      {showLabel ? (
        <div>
          <p className="text-sm font-semibold text-ink">{label}</p>
          {detail ? <p className="mt-1 text-sm leading-5 text-muted">{detail}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
