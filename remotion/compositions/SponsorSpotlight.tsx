import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";

import GradientBg from "../components/GradientBg";
import AnimatedText from "../components/AnimatedText";
import StatTile from "../components/StatTile";

export const sponsorSpotlightSchema = z.object({
  sponsorName: z.string(),
  category: z.string(),
  eventCount: z.number(),
  states: z.array(z.string()),
  topEvents: z.array(z.string()),
});

export type SponsorSpotlightProps = z.infer<typeof sponsorSpotlightSchema>;

export const sponsorSpotlightDefaults: SponsorSpotlightProps = {
  sponsorName: "PSA",
  category: "Grading",
  eventCount: 48,
  states: ["CA", "TX", "FL", "NY", "IL"],
  topEvents: ["National Sports Collectors Convention", "Dallas Card Show", "Chantilly Show"],
};

const LogoPlaceholder: React.FC<{ name: string }> = ({ name }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 20], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotate = interpolate(frame, [0, 20], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 36,
        background: "linear-gradient(135deg, #fff, #d9ccff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 96,
        fontWeight: 900,
        color: "#5f2eea",
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}
    >
      {name.charAt(0)}
    </div>
  );
};

export const SponsorSpotlight: React.FC<SponsorSpotlightProps> = ({
  sponsorName,
  category,
  eventCount,
  states,
  topEvents,
}) => {
  return (
    <GradientBg variant="sponsor">
      <AbsoluteFill style={{ padding: 90, justifyContent: "center" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <LogoPlaceholder name={sponsorName} />
          <div>
            <AnimatedText animation="slide-left" delay={6}>
              <h1 style={{ color: "#fff", fontSize: 92, fontWeight: 900, margin: 0 }}>
                {sponsorName}
              </h1>
            </AnimatedText>
            <AnimatedText animation="fade" delay={16}>
              <div
                style={{
                  marginTop: 10,
                  display: "inline-block",
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: 30,
                  fontWeight: 800,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  padding: "8px 22px",
                  borderRadius: 100,
                }}
              >
                {category}
              </div>
            </AnimatedText>
          </div>
        </div>

        {/* Stats flying in */}
        <Sequence from={30}>
          <div style={{ display: "flex", gap: 32, marginTop: 70 }}>
            <StatTile value={eventCount} label="Events sponsored" delay={0} />
            <StatTile value={states.length} label="States" delay={10} />
          </div>
        </Sequence>

        {/* Top events staggered reveal */}
        <Sequence from={70}>
          <div style={{ marginTop: 60 }}>
            {topEvents.slice(0, 3).map((event, i) => (
              <AnimatedText key={event} animation="slide-up" delay={i * 12} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    color: "#fff",
                    fontSize: 38,
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 14,
                      background: "#b39ef9",
                    }}
                  />
                  {event}
                </div>
              </AnimatedText>
            ))}
          </div>
        </Sequence>
      </AbsoluteFill>
    </GradientBg>
  );
};

export default SponsorSpotlight;
