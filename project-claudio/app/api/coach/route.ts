import { NextRequest, NextResponse } from "next/server";
import { generateCoachInsights } from "@/lib/coach";
import type { DailyLog, FinanceSnapshot } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { logs: DailyLog[]; finance?: FinanceSnapshot[] };
  const insights = generateCoachInsights(body.logs ?? [], body.finance ?? []);

  return NextResponse.json({ insights, provider: "rules" });
}
