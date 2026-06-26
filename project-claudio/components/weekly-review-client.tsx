"use client";

import { useEffect, useMemo, useState } from "react";
import { Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import type { WeeklyReview } from "@/lib/types";
import { toISODate } from "@/lib/utils";

const storageKey = "project-claudio-weekly-review";

function currentWeekStart() {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay());
  return toISODate(date);
}

function emptyReview(): WeeklyReview {
  return {
    weekStart: currentWeekStart(),
    wentWell: "",
    didnt: "",
    learned: "",
    nextFocus: "",
    generatedSummary: ""
  };
}

function buildSummary(review: WeeklyReview) {
  const well = review.wentWell.trim() || "You found at least one thing worth keeping";
  const didnt = review.didnt.trim() || "some friction showed up";
  const learned = review.learned.trim() || "the system gets easier when the next action is small";
  const focus = review.nextFocus.trim() || "choose one clear focus";

  return "This week, " + well + ". The difficult part was " + didnt + ". The useful lesson: " + learned + ". Next week is about one thing: " + focus + ".";
}

export function WeeklyReviewClient() {
  const [review, setReview] = useState<WeeklyReview>(() => emptyReview());
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "local">("idle");

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) setReview(JSON.parse(stored) as WeeklyReview);
  }, []);

  const isSunday = useMemo(() => new Date().getDay() === 0, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(review));
  }, [review]);

  function update<K extends keyof WeeklyReview>(key: K, value: WeeklyReview[K]) {
    setReview((current) => ({ ...current, [key]: value }));
  }

  async function save(nextReview = review) {
    setStatus("saving");
    try {
      const response = await fetch("/api/weekly-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextReview)
      });
      setStatus(response.ok ? "saved" : "local");
    } catch {
      setStatus("local");
    }
  }

  function generateSummary() {
    const generatedSummary = buildSummary(review);
    const next = { ...review, generatedSummary };
    setReview(next);
    void save(next);
  }

  const fields: Array<{ key: keyof WeeklyReview; label: string }> = [
    { key: "wentWell", label: "What went well?" },
    { key: "didnt", label: "What didn't?" },
    { key: "learned", label: "What did I learn?" },
    { key: "nextFocus", label: "What is ONE focus for next week?" }
  ];

  return (
    <div className="page-grid">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Weekly Review</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-normal text-ink">Sunday reset</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
          {isSunday ? "Today is the review day." : "The Sunday review is ready when the week is ready."}
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.82fr]">
        <Card>
          <CardHeader
            title="Reflection"
            eyebrow="Progress, not perfection"
            action={<span className="rounded-lg bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand dark:text-brand-dark">{status === "idle" ? "Draft" : status}</span>}
          />
          <div className="grid gap-4">
            {fields.map((field) => (
              <label key={field.key} className="grid gap-1.5">
                <span className="text-sm font-medium text-muted">{field.label}</span>
                <textarea
                  value={String(review[field.key] ?? "")}
                  onChange={(event) => update(field.key, event.target.value)}
                  className="min-h-28 rounded-lg border border-line bg-ink/[0.03] p-3 text-sm text-ink outline-none transition focus:border-brand dark:bg-white/[0.04]"
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button onClick={generateSummary} className="sm:w-auto">
              <Sparkles size={16} />
              Generate summary
            </Button>
            <Button variant="secondary" onClick={() => save()} className="sm:w-auto">
              <Save size={16} />
              Save review
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Summary" eyebrow="Coach-ready" />
          <div className="rounded-lg border border-line bg-ink/[0.03] p-4 text-sm leading-7 text-muted dark:bg-white/[0.04]">
            {review.generatedSummary || "Generate a summary after the four answers are in."}
          </div>
        </Card>
      </section>
    </div>
  );
}
