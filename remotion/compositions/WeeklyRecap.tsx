import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";

import GradientBg from "../components/GradientBg";
import AnimatedText from "../components/AnimatedText";
import StatTile from "../components/StatTile";

export const weeklyRecapSchema = z.object({
  weekStats: z.object({
    newEvents: z.number(),
    topSponsor: z.string(),
    trendingState: z.string(),
  }),
  events: z.array(z.object({ name: z.string(), date: z.string() })),
});

export type WeeklyRecapProps = z.infer<typeof weeklyRecapSchema>;

export const weeklyRecapDefaults: WeeklyRecapProps = {
  weekStats: { newEvents: 23, topSponsor: "PSA", trendingState: "Texas" },
  events: [
    { name: "Dallas Card Show", date: "Dec 12" },
    { name: "Chantilly Show", date: "Dec 14" },
    { name: "Southern California Card Show", date: "Dec 15" },
    { name: "Chicago Sun-Times Show", date: "Dec 18" },
  ],
};

export const WeeklyRecap: React.FC<WeeklyRecapProps> = ({ weekStats, events }) => {
  return (
    <GradientBg variant="recap">
      {/* Title */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
          <AnimatedText animation="pop" delay={4}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 40, fontWeight: 700, letterSpacing: 6, textAlign: "center" }}>
              THIS WEEK IN
            </div>
          </AnimatedText>
          <AnimatedText animation="slide-up" delay={12}>
            <h1 style={{ color: "#fff", fontSize: 150, fontWeight: 900, margin: 0, textAlign: "center" }}>
              CARDS
            </h1>
          </AnimatedText>
        </AbsoluteFill>
      </Sequence>

      {/* Stat tiles */}
      <Sequence from={70} durationInFrames={160}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
            <StatTile value={weekStats.newEvents} label="New events" delay={0} />
            <StatTile value={weekStats.topSponsor} label="Top sponsor" delay={10} accent="#b39ef9" />
            <StatTile value={weekStats.trendingState} label="Trending state" delay={20} accent="#7c3aed" />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Event list */}
      <Sequence from={220}>
        <AbsoluteFill style={{ justifyContent: "center", padding: 120 }}>
          <AnimatedText animation="fade" delay={0} style={{ marginBottom: 30 }}>
            <h2 style={{ color: "rgba(255,255,255,0.7)", fontSize: 44, fontWeight: 800, margin: 0, letterSpacing: 2 }}>
              UPCOMING SHOWS
            </h2>
          </AnimatedText>
          {events.slice(0, 5).map((event, i) => (
            <AnimatedText key={`${event.name}-${i}`} animation="slide-left" delay={10 + i * 10} style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "2px solid rgba(255,255,255,0.12)",
                  paddingBottom: 16,
                }}
              >
                <span style={{ color: "#fff", fontSize: 44, fontWeight: 700 }}>{event.name}</span>
                <span style={{ color: "#b39ef9", fontSize: 40, fontWeight: 800 }}>{event.date}</span>
              </div>
            </AnimatedText>
          ))}
        </AbsoluteFill>
      </Sequence>
    </GradientBg>
  );
};

export default WeeklyRecap;
