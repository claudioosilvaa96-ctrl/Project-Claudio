import { NextRequest, NextResponse } from "next/server";
import type { WeeklyReview } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as WeeklyReview;
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

  const { error } = await supabase.from("weekly_reviews").upsert(
    {
      user_id: user.id,
      week_start: body.weekStart,
      went_well: body.wentWell,
      didnt: body.didnt,
      learned: body.learned,
      next_focus: body.nextFocus,
      generated_summary: body.generatedSummary
    },
    { onConflict: "user_id,week_start" }
  );

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, mode: "remote" });
}
