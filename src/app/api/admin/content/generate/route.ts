import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/lib/auth/apiGuard";
import {
  CONTENT_ENGINE_TYPES,
  ContentEngineError,
  generateContent,
  type ContentEngineType,
  type GenerateContentInput,
} from "@/lib/content/generate";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const type = body.type;
  if (typeof type !== "string" || !CONTENT_ENGINE_TYPES.includes(type as ContentEngineType)) {
    return NextResponse.json(
      { error: `type must be one of: ${CONTENT_ENGINE_TYPES.join(", ")}` },
      { status: 400 },
    );
  }

  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const input: GenerateContentInput = {
    type: type as ContentEngineType,
    topic: str(body.topic),
    eventId: str(body.eventId),
    sponsorId: str(body.sponsorId),
    customPrompt: str(body.customPrompt),
  };

  try {
    const draft = await generateContent(input);
    return NextResponse.json({ draft });
  } catch (error) {
    const err =
      error instanceof ContentEngineError
        ? error
        : new ContentEngineError("Content generation failed.", 500);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
