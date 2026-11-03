import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/lib/auth/apiGuard";
import { generateWeeklyStudioBatch } from "@/lib/content/weekly";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const result = await generateWeeklyStudioBatch();
  return NextResponse.json(result);
}
