/**
 * Royalty-free background music registry for the Remotion video engine.
 *
 * Files live in `public/sounds/` and are referenced from compositions with
 * Remotion's `staticFile('sounds/<file>')`. Placeholder (silent) files ship in
 * the repo so previews/renders work out of the box; run `npm run setup:audio`
 * to replace them with real royalty-free tracks (see `public/sounds/README.md`).
 *
 * `bpm` drives the beat-sync utilities in `remotion/utils/beat-sync.ts`, so the
 * pulses/flashes line up with whatever track you drop in — keep each `bpm`
 * accurate for its file.
 *
 * This file is plain data (no React / no `server-only`) so it can be imported
 * from both the Next app and the Remotion bundle.
 */

export const AUDIO_TRACKS = {
  breaking: { file: "breaking-news.mp3", bpm: 120, mood: "urgent" },
  corporate: { file: "corporate-upbeat.mp3", bpm: 110, mood: "professional" },
  dramatic: { file: "dramatic-reveal.mp3", bpm: 90, mood: "cinematic" },
  upbeat: { file: "upbeat-energy.mp3", bpm: 128, mood: "energetic" },
  ambient: { file: "ambient-tech.mp3", bpm: 80, mood: "calm" },
} as const;

export type TrackKey = keyof typeof AUDIO_TRACKS;

/** All track keys, for building selectors. */
export const AUDIO_TRACK_KEYS = Object.keys(AUDIO_TRACKS) as TrackKey[];

/** Public path (under Next's / and Remotion's staticFile root) for a track. */
export function audioTrackPath(track: TrackKey): string {
  return `sounds/${AUDIO_TRACKS[track].file}`;
}

/** BPM for a track, falling back to a sensible mid-tempo if unknown. */
export function bpmForTrack(track: TrackKey | undefined, fallback = 110): number {
  return track && AUDIO_TRACKS[track] ? AUDIO_TRACKS[track].bpm : fallback;
}
