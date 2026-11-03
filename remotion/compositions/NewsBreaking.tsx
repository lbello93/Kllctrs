import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

import GradientBg from "../components/GradientBg";
import KineticText from "../components/KineticText";
import BeatPulse from "../components/BeatPulse";
import TickerBar from "../components/TickerBar";
import AudioLayer from "../components/AudioLayer";
import { SceneWipe } from "../components/TransitionWipe";
import { beatOpacity } from "../utils/beat-sync";
import { commonVideoSchema, resolveTrack, trackBpm } from "./shared";

export const newsBreakingSchema = commonVideoSchema.extend({
  headline: z.string(),
  body: z.string(),
  source: z.string(),
  category: z.string(),
});

export type NewsBreakingProps = z.infer<typeof newsBreakingSchema>;

export const newsBreakingDefaults: NewsBreakingProps = {
  headline: "Record-Breaking Card Sale Shakes the Hobby",
  body: "A 1952 Topps Mickey Mantle crosses the block as collectors watch history unfold at this week's premier auction.",
  source: "KLLCTRS",
  category: "Breaking News",
};

// Scene timeline (fps 30, 600 frames total).
const S2 = 160; // headline scene
const S3 = 420; // source + ticker scene

/** Red strobe that flashes on the beat during the opener. */
const BeatFlash: React.FC<{ bpm: number }> = ({ bpm }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = interpolate(frame, [0, 120, 150], [0.5, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ background: "#e01010", opacity: beatOpacity(frame, fps, bpm, 0) * fade }}
    />
  );
};

export const NewsBreaking: React.FC<NewsBreakingProps> = ({
  headline,
  body,
  source,
  category,
  audioTrack,
  animationStyle = "kinetic",
}) => {
  const track = resolveTrack(audioTrack, "breaking");
  const bpm = trackBpm(track);
  const headlineStyle = animationStyle === "minimal" ? "wipe" : "scramble";

  // TODO(voiceover): layer a TTS narration track here (e.g. ElevenLabs output
  // saved to Supabase Storage) as a second <Audio> once copy→speech lands.

  return (
    <GradientBg variant="news">
      <AudioLayer track={track} volume={0.7} transitionFrames={[S2, S3]} />

      {/* Scene 1 — red flash + BREAKING slam */}
      <Sequence durationInFrames={S2 + 20}>
        <BeatFlash bpm={bpm} />
        <AbsoluteFill style={{ padding: 90, justifyContent: "center" }}>
          <BeatPulse bpm={bpm} intensity={0.08} glow glowColor="#ff4444">
            <div
              style={{
                display: "inline-block",
                background: "#e01010",
                color: "#fff",
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: 4,
                textTransform: "uppercase",
                padding: "14px 30px",
                borderRadius: 10,
              }}
            >
              <KineticText text={category} style="slam" bpm={bpm} as="span" />
            </div>
          </BeatPulse>
          <KineticText
            text="BREAKING"
            style={animationStyle === "minimal" ? "wipe" : "glitch"}
            bpm={bpm}
            startFrame={14}
            as="div"
            textStyle={{
              marginTop: 30,
              color: "#fff",
              fontSize: 180,
              fontWeight: 900,
              letterSpacing: 4,
            }}
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={S2 - 14} durationInFrames={28} layout="none">
        <SceneWipe style="glitch-cut" duration={28} color="#1a0505" />
      </Sequence>

      {/* Scene 2 — headline scramble, then body wipe */}
      <Sequence from={S2} durationInFrames={S3 - S2 + 20}>
        <AbsoluteFill style={{ padding: 90, justifyContent: "center" }}>
          <KineticText
            text={headline}
            style={headlineStyle}
            bpm={bpm}
            startFrame={6}
            as="h1"
            textStyle={{
              color: "#fff",
              fontSize: 86,
              fontWeight: 900,
              lineHeight: 1.05,
              maxWidth: 1500,
              textShadow: "0 6px 40px rgba(0,0,0,0.5)",
            }}
          />
          <KineticText
            text={body}
            style="wipe"
            bpm={bpm}
            startFrame={40}
            as="p"
            textStyle={{
              marginTop: 36,
              color: "rgba(255,255,255,0.85)",
              fontSize: 40,
              lineHeight: 1.4,
              maxWidth: 1400,
            }}
          />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={S3 - 14} durationInFrames={28} layout="none">
        <SceneWipe style="slide-left" duration={28} color="#1a0505" />
      </Sequence>

      {/* Scene 3 — source badge + ticker */}
      <Sequence from={S3}>
        <AbsoluteFill style={{ padding: 90 }}>
          <BeatPulse bpm={bpm} intensity={0.06} style={{ position: "absolute", top: 90, right: 90 }}>
            <div
              style={{
                border: "3px solid rgba(255,255,255,0.4)",
                borderRadius: 100,
                padding: "14px 30px",
                color: "#fff",
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              {source}
            </div>
          </BeatPulse>
          <AbsoluteFill style={{ justifyContent: "center" }}>
            <KineticText
              text={headline}
              style="wipe"
              bpm={bpm}
              startFrame={6}
              as="h2"
              textStyle={{ color: "#fff", fontSize: 64, fontWeight: 900, maxWidth: 1500 }}
            />
          </AbsoluteFill>
          <TickerBar text={headline} label="BREAKING" color="#e01010" />
        </AbsoluteFill>
      </Sequence>
    </GradientBg>
  );
};

export default NewsBreaking;
