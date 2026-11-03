import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";

import GradientBg from "../components/GradientBg";
import AnimatedText from "../components/AnimatedText";
import TickerBar from "../components/TickerBar";

export const newsBreakingSchema = z.object({
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

export const NewsBreaking: React.FC<NewsBreakingProps> = ({
  headline,
  body,
  source,
  category,
}) => {
  return (
    <GradientBg variant="news">
      {/* Category flash */}
      <Sequence from={0}>
        <AbsoluteFill style={{ padding: 90 }}>
          <AnimatedText animation="slide-left" delay={2}>
            <div
              style={{
                display: "inline-block",
                background: "#e01010",
                color: "#fff",
                fontSize: 30,
                fontWeight: 900,
                letterSpacing: 3,
                textTransform: "uppercase",
                padding: "10px 24px",
                borderRadius: 8,
              }}
            >
              {category}
            </div>
          </AnimatedText>

          <AnimatedText animation="slide-left" delay={10} style={{ marginTop: 40 }}>
            <h1
              style={{
                color: "#fff",
                fontSize: 86,
                fontWeight: 900,
                lineHeight: 1.05,
                margin: 0,
                maxWidth: 1500,
                textShadow: "0 6px 40px rgba(0,0,0,0.5)",
              }}
            >
              {headline}
            </h1>
          </AnimatedText>

          <AnimatedText animation="fade" delay={28} style={{ marginTop: 36 }}>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 40,
                lineHeight: 1.4,
                margin: 0,
                maxWidth: 1400,
              }}
            >
              {body}
            </p>
          </AnimatedText>
        </AbsoluteFill>
      </Sequence>

      {/* Source badge */}
      <AnimatedText
        animation="pop"
        delay={16}
        style={{ position: "absolute", top: 90, right: 90 }}
      >
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
      </AnimatedText>

      <TickerBar text={headline} label="BREAKING" color="#e01010" />
    </GradientBg>
  );
};

export default NewsBreaking;
