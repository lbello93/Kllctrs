import "server-only";

import path from "node:path";
import os from "node:os";
import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";

import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  VIDEO_META,
  compositionIdForType,
  type VideoType,
} from "../../../remotion/constants";

export class VideoRenderError extends Error {
  constructor(
    message: string,
    public status = 500,
  ) {
    super(message);
    this.name = "VideoRenderError";
  }
}

export interface RenderVideoInput {
  type: VideoType;
  data: Record<string, unknown>;
}

export interface RenderVideoResult {
  videoUrl: string;
  durationSeconds: number;
  storagePath: string;
}

// The Remotion entry that registers all compositions.
const ENTRY_POINT = path.join(process.cwd(), "remotion", "index.ts");
const STORAGE_BUCKET = "videos";

/**
 * Renders a Remotion composition to MP4 server-side and uploads it to the
 * public `videos` Storage bucket.
 *
 * NOTE: @remotion/renderer needs a real Node runtime, the esbuild binary, and a
 * headless Chrome (downloaded on first run). It does not run in edge/serverless
 * sandboxes. The heavy packages are imported dynamically so they never land in
 * the client/edge bundle, and failures surface as a clear 503.
 */
export async function renderAndStoreVideo(
  input: RenderVideoInput,
): Promise<RenderVideoResult> {
  const meta = VIDEO_META[input.type];
  if (!meta) throw new VideoRenderError("Unknown video type.", 400);

  let bundle: typeof import("@remotion/bundler").bundle;
  let selectComposition: typeof import("@remotion/renderer").selectComposition;
  let renderMedia: typeof import("@remotion/renderer").renderMedia;
  try {
    ({ bundle } = await import("@remotion/bundler"));
    ({ selectComposition, renderMedia } = await import("@remotion/renderer"));
  } catch (error) {
    console.error("[video] Remotion renderer unavailable:", error);
    throw new VideoRenderError(
      "The video renderer is not available in this environment (needs a Node host with Chrome).",
      503,
    );
  }

  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "kllctrs-video-"));
  const outPath = path.join(outDir, `${meta.id}-${randomUUID()}.mp4`);

  try {
    const serveUrl = await bundle({ entryPoint: ENTRY_POINT });

    const composition = await selectComposition({
      serveUrl,
      id: compositionIdForType(input.type),
      inputProps: input.data,
    });

    await renderMedia({
      serveUrl,
      composition,
      codec: "h264",
      outputLocation: outPath,
      inputProps: input.data,
    });

    const file = await fs.readFile(outPath);
    const storagePath = `${input.type}/${randomUUID()}.mp4`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, { contentType: "video/mp4", upsert: false });

    if (uploadError) {
      throw new VideoRenderError(`Upload failed: ${uploadError.message}`, 500);
    }

    const { data: pub } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

    return {
      videoUrl: pub.publicUrl,
      durationSeconds: Math.round(meta.durationInFrames / VIDEO_FPS),
      storagePath,
    };
  } catch (error) {
    if (error instanceof VideoRenderError) throw error;
    console.error("[video] render failed:", error);
    throw new VideoRenderError(
      error instanceof Error ? error.message : "Video rendering failed.",
      500,
    );
  } finally {
    await fs.rm(outDir, { recursive: true, force: true }).catch(() => {});
  }
}

export const VIDEO_DIMENSIONS = { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, fps: VIDEO_FPS };
