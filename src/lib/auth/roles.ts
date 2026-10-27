export const ADMIN_ROLES = ["admin", "super_admin"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(
  role: string | null | undefined,
): role is AdminRole {
  return !!role && (ADMIN_ROLES as readonly string[]).includes(role);
}