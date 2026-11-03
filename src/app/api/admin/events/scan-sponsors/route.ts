import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/auth/apiGuard";

export async function POST() {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    error: "Automated CardShowHub sponsor scanning is disabled until written permission or an approved feed is available.",
  }, { status: 503 });
}
