/**
 * Client-side Supabase auth helpers (profile-based system).
 *
 * Verification + reset emails are sent by Supabase (custom SMTP configured in the
 * dashboard) — no third-party email library is used. All functions run in the
 * browser against the SSR browser client, which persists the session in cookies.
 */
"use client";

import { createClient } from "@/lib/supabase/client";
import type { TablesUpdate } from "@/types/database";

const supabase = createClient();

export interface SignUpArgs {
  email: string;
  password: string;
  displayName: string;
  username?: string;
}

export async function signUp({ email, password, displayName, username }: SignUpArgs) {
  return supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/callback`,
      data: {
        display_name: displayName.trim(),
        full_name: displayName.trim(),
        username: (username ?? email.split("@")[0]).trim(),
      },
    },
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email: email.trim(), password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** Send a password-reset email that returns the user to the update-password page. */
export async function requestPasswordReset(email: string) {
  return supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/callback?next=/auth/update-password`,
  });
}

/** Set a new password (call from the update-password page after the reset link). */
export async function updatePassword(password: string) {
  return supabase.auth.updateUser({ password });
}

/** Update the current user's profile row. */
export async function updateProfile(userId: string, patch: TablesUpdate<"profiles">) {
  return supabase.from("profiles").update(patch).eq("id", userId);
}

export { supabase };
