import { z } from "zod";

import { AUDIO_TRACK_KEYS, bpmForTrack, type TrackKey } from "../../src/lib/video/audio-config";

/**
 * Props every composition accepts on top of its own content props: an optional
 * music-track override and an animation-intensity preset. Both are chosen in
 * the Video Studio UI and passed straight through as inputProps.
 */
export const commonVideoSchema = z.object({
  audioTrack: z.enum(AUDIO_TRACK_KEYS as [TrackKey, ...TrackKey[]]).optional(),
  animationStyle: z.enum(["kinetic", "minimal", "dramatic"]).optional(),
});

export type CommonVideoProps = z.infer<typeof commonVideoSchema>;

/** Resolve the track to use, honoring the UI override then the type default. */
export function resolveTrack(audioTrack: TrackKey | undefined, fallback: TrackKey): TrackKey {
  return audioTrack ?? fallback;
}

/** BPM for the resolved track. */
export function trackBpm(track: TrackKey): number {
  return bpmForTrack(track);
}
