import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";

import GradientBg from "../components/GradientBg";
import KineticText from "../components/KineticText";
import BeatPulse from "../components/BeatPulse";
import StatTile from "../components/StatTile";
import AudioLayer from "../components/AudioLayer";
import { SceneWipe } from "../components/TransitionWipe";
import { framesPerBeat } from "../utils/beat-sync";
import { commonVideoSchema, resolveTrack, trackBpm } from "./shared";
import { VIDEO_FPS } from "../constants";

export const weeklyRecapSchema = commonVideoSchema.extend({
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

const S2 = 180; // stats scene
const S3 = 440; // event list scene
const S4 = 760; // outro scene

export const WeeklyRecap: React.FC<WeeklyRecapProps> = ({
  weekStats,
  events,
  audioTrack,
  animationStyle = "kinetic",
}) => {
  const track = resolveTrack(audioTrack, "ambient");
  const bpm = trackBpm(track);
  const titleStyle = animationStyle === "minimal" ? "wipe" : "glitch";
  // Stagger stat tiles by one beat each so they land on the music.
  const beat = Math.round(framesPerBeat(VIDEO_FPS, bpm));

  return (
    <GradientBg variant="recap">
      <AudioLayer track={track} volume={0.6} transitionFrames={[S2, S3, S4]} />

      {/* Scene 1 — glitch title */}
      <Sequence durationInFrames={S2 + 20}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
          <KineticText
            text="THIS WEEK IN"
            style="wipe"
            bpm={bpm}
            startFrame={6}
            as="div"
            textStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 44, fontWeight: 700, letterSpacing: 8, textAlign: "center" }}
          />
          <KineticText
            text="CARDS"
            style={titleStyle}
            bpm={bpm}
            startFrame={16}
            as="h1"
            textStyle={{ color: "#fff", fontSize: 170, fontWeight: 900, textAlign: "center" }}
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={S2 - 14} durationInFrames={28} layout="none">
        <SceneWipe style="glitch-cut" duration={28} color="#1a0a3d" />
      </Sequence>

      {/* Scene 2 — stat tiles on successive beats */}
      <Sequence from={S2} durationInFrames={S3 - S2 + 20}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
            <BeatPulse bpm={bpm} intensity={0.06}>
              <StatTile value={weekStats.newEvents} label="New events" delay={beat * 0} />
            </BeatPulse>
            <BeatPulse bpm={bpm} intensity={0.06}>
              <StatTile value={weekStats.topSponsor} label="Top sponsor" delay={beat * 1} accent="#b39ef9" />
            </BeatPulse>
            <BeatPulse bpm={bpm} intensity={0.06}>
              <StatTile value={weekStats.trendingState} label="Trending state" delay={beat * 2} accent="#7c3aed" />
            </BeatPulse>
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={S3 - 14} durationInFrames={28} layout="none">
        <SceneWipe style="slide-up" duration={28} color="#1a0a3d" />
      </Sequence>

      {/* Scene 3 — event list staggered wipes */}
      <Sequence from={S3} durationInFrames={S4 - S3 + 20}>
        <AbsoluteFill style={{ justifyContent: "center", padding: 120 }}>
          <KineticText
            text="UPCOMING SHOWS"
            style="wipe"
            bpm={bpm}
            as="h2"
            textStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 44, fontWeight: 800, letterSpacing: 2, marginBottom: 30 }}
          />
          {events.slice(0, 5).map((event, i) => (
            <KineticText
              key={`${event.name}-${i}`}
              text={`${event.name}   —   ${event.date}`}
              style="wipe"
              bpm={bpm}
              startFrame={12 + i * 14}
              as="div"
              textStyle={{
                color: "#fff",
                fontSize: 46,
                fontWeight: 700,
                borderBottom: "2px solid rgba(255,255,255,0.12)",
                paddingBottom: 16,
                marginBottom: 20,
              }}
            />
          ))}
        </AbsoluteFill>
      </Sequence>

      <Sequence from={S4 - 14} durationInFrames={28} layout="none">
        <SceneWipe style="slide-left" duration={28} color="#1a0a3d" />
      </Sequence>

      {/* Scene 4 — outro / branding */}
      <Sequence from={S4}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <BeatPulse bpm={bpm} intensity={0.1} glow glowColor="#7c3aed">
            <KineticText
              text="KLLCTRS"
              style={animationStyle === "minimal" ? "wipe" : "slam"}
              bpm={bpm}
              as="div"
              textStyle={{ color: "#fff", fontSize: 130, fontWeight: 900, letterSpacing: 6 }}
            />
          </BeatPulse>
          <KineticText
            text="Follow the hobby, every week."
            style="wipe"
            bpm={bpm}
            startFrame={18}
            as="div"
            textStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 40, fontWeight: 600, marginTop: 20 }}
          />
        </AbsoluteFill>
      </Sequence>
    </GradientBg>
  );
};

export default WeeklyRecap;
