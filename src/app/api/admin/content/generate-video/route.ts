import { NextResponse } from "next/server";
import slugify from "slugify";

import { getAdminApiContext } from "@/lib/auth/apiGuard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { renderAndStoreVideo, VideoRenderError } from "@/lib/video/render";
import { VIDEO_META, type VideoType, type AnimationStyle } from "../../../../../../remotion/constants";
import { AUDIO_TRACK_KEYS, type TrackKey } from "@/lib/video/audio-config";
import type { TablesInsert } from "@/types/database";

export const runtime = "nodejs";
export const maxDuration = 300;

const VALID_TYPES: VideoType[] = ["news", "sponsor", "event", "recap"];
const VALID_STYLES: AnimationStyle[] = ["kinetic", "minimal", "dramatic"];

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
  if (typeof type !== "string" || !VALID_TYPES.includes(type as VideoType)) {
    return NextResponse.json(
      { error: `type must be one of: ${VALID_TYPES.join(", ")}` },
      { status: 400 },
    );
  }
  const data = body.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json({ error: "data must be an object of composition props." }, { status: 400 });
  }

  const videoType = type as VideoType;
  const meta = VIDEO_META[videoType];
  const title =
    typeof body.title === "string" && body.title.trim()
      ? body.title.trim()
      : `${meta.label} video`;

  // Optional presentation controls merged into the composition props.
  const audioTrack =
    typeof body.audioTrack === "string" && (AUDIO_TRACK_KEYS as string[]).includes(body.audioTrack)
      ? (body.audioTrack as TrackKey)
      : undefined;
  const animationStyle =
    typeof body.animationStyle === "string" && (VALID_STYLES as string[]).includes(body.animationStyle)
      ? (body.animationStyle as AnimationStyle)
      : undefined;

  const renderData: Record<string, unknown> = {
    ...(data as Record<string, unknown>),
    ...(audioTrack ? { audioTrack } : {}),
    ...(animationStyle ? { animationStyle } : {}),
  };

  try {
    const result = await renderAndStoreVideo({
      type: videoType,
      data: renderData,
    });

    // Persist as a 'video' content row (draft) so it shows in the gallery / can be published.
    const row: TablesInsert<"content"> = {
      type: "video",
      status: "draft",
      title,
      slug: `${slugify(title, { lower: true, strict: true }).slice(0, 60) || "video"}-${crypto.randomUUID().slice(0, 6)}`,
      body: "",
      is_ai_generated: true,
      video_url: result.videoUrl,
      video_type: videoType,
      video_duration: result.durationSeconds,
      category: "community",
      author: "KLLCTRS AI",
      related_event_id: typeof body.relatedEventId === "string" ? body.relatedEventId : null,
      related_sponsor_id: typeof body.relatedSponsorId === "string" ? body.relatedSponsorId : null,
    };

    const { data: saved, error } = await supabaseAdmin
      .from("content")
      .insert(row)
      .select("id,title,slug,video_url,video_type,video_duration,status")
      .single();

    if (error) {
      // The video rendered and uploaded; only the DB record failed.
      console.error("[generate-video] save failed:", error.message);
      return NextResponse.json(
        { videoUrl: result.videoUrl, warning: `Rendered but not saved: ${error.message}` },
        { status: 200 },
      );
    }

    return NextResponse.json({ videoUrl: result.videoUrl, content: saved });
  } catch (error) {
    const err =
      error instanceof VideoRenderError
        ? error
        : new VideoRenderError("Video generation failed.", 500);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
