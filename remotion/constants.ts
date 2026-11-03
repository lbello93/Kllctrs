/**
 * Shared Remotion metadata — imported by Root.tsx (registration), the API route
 * (server render) and the Player preview (admin UI) so IDs, sizes and durations
 * stay in sync. Keep this file free of `.tsx`/React imports so it is safe to
 * import from server code.
 */

import type { TrackKey } from "../src/lib/video/audio-config";

export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;

export type VideoType = "news" | "sponsor" | "event" | "recap";

/** Animation intensity presets, surfaced in the Video Studio UI. */
export type AnimationStyle = "kinetic" | "minimal" | "dramatic";
export const ANIMATION_STYLES: { value: AnimationStyle; label: string; hint: string }[] = [
  { value: "kinetic", label: "Kinetic", hint: "Punchy scramble / slam / glitch motion" },
  { value: "minimal", label: "Minimal", hint: "Clean fades, less movement" },
  { value: "dramatic", label: "Dramatic", hint: "Big zooms and overshoot" },
];

export interface VideoMeta {
  /** Remotion composition id (matches <Composition id>). */
  id: string;
  type: VideoType;
  label: string;
  durationInFrames: number;
  /** Emoji shown on the picker card. */
  emoji: string;
  /** One-line description of what the type generates. */
  description: string;
  /** Default music track for this type (overridable in the UI). */
  defaultTrack: TrackKey;
}

export const VIDEO_META: Record<VideoType, VideoMeta> = {
  news: {
    id: "NewsBreaking",
    type: "news",
    label: "Breaking News",
    durationInFrames: 20 * VIDEO_FPS,
    emoji: "🚨",
    description: "Red-alert breaking banner with scramble headline and ticker.",
    defaultTrack: "breaking",
  },
  sponsor: {
    id: "SponsorSpotlight",
    type: "sponsor",
    label: "Sponsor Spotlight",
    durationInFrames: 20 * VIDEO_FPS,
    emoji: "🤝",
    description: "Brand slam, flying stat counters and top-event reveal.",
    defaultTrack: "corporate",
  },
  event: {
    id: "EventPreview",
    type: "event",
    label: "Event Preview",
    durationInFrames: 15 * VIDEO_FPS,
    emoji: "📅",
    description: "Event zoom-in, countdown and sponsor strip with a CTA.",
    defaultTrack: "upbeat",
  },
  recap: {
    id: "WeeklyRecap",
    type: "recap",
    label: "Weekly Recap",
    durationInFrames: 30 * VIDEO_FPS,
    emoji: "📊",
    description: "This-week-in-cards glitch title, stat tiles and show list.",
    defaultTrack: "ambient",
  },
};

export const VIDEO_TYPES = Object.values(VIDEO_META);

/** Maps a video type to its Remotion composition id. */
export function compositionIdForType(type: VideoType): string {
  return VIDEO_META[type].id;
}
