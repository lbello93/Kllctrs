import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

import GradientBg from "../components/GradientBg";
import KineticText from "../components/KineticText";
import BeatPulse from "../components/BeatPulse";
import AudioLayer from "../components/AudioLayer";
import { SceneWipe } from "../components/TransitionWipe";
import { commonVideoSchema, resolveTrack, trackBpm } from "./shared";

export const eventPreviewSchema = commonVideoSchema.extend({
  eventName: z.string(),
  date: z.string(),
  city: z.string(),
  state: z.string(),
  sponsors: z.array(z.string()),
});

export type EventPreviewProps = z.infer<typeof eventPreviewSchema>;

export const eventPreviewDefaults: EventPreviewProps = {
  eventName: "Dallas Card Show",
  date: "2026-12-12",
  city: "Dallas",
  state: "TX",
  sponsors: ["PSA", "Topps", "Panini", "Fanatics"],
};

const S2 = 130; // date/location scene
const S3 = 300; // sponsor strip + CTA scene

function daysUntil(date: string): number {
  const d = new Date(date).getTime();
  if (Number.isNaN(d)) return 0;
  return Math.max(0, Math.ceil((d - Date.now()) / 86_400_000));
}

const SponsorStrip: React.FC<{ sponsors: string[] }> = ({ sponsors }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const items = sponsors.length ? [...sponsors, ...sponsors, ...sponsors] : [];
  const x = width - ((frame * 4) % (width * 2));
  return (
    <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 24, whiteSpace: "nowrap", transform: `translateX(${x}px)` }}>
        {items.map((s, i) => (
          <div
            key={`${s}-${i}`}
            style={{
              flexShrink: 0,
              padding: "16px 34px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};

export const EventPreview: React.FC<EventPreviewProps> = ({
  eventName,
  date,
  city,
  state,
  sponsors,
  audioTrack,
  animationStyle = "kinetic",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const track = resolveTrack(audioTrack, "upbeat");
  const bpm = trackBpm(track);
  const days = daysUntil(date);

  // Dramatic zoom-in for the opener title.
  const zoom = spring({ frame, fps, config: { damping: 18, stiffness: 90, mass: 1 }, durationInFrames: 40 });
  const titleScale = animationStyle === "minimal" ? 1 : interpolate(zoom, [0, 1], [2.2, 1]);
  const titleOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // CTA pulses in over the final second.
  const ctaStart = durationInFrames - 50;
  const ctaScale = interpolate(frame, [ctaStart, ctaStart + 20], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(frame, [ctaStart, ctaStart + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <GradientBg variant="event">
      <AudioLayer track={track} volume={0.65} transitionFrames={[S2, S3]} />

      {/* Scene 1 — event name dramatic zoom-in */}
      <Sequence durationInFrames={S2 + 20}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
          <div style={{ transform: `scale(${titleScale})`, opacity: titleOpacity }}>
            <h1
              style={{
                color: "#fff",
                fontSize: 100,
                fontWeight: 900,
                margin: 0,
                maxWidth: 1500,
                textAlign: "center",
                textShadow: "0 8px 50px rgba(0,0,0,0.5)",
              }}
            >
              {eventName}
            </h1>
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={S2 - 14} durationInFrames={28} layout="none">
        <SceneWipe style="zoom-burst" duration={28} color="#0a1a3d" />
      </Sequence>

      {/* Scene 2 — date / location + countdown */}
      <Sequence from={S2} durationInFrames={S3 - S2 + 20}>
        <AbsoluteFill style={{ padding: 90, justifyContent: "center" }}>
          <KineticText
            text={`${city}, ${state}`}
            style="wipe"
            bpm={bpm}
            startFrame={4}
            as="div"
            textStyle={{ color: "rgba(255,255,255,0.9)", fontSize: 56, fontWeight: 800 }}
          />
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 40 }}>
            <BeatPulse bpm={bpm} intensity={0.14} glow glowColor="#2e6cea">
              <span style={{ color: "#fff", fontSize: 180, fontWeight: 900, lineHeight: 1 }}>{days}</span>
            </BeatPulse>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 50, fontWeight: 700 }}>days away</span>
          </div>
          <KineticText
            text={new Date(date).toDateString()}
            style="wipe"
            bpm={bpm}
            startFrame={20}
            as="div"
            textStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 40, fontWeight: 600, marginTop: 24 }}
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={S3 - 14} durationInFrames={28} layout="none">
        <SceneWipe style="slide-left" duration={28} color="#0a1a3d" />
      </Sequence>

      {/* Scene 3 — sponsor strip + CTA */}
      <Sequence from={S3}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <KineticText
            text="Presented with"
            style="wipe"
            bpm={bpm}
            as="div"
            textStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 38, fontWeight: 700, letterSpacing: 2 }}
          />
        </AbsoluteFill>
        {sponsors.length > 0 && <SponsorStrip sponsors={sponsors} />}
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 60, opacity: ctaOpacity }}>
          <BeatPulse bpm={bpm} intensity={0.08}>
            <div
              style={{
                transform: `scale(${ctaScale})`,
                background: "#fff",
                color: "#10224a",
                fontSize: 44,
                fontWeight: 900,
                letterSpacing: 1,
                padding: "20px 48px",
                borderRadius: 100,
              }}
            >
              Don&apos;t miss it →
            </div>
          </BeatPulse>
        </AbsoluteFill>
      </Sequence>
    </GradientBg>
  );
};

export default EventPreview;
