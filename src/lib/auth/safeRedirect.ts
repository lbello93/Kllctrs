const DEFAULT_REDIRECT = "/profile";

// Only allow paths inside this site, so a crafted link can't send people elsewhere.
export function safeRedirect(value: string | null | undefined): string {
  if (!value) return DEFAULT_REDIRECT;
  if (!value.startsWith("/")) return DEFAULT_REDIRECT;
  if (value.startsWith("//") || value.startsWith("/\\")) return DEFAULT_REDIRECT;
  // Browsers ignore tabs and line breaks inside URLs, so block control characters too.
  if (/[\u0000-\u001f\u007f]/.test(value)) return DEFAULT_REDIRECT;
  return value;
}