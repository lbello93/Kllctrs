import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";

import GradientBg from "../components/GradientBg";
import KineticText from "../components/KineticText";
import BeatPulse from "../components/BeatPulse";
import StatTile from "../components/StatTile";
import AudioLayer from "../components/AudioLayer";
import { SceneWipe } from "../components/TransitionWipe";
import { commonVideoSchema, resolveTrack, trackBpm } from "./shared";

export const sponsorSpotlightSchema = commonVideoSchema.extend({
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

const S2 = 170; // stats scene
const S3 = 400; // top events scene

const LogoPlaceholder: React.FC<{ name: string; bpm: number }> = ({ name, bpm }) => {
  const frame = useCurrentFrame();
  const rotate = interpolate(frame, [0, 20], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <BeatPulse bpm={bpm} intensity={0.1} glow glowColor="#b39ef9">
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
          transform: `rotate(${rotate}deg)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {name.charAt(0)}
      </div>
    </BeatPulse>
  );
};

export const SponsorSpotlight: React.FC<SponsorSpotlightProps> = ({
  sponsorName,
  category,
  eventCount,
  states,
  topEvents,
  audioTrack,
  animationStyle = "kinetic",
}) => {
  const track = resolveTrack(audioTrack, "corporate");
  const bpm = trackBpm(track);
  const nameStyle = animationStyle === "minimal" ? "wipe" : "slam";

  return (
    <GradientBg variant="sponsor">
      <AudioLayer track={track} volume={0.65} transitionFrames={[S2, S3]} />

      {/* Scene 1 — company name slam with glow */}
      <Sequence durationInFrames={S2 + 20}>
        <AbsoluteFill style={{ padding: 90, justifyContent: "center", gap: 40 }}>
          <LogoPlaceholder name={sponsorName} bpm={bpm} />
          <KineticText
            text={sponsorName}
            style={nameStyle}
            bpm={bpm}
            as="h1"
            textStyle={{ color: "#fff", fontSize: 120, fontWeight: 900 }}
          />
          <KineticText
            text={category}
            style="wipe"
            bpm={bpm}
            startFrame={16}
            as="div"
            textStyle={{
              display: "inline-block",
              alignSelf: "flex-start",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "10px 24px",
              borderRadius: 100,
            }}
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={S2 - 14} durationInFrames={28} layout="none">
        <SceneWipe style="slide-up" duration={28} color="#1a0a3d" />
      </Sequence>

      {/* Scene 2 — stats flying in on beats */}
      <Sequence from={S2} durationInFrames={S3 - S2 + 20}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <KineticText
            text={`Sponsors ${eventCount} events across ${states.length} states`}
            style="wipe"
            bpm={bpm}
            startFrame={4}
            as="h2"
            textStyle={{ color: "rgba(255,255,255,0.8)", fontSize: 44, fontWeight: 800, marginBottom: 50 }}
          />
          <div style={{ display: "flex", gap: 32 }}>
            <BeatPulse bpm={bpm} intensity={0.07}>
              <StatTile value={eventCount} label="Events sponsored" delay={10} />
            </BeatPulse>
            <BeatPulse bpm={bpm} intensity={0.07}>
              <StatTile value={states.length} label="States" delay={24} accent="#b39ef9" />
            </BeatPulse>
          </div>
        </AbsoluteFill>
      </Sequence>

      <Sequence from={S3 - 14} durationInFrames={28} layout="none">
        <SceneWipe style="slide-left" duration={28} color="#1a0a3d" />
      </Sequence>

      {/* Scene 3 — top events staggered wipe reveal */}
      <Sequence from={S3}>
        <AbsoluteFill style={{ padding: 110, justifyContent: "center" }}>
          <KineticText
            text="Top events"
            style="wipe"
            bpm={bpm}
            as="h2"
            textStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 46, fontWeight: 800, letterSpacing: 2, marginBottom: 36 }}
          />
          {topEvents.slice(0, 4).map((event, i) => (
            <KineticText
              key={`${event}-${i}`}
              text={`•  ${event}`}
              style="wipe"
              bpm={bpm}
              startFrame={12 + i * 14}
              as="div"
              textStyle={{ color: "#fff", fontSize: 44, fontWeight: 600, marginBottom: 22 }}
            />
          ))}
        </AbsoluteFill>
      </Sequence>
    </GradientBg>
  );
};

export default SponsorSpotlight;
