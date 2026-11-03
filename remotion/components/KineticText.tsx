import React, { useMemo } from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { framesPerBeat, isOnBeat } from "../utils/beat-sync";

export type KineticStyle = "scramble" | "slam" | "wipe" | "glitch";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%&*";

export interface KineticTextProps {
  text: string;
  style?: KineticStyle;
  /** Frame (within the current Sequence) at which the animation begins. */
  startFrame?: number;
  /** Beats per minute of the backing track, for beat-driven effects (glitch). */
  bpm?: number;
  /** Extra styling for the text element. */
  textStyle?: React.CSSProperties;
  className?: string;
  as?: "h1" | "h2" | "div" | "span" | "p";
}

/**
 * Kinetic typography primitive used across the compositions. Four reveal
 * styles, inspired by createmotion.io's motion type:
 *  - scramble: each character cycles through random glyphs, settling L→R
 *  - slam:     word-by-word spring with overshoot
 *  - wipe:     a clip-path wipe reveals the line
 *  - glitch:   RGB-split + jitter that kicks on every beat
 */
export const KineticText: React.FC<KineticTextProps> = ({
  text,
  style = "slam",
  startFrame = 0,
  bpm = 110,
  textStyle,
  className,
  as = "div",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const Tag = as as React.ElementType;
  const baseStyle: React.CSSProperties = { margin: 0, ...textStyle };

  if (style === "scramble") {
    return (
      <Tag className={className} style={baseStyle}>
        <ScrambleReveal text={text} local={local} />
      </Tag>
    );
  }

  if (style === "wipe") {
    // A diagonal clip-path wipe that uncovers the text over ~16 frames.
    const p = interpolate(local, [0, 16], [0, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const opacity = interpolate(local, [0, 3], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <Tag
        className={className}
        style={{
          ...baseStyle,
          opacity,
          clipPath: `inset(0 ${100 - p}% 0 0)`,
          WebkitClipPath: `inset(0 ${100 - p}% 0 0)`,
        }}
      >
        {text}
      </Tag>
    );
  }

  if (style === "glitch") {
    const appear = interpolate(local, [0, 6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const beat = isOnBeat(frame, fps, bpm, Math.max(1, framesPerBeat(fps, bpm) * 0.12));
    // Jitter + RGB channel split that spikes on the beat.
    const amp = beat ? 6 : 1.5;
    const jx = (random(`gx-${frame}`) - 0.5) * amp * 2;
    const jy = (random(`gy-${frame}`) - 0.5) * amp;
    return (
      <Tag
        className={className}
        style={{
          ...baseStyle,
          opacity: appear,
          position: "relative",
          transform: `translate(${jx}px, ${jy}px)`,
          textShadow: beat
            ? `${amp}px 0 rgba(255,0,80,0.8), -${amp}px 0 rgba(0,200,255,0.8)`
            : "0 2px 20px rgba(0,0,0,0.4)",
        }}
      >
        {text}
      </Tag>
    );
  }

  // "slam": word-by-word spring with overshoot.
  return (
    <Tag className={className} style={{ ...baseStyle, display: "inline-block" }}>
      <SlamWords text={text} local={local} fps={fps} />
    </Tag>
  );
};

const ScrambleReveal: React.FC<{ text: string; local: number }> = ({ text, local }) => {
  // Each character locks in after a staggered delay; before that it shows a
  // frame-dependent random glyph.
  const perChar = 1.6; // frames between characters locking
  return (
    <>
      {text.split("").map((ch, i) => {
        if (ch === " ") return <span key={i}>&nbsp;</span>;
        const lockAt = i * perChar;
        const locked = local >= lockAt + 6;
        if (locked || local < 0) {
          return (
            <span key={i} style={{ opacity: local < 0 ? 0 : 1 }}>
              {ch}
            </span>
          );
        }
        const started = local >= lockAt;
        const glyph = started
          ? SCRAMBLE_CHARS[Math.floor(random(`sc-${i}-${local}`) * SCRAMBLE_CHARS.length)]
          : "";
        return (
          <span key={i} style={{ opacity: started ? 0.85 : 0, color: "inherit" }}>
            {glyph || ch}
          </span>
        );
      })}
    </>
  );
};

const SlamWords: React.FC<{ text: string; local: number; fps: number }> = ({ text, local, fps }) => {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <>
      {words.map((word, i) => {
        const delay = i * 4;
        const p = spring({
          frame: local - delay,
          fps,
          // Low damping => overshoot ("slam" then settle).
          config: { damping: 11, stiffness: 180, mass: 0.7 },
          durationInFrames: 22,
        });
        const scale = interpolate(p, [0, 1], [1.6, 1]);
        const opacity = interpolate(local - delay, [0, 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `scale(${scale})`,
              transformOrigin: "center bottom",
              marginRight: "0.28em",
            }}
          >
            {word}
          </span>
        );
      })}
    </>
  );
};

export default KineticText;
