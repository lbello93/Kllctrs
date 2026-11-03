import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const StatTile: React.FC<{
  value: number | string;
  label: string;
  delay?: number;
  accent?: string;
}> = ({ value, label, delay = 0, accent = "#5f2eea" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 180, stiffness: 140, mass: 0.7 },
    durationInFrames: 20,
  });

  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(enter, [0, 1], [50, 0]);
  const scale = interpolate(enter, [0, 1], [0.8, 1]);

  // Count-up for numeric values.
  const display =
    typeof value === "number"
      ? Math.round(
          interpolate(local, [0, 30], [0, value], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        )
      : value;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 24,
        padding: "32px 40px",
        minWidth: 240,
        textAlign: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          fontSize: 88,
          fontWeight: 900,
          lineHeight: 1,
          color: "#fff",
          textShadow: `0 4px 30px ${accent}88`,
        }}
      >
        {display}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default StatTile;
