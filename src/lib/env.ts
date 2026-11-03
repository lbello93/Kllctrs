import "server-only";

/**
 * Centralized required-environment validation. Importing this module (server
 * side only) fails fast with a clear message when a required secret is missing.
 *
 * NOTE: the original spec listed OPENAI_API_KEY, but this project uses
 * Anthropic/Gemini and has no OpenAI integration, so requiring it would throw
 * on every import. The AI provider keys are feature-gated and validated at
 * their call sites, so only the always-required Supabase trio lives here.
 */
function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env: ${name}`);
  return val;
}

export const env = {
  SUPABASE_URL: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  SUPABASE_ANON_KEY: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_KEY: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
};
