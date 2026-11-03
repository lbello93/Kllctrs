import React from "react";
import { AbsoluteFill } from "remotion";

export type GradientVariant = "news" | "sponsor" | "event" | "recap" | "brand";

const GRADIENTS: Record<GradientVariant, string> = {
  // Breaking-news red/dark.
  news: "linear-gradient(135deg, #1a0505 0%, #3b0a0a 45%, #7f1010 100%)",
  // KLLCTRS violet brand.
  sponsor: "linear-gradient(135deg, #1a0a3d 0%, #2d1065 50%, #5f2eea 100%)",
  event: "linear-gradient(135deg, #0a1a3d 0%, #10224a 50%, #2e6cea 100%)",
  recap: "linear-gradient(135deg, #1a0a3d 0%, #3a1a6b 50%, #7c3aed 100%)",
  brand: "linear-gradient(135deg, #1a0a3d 0%, #4a1fa8 100%)",
};

export const GradientBg: React.FC<{
  variant?: GradientVariant;
  children?: React.ReactNode;
}> = ({ variant = "brand", children }) => {
  return (
    <AbsoluteFill style={{ background: GRADIENTS[variant] }}>
      {/* Subtle vignette + grain overlay for depth. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 55%)",
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export default GradientBg;
