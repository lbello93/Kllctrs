/**
 * Shared Remotion metadata — imported by Root.tsx (registration), the API route
 * (server render) and the Player preview (admin UI) so IDs, sizes and durations
 * stay in sync. Keep this file free of `.tsx`/React imports so it is safe to
 * import from server code.
 */

export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;

export type VideoType = "news" | "sponsor" | "event" | "recap";

export interface VideoMeta {
  /** Remotion composition id (matches <Composition id>). */
  id: string;
  type: VideoType;
  label: string;
  durationInFrames: number;
}

export const VIDEO_META: Record<VideoType, VideoMeta> = {
  news: { id: "NewsBreaking", type: "news", label: "Breaking News", durationInFrames: 20 * VIDEO_FPS },
  sponsor: { id: "SponsorSpotlight", type: "sponsor", label: "Sponsor Spotlight", durationInFrames: 20 * VIDEO_FPS },
  event: { id: "EventPreview", type: "event", label: "Event Preview", durationInFrames: 15 * VIDEO_FPS },
  recap: { id: "WeeklyRecap", type: "recap", label: "Weekly Recap", durationInFrames: 30 * VIDEO_FPS },
};

export const VIDEO_TYPES = Object.values(VIDEO_META);

/** Maps a video type to its Remotion composition id. */
export function compositionIdForType(type: VideoType): string {
  return VIDEO_META[type].id;
}
