"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  Dumbbell,
  HeartPulse,
  Home,
  Landmark,
  Settings,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Today", icon: Home },
  { href: "/health", label: "Health", icon: HeartPulse },
  { href: "/football", label: "Football", icon: Dumbbell },
  { href: "/career", label: "Career", icon: BriefcaseBusiness },
  { href: "/money", label: "Money", icon: Landmark },
  { href: "/review", label: "Review", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-line/70 bg-panel/72 px-4 py-5 backdrop-blur-xl lg:block">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-white">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Project Claudio</p>
            <p className="text-xs text-muted">Progress over perfection</p>
          </div>
        </Link>

        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  active ? "bg-brand text-white" : "text-muted hover:bg-ink/5 hover:text-ink dark:hover:bg-white/10"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-line bg-panel p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Sparkles size={16} className="text-brand" />
            Recovery-ready
          </div>
          <p className="mt-2 text-sm leading-5 text-muted">When the day is heavy, the app lowers the bar without dropping the standard.</p>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-line/60 bg-panel/70 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
              <ShieldCheck size={18} />
            </span>
            Project Claudio
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
        <div className="hidden justify-end lg:flex">
          <ThemeToggle />
        </div>
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-panel/88 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-7 gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium transition",
                  active ? "bg-brand text-white" : "text-muted hover:bg-ink/5 hover:text-ink dark:hover:bg-white/10"
                )}
              >
                <Icon size={18} />
                <span className="max-w-full truncate px-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
