import { NextRequest, NextResponse } from "next/server";
import { generateCoachInsights } from "@/lib/coach";
import type { DailyLog } from "@/lib/types";

export async function POST(request: NextRequest) {
const body = (await request.json()) as {
  logs: DailyLog[];
};

const insights = generateCoachInsights(
  body.logs ?? []
);

  return NextResponse.json({ insights, provider: "rules" });
}
