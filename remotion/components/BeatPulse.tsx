import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

import { beatOpacity, beatScale } from "../utils/beat-sync";

export interface BeatPulseProps {
  bpm: number;
  /** Extra scale at the peak of each beat (0.1 → pulses to ~1.1). */
  intensity?: number;
  /** Add a glow that brightens on the beat. */
  glow?: boolean;
  glowColor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Wraps children and scales (and optionally glows) them in time with the beat,
 * using the beat-sync utilities. Drop around a badge, logo or stat to make it
 * breathe with the music.
 */
export const BeatPulse: React.FC<BeatPulseProps> = ({
  bpm,
  intensity = 0.1,
  glow = false,
  glowColor = "#ffffff",
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = beatScale(frame, fps, bpm, intensity);
  const glowStrength = glow ? beatOpacity(frame, fps, bpm, 0.15) : 0;

  return (
    <div
      style={{
        display: "inline-block",
        transform: `scale(${scale})`,
        filter: glow ? `drop-shadow(0 0 ${12 + glowStrength * 40}px ${glowColor})` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default BeatPulse;
