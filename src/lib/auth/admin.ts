import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isAdminRole, type AdminRole } from "./roles";

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

/** Logged in user. Redirects to login when there is no session. */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");
  return user;
});

/** Profile row for a user. Cached so one request only queries once. */
const getProfileById = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,role")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data;
});

/** Profile of the logged in user. Throws if it cannot be loaded. */
export const getCurrentProfile = cache(async () => {
  const user = await getCurrentUser();
  const profile = await getProfileById(user.id);
  if (!profile) throw new Error("Unable to load user profile.");
  return profile;
});

/** True when the logged in user is an admin or super admin. */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  const profile = await getProfileById(user.id);
  return isAdminRole(profile?.role);
}

/**
 * Protects an admin page or layout.
 * Redirects non admins home and returns the admin when allowed.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentUser();
  const profile = await getProfileById(user.id);

  if (!profile || !isAdminRole(profile.role)) redirect("/");

  return {
    id: profile.id,
    email: profile.email ?? user.email ?? "",
    role: profile.role,
  };
}

/** Same as requireAdmin, but throws instead of redirecting. */
export async function getAdmin(): Promise<AdminUser> {
  const user = await getCurrentUser();
  const profile = await getProfileById(user.id);

  if (!profile || !isAdminRole(profile.role)) {
    throw new Error("Unauthorized");
  }

  return {
    id: profile.id,
    email: profile.email ?? user.email ?? "",
    role: profile.role,
  };
}