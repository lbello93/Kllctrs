import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";

export type WipeStyle = "slide-left" | "slide-up" | "zoom-burst" | "glitch-cut";

export interface TransitionWipeProps {
  style?: WipeStyle;
  /** Current frame, measured from the start of the transition. */
  frame: number;
  /** How many frames the wipe lasts. */
  duration?: number;
  color?: string;
}

/**
 * A full-screen wipe that plays between scenes. Place it at the boundary (its
 * own short <Sequence>) and feed it a frame measured from that boundary. The
 * panel sweeps in over the first half of `duration` and out over the second,
 * covering the cut.
 */
export const TransitionWipe: React.FC<TransitionWipeProps> = ({
  style = "slide-left",
  frame,
  duration = 20,
  color = "#0a0414",
}) => {
  const half = duration / 2;
  // 0 → 1 as the panel covers the screen, 1 → 0 as it clears.
  const cover =
    frame < half
      ? interpolate(frame, [0, half], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : interpolate(frame, [half, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (style === "zoom-burst") {
    const scale = interpolate(cover, [0, 1], [0, 2.4]);
    const opacity = Math.min(1, cover * 1.6);
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
        <div
          style={{
            width: "140vw",
            height: "140vw",
            borderRadius: "50%",
            background: color,
            opacity,
            transform: `scale(${scale})`,
          }}
        />
      </AbsoluteFill>
    );
  }

  if (style === "glitch-cut") {
    // Stacked horizontal slices that jump left/right, plus RGB flashes.
    const slices = 12;
    return (
      <AbsoluteFill style={{ pointerEvents: "none", opacity: cover > 0.02 ? 1 : 0 }}>
        {Array.from({ length: slices }).map((_, i) => {
          const jitter = (random(`slice-${i}-${Math.round(frame)}`) - 0.5) * 200 * cover;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${(i / slices) * 100}%`,
                height: `${100 / slices + 0.5}%`,
                background: i % 3 === 0 ? "rgba(255,0,80,0.9)" : i % 3 === 1 ? "rgba(0,200,255,0.9)" : color,
                transform: `translateX(${jitter}px)`,
                opacity: cover,
              }}
            />
          );
        })}
      </AbsoluteFill>
    );
  }

  // Sliding solid panel (slide-left / slide-up).
  const axis = style === "slide-up" ? "Y" : "X";
  // Enter from off-screen, rest at 0 while covering, exit off the far side.
  const pos = frame < half ? interpolate(cover, [0, 1], [-100, 0]) : interpolate(cover, [1, 0], [0, 100]);

  return (
    <AbsoluteFill
      style={{
        background: color,
        transform: `translate${axis}(${pos}%)`,
        pointerEvents: "none",
      }}
    />
  );
};

/**
 * Convenience wrapper: reads the current (Sequence-local) frame itself, so you
 * can drop it inside a short <Sequence from={boundary} durationInFrames={n}>
 * placed at a scene cut without wiring frames by hand.
 */
export const SceneWipe: React.FC<Omit<TransitionWipeProps, "frame">> = (props) => {
  const frame = useCurrentFrame();
  return <TransitionWipe {...props} frame={frame} />;
};

export default TransitionWipe;
