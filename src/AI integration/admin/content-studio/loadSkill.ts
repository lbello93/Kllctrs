import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

const SKILL_PATH = path.join(
  process.cwd(),
  "src",
  "AI integration",
  "admin",
  "content-studio",
  "skill",
  "SKILL.md",
);

let cached: string | null = null;

/**
 * Reads SKILL.md and strips its front matter.
 * In development it re-reads every time, so edits apply right away.
 */
export async function loadContentSkill(): Promise<string> {
  if (cached && process.env.NODE_ENV === "production") return cached;

  const raw = await readFile(SKILL_PATH, "utf8");
  cached = raw.replace(/^---[\s\S]*?---\s*/, "").trim();
  return cached;
}