import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, staticFile, useVideoConfig } from "remotion";

import { AUDIO_TRACKS, audioTrackPath, type TrackKey } from "../../src/lib/video/audio-config";

export interface AudioLayerProps {
  track: TrackKey;
  /** Base volume 0–1 before fades/ducking (default 0.7). */
  volume?: number;
  /**
   * Frames at which a visual transition happens. Audio swells to full volume
   * around these and ducks slightly elsewhere (quieter under text), so the
   * music supports the motion instead of fighting the copy.
   */
  transitionFrames?: number[];
  /** Window (in frames) around each transition frame to swell the volume. */
  duckWindow?: number;
}

/**
 * Background-music layer for a composition. Wraps `@remotion/media`'s <Audio>
 * (not remotion's), references the file via staticFile() from public/sounds/,
 * loops it to fill the composition, fades in over the first second and out over
 * the last two, and ducks under text between transitions.
 *
 * If the audio file is missing it fails soft (no throw) so previews still play.
 */
export const AudioLayer: React.FC<AudioLayerProps> = ({
  track,
  volume = 0.7,
  transitionFrames = [],
  duckWindow = 18,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const fadeIn = Math.max(1, Math.round(fps)); // 1s
  const fadeOut = Math.max(1, Math.round(fps * 2)); // 2s
  const duckedLevel = transitionFrames.length ? 0.72 : 1;

  const trackMeta = AUDIO_TRACKS[track] ?? AUDIO_TRACKS.corporate;

  const volumeFn = (frame: number): number => {
    const envelope = Math.min(
      interpolate(frame, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    );

    // Swell to full volume near a transition, duck under text between them.
    let swell = duckedLevel;
    for (const tf of transitionFrames) {
      const dist = Math.abs(frame - tf);
      if (dist < duckWindow) {
        swell = Math.max(swell, interpolate(dist, [0, duckWindow], [1, duckedLevel]));
      }
    }

    return Math.max(0, Math.min(1, volume * envelope * swell));
  };

  return (
    <Audio
      src={staticFile(audioTrackPath(track))}
      volume={volumeFn}
      loop
      name={trackMeta.file}
      fallbackHtml5AudioProps={{ onError: () => undefined }}
    />
  );
};

export default AudioLayer;
