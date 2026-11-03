import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/auth/apiGuard";

export const maxDuration = 300;

export async function POST() {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    error: "CardShowHub automated retrieval is disabled until written permission or an approved feed is available.",
  }, { status: 503 });
}
