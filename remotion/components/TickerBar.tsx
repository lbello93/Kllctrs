import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export const TickerBar: React.FC<{
  text: string;
  label?: string;
  color?: string;
  speed?: number;
}> = ({ text, label = "LIVE", color = "#e01010", speed = 120 }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // Repeat the text so the strip never shows a gap, then scroll it leftward.
  const repeated = Array(6).fill(text).join("     •     ");
  const offset = (frame * speed) / 30;
  const x = width - (offset % (width * 3));

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        display: "flex",
        alignItems: "center",
        background: "rgba(0,0,0,0.75)",
        borderTop: `4px solid ${color}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          background: color,
          color: "#fff",
          fontSize: 32,
          fontWeight: 900,
          letterSpacing: 2,
          zIndex: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          whiteSpace: "nowrap",
          transform: `translateX(${x}px)`,
          color: "#fff",
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        {repeated}
      </div>
    </div>
  );
};

export default TickerBar;
