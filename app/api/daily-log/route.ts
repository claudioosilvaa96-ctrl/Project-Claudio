import { NextRequest, NextResponse } from "next/server";
import type { DailyLog } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function toDailyLogRow(log: DailyLog, userId: string) {
  return {
    user_id: userId,
    log_date: log.logDate,
    weight_kg: log.weightKg,
    mood: log.mood,
    sleep_hours: log.sleepHours,
    calories: log.calories,
    protein: log.protein,
    water_litres: log.waterLitres,
    steps: log.steps,
    gym: log.gym,
    football: log.football,
    mobility: log.mobility,
    money_spent: log.moneySpent,
    unnecessary_spending: log.unnecessarySpending,
    sales_activity: log.salesActivity,
    time_with_family: log.timeWithFamily,
    notes: log.notes,
    bad_day: log.badDay,
    updated_at: new Date().toISOString()
  };
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as DailyLog;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ ok: true, mode: "local" });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: true, mode: "local" });
  }

  const { error } = await supabase
    .from("daily_logs")
    .upsert(toDailyLogRow(body, user.id), { onConflict: "user_id,log_date" });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, mode: "remote" });
}
