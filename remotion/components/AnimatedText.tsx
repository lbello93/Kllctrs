import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Animation = "slide-left" | "slide-up" | "fade" | "pop";

export const AnimatedText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  animation?: Animation;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, animation = "fade", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const progress = spring({
    frame: local,
    fps,
    config: { damping: 200, stiffness: 120, mass: 0.6 },
    durationInFrames: 24,
  });

  const opacity = interpolate(local, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let transform = "none";
  if (animation === "slide-left") {
    transform = `translateX(${interpolate(progress, [0, 1], [-120, 0])}px)`;
  } else if (animation === "slide-up") {
    transform = `translateY(${interpolate(progress, [0, 1], [60, 0])}px)`;
  } else if (animation === "pop") {
    transform = `scale(${interpolate(progress, [0, 1], [0.6, 1])})`;
  }

  return (
    <div style={{ opacity, transform, ...style }}>{children}</div>
  );
};

export default AnimatedText;
