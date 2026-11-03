import { timingSafeEqual } from "crypto";

export function isAuthorizedCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const provided = request.headers.get("authorization");
  if (!provided) return false;

  // Constant-time comparison so a timing side channel can't be used to
  // guess the token. The length check only leaks the token length.
  const a = Buffer.from(provided);
  const b = Buffer.from(`Bearer ${secret}`);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
