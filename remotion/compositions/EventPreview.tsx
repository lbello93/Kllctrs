import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

import GradientBg from "../components/GradientBg";
import AnimatedText from "../components/AnimatedText";

export const eventPreviewSchema = z.object({
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
    <div style={{ position: "absolute", bottom: 120, left: 0, right: 0, overflow: "hidden" }}>
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
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const days = daysUntil(date);

  // "Don't miss it" CTA pulses in over the final second.
  const ctaStart = durationInFrames - 60;
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
      <AbsoluteFill style={{ padding: 90, justifyContent: "center" }}>
        <AnimatedText animation="slide-left" delay={4}>
          <h1 style={{ color: "#fff", fontSize: 94, fontWeight: 900, margin: 0, maxWidth: 1500 }}>
            {eventName}
          </h1>
        </AnimatedText>

        <AnimatedText animation="fade" delay={16} style={{ marginTop: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {/* Map placeholder */}
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 24,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
              }}
            >
              📍
            </div>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 48, fontWeight: 700 }}>
              {city}, {state}
            </span>
          </div>
        </AnimatedText>

        {/* Countdown */}
        <Sequence from={30}>
          <AnimatedText animation="pop" delay={0} style={{ marginTop: 50 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <span style={{ color: "#fff", fontSize: 140, fontWeight: 900, lineHeight: 1 }}>
                {days}
              </span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 46, fontWeight: 700 }}>
                days away
              </span>
            </div>
          </AnimatedText>
        </Sequence>
      </AbsoluteFill>

      {sponsors.length > 0 && <SponsorStrip sponsors={sponsors} />}

      {/* CTA ending */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 60,
          opacity: ctaOpacity,
        }}
      >
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
      </AbsoluteFill>
    </GradientBg>
  );
};

export default EventPreview;
