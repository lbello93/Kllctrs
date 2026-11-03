import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/lib/auth/apiGuard";
import {
  generateStudioContent,
  StudioError,
} from "@/AI integration/admin/content-studio/generate";
import { generateRequestSchema } from "@/AI integration/admin/content-studio/types";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const result = await generateStudioContent(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const studioError =
      error instanceof StudioError
        ? error
        : new StudioError("Content generation failed.", 500);
    return NextResponse.json(
      { error: studioError.message },
      { status: studioError.status },
    );
  }
}