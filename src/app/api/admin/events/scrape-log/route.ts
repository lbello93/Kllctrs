import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/auth/apiGuard";

export async function GET() {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    error: "Ingestion run history is unavailable because the checked-in schema does not include a run-log table.",
  }, { status: 503 });
}
