import "server-only";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import { isAdminRole, type AdminRole } from "./roles";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

export type AdminApiContext =
  | { ok: true; user: User; role: AdminRole; supabase: ServerSupabase }
  | { ok: false; response: NextResponse };

function fail(error: string, status: number): AdminApiContext {
  return { ok: false, response: NextResponse.json({ error }, { status }) };
}

/**
 * Use in API routes:
 *
 *   const auth = await getAdminApiContext();
 *   if (!auth.ok) return auth.response;
 *   const { supabase, user } = auth;
 */
export async function getAdminApiContext(): Promise<AdminApiContext> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return fail("Unauthorized", 401);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || !isAdminRole(profile.role)) {
      return fail("Forbidden", 403);
    }

    return { ok: true, user, role: profile.role, supabase };
  } catch {
    return fail("Internal Server Error", 500);
  }
}

/** Old helper. Still works in every existing route. */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const auth = await getAdminApiContext();
  return auth.ok ? null : auth.response;
}