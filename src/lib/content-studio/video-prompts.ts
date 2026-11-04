/**
 * KLLCTRS Claude motion-graphics video prompt generators — 10 styles.
 *
 * Each `build(input, aspect)` returns a complete, self-contained prompt. The
 * admin copies it into a fresh claude.ai chat; Claude then builds the renderer
 * and produces a KLLCTRS-branded video. Nothing depends on this app.
 */
import { KLLCTRS_BRAND } from "./kllctrs-context";
import type { AspectRatio, StudioInput, VideoStyle } from "./types";

const C = KLLCTRS_BRAND.colors;

function dims(aspect: AspectRatio): string {
  if (aspect === "9:16") return "1080×1920 (vertical)";
  if (aspect === "1:1") return "1080×1080 (square)";
  return "1920×1080 (horizontal)";
}

/** Shared KLLCTRS brand + content + color context block. */
function ctx(input: StudioInput, aspect: AspectRatio): string {
  const points = input.keyPoints.length
    ? input.keyPoints.map((p) => `  - ${p}`).join("\n")
    : `  - What ${input.topic} is\n  - Why collectors care\n  - How KLLCTRS helps`;
  const stats = input.stats.length
    ? input.stats.map((s) => `  - ${s.label}: ${s.value}${s.unit ? ` ${s.unit}` : ""}`).join("\n")
    : "  - (no stats provided)";
  const ev = [
    input.eventName && `event: ${input.eventName}`,
    input.location && `location: ${input.location}`,
    input.date && `date: ${input.date}`,
    input.vendorCount && `vendors: ${input.vendorCount}`,
    input.cardSet && `card/set: ${input.cardSet}`,
  ].filter(Boolean).join("  ·  ");

  return `BRAND: KLLCTRS — "${KLLCTRS_BRAND.tagline}" (${KLLCTRS_BRAND.url}) — a trading-card collector platform.
TOPIC: ${input.topic}
AUDIENCE: trading-card collectors (${input.audience})   TONE: ${input.tone}
CALL TO ACTION: ${input.cta || "Collect, trade and find events on KLLCTRS"}
${ev ? `EVENT/DROP CONTEXT: ${ev}\n` : ""}
KEY POINTS:
${points}

STATS:
${stats}

COLOR & TYPE (KLLCTRS palette):
- Background: ${C.navy} (navy — NOT black)
- Text: ${C.cream} (cream)
- Accent: ${C.amethyst} (amethyst / purple)
- Gold: ${C.tuscan} (tuscan — stats, highlights)
- Pink: ${C.bloom} (bloom — alerts, drops, urgency)
- Heading font: ${KLLCTRS_BRAND.fonts.heading}; Display: ${KLLCTRS_BRAND.fonts.display}; Body: ${KLLCTRS_BRAND.fonts.body}

OUTPUT:
- Resolution: ${dims(aspect)}  ·  30 fps  ·  MP4 (H.264)`;
}

const STAGES = `\nWORK IN STAGES:
1. Confirm the shot list (one line per scene).
2. Build the renderer/primitives.
3. Build each scene.
4. Render a rough, then the full video.
Report the output file path when done.`;

// --------------------------------------------------------------------------- //
// Style builders
// --------------------------------------------------------------------------- //
function showreel(input: StudioInput, aspect: AspectRatio): string {
  return `Make a dynamic 15-20 second motion graphics showreel for KLLCTRS, a trading-card collector platform. Render with an HTML5 Canvas + GSAP timeline, then capture frames and encode to MP4 with ffmpeg.

${ctx(input, aspect)}

STRUCTURE (5 beats):
1. HOOK (0-3s): kinetic type slams in — "${input.topic}" — amethyst shapes morph behind.
2. PLATFORM (3-7s): the KLLCTRS wordmark reveals; quick flashes of the app (event map, collection).
3. FEATURES (7-12s): three key points snap in as cards, one per ~1.5s.
4. STATS (12-16s): collector/market numbers count up in tuscan gold with tabular figures.
5. LOGO + CTA (16-20s): KLLCTRS logo reveal, hold on the CTA.

MOTION: very fast snaps (2-3 frames) against short readable holds; spring easing with a tiny overshoot; hard cuts; no layout-property tweens.
${STAGES}`;
}

function eventExplainer(input: StudioInput, aspect: AspectRatio): string {
  return `Build a 20-30 second KLLCTRS event-promo explainer using a Python + Pillow + ffmpeg pipeline (engine.py primitives, scenes.py scene library, render.py reads a script and encodes the MP4).

${ctx(input, aspect)}

SCENES:
1. HOOK: two-line headline over a center amethyst glow orb on a navy star-field.
2. EVENT DETAILS: date (tuscan), location and what to expect slide in.
3. FEATURED VENDORS: a counter animates the vendor/attendance numbers.
4. MAP / LOCATION: a stylized map pin drops; the city name settles.
5. CTA: "Get tickets / RSVP on KLLCTRS".

MOTION: easing cubic ease-out, t = 1 - (1 - t)^3; subtle star-field; amethyst radial glow at 10-15% opacity.
${STAGES}`;
}

function cardDropKinetic(input: StudioInput, aspect: AspectRatio): string {
  return `Create a 10-15 second KLLCTRS card-drop kinetic typography video — pure type, with a card reveal at the end. Render with HTML5 Canvas + GSAP, then encode to MP4 with ffmpeg.

${ctx(input, aspect)}

SEQUENCE:
- ONE WORD PER BEAT: "NEW" → "DROP" → "ALERT" → the card/set "${input.cardSet || input.topic}" image assembles → "KLLCTRS".
- Words alternate entrances: slam, slide, scale, flip.
- Background pulses on the beat; bloom-pink flashes on the alert words; the final logo glows amethyst.

MOTION: spring easing (damping ~0.7); snappy, musical timing.
${STAGES}`;
}

function logoReveal(input: StudioInput, aspect: AspectRatio): string {
  return `Create a 5-8 second KLLCTRS logo reveal. Render with HTML5 Canvas + GSAP (particle system), then encode to MP4 with ffmpeg.

${ctx(input, aspect)}

SEQUENCE:
1. ~50 amethyst-colored particles converge from the frame edges to form "KLLCTRS" (Unica One display face).
2. The glow intensifies, then the letters fill left-to-right.
3. The tagline "${KLLCTRS_BRAND.tagline}" types on beneath in cream.
4. A soft amethyst lens flare sweeps across.

MOTION: particle convergence with ease-out; crisp letter fill; short and confident.
${STAGES}`;
}

function platformDemo(input: StudioInput, aspect: AspectRatio): string {
  return `Make a 15-20 second KLLCTRS platform-feature demo. Visit ${KLLCTRS_BRAND.url} and use its real screenshots, logo and colours. Render with HTML5 Canvas + GSAP, then encode to MP4 with ffmpeg.

${ctx(input, aspect)}

STRUCTURE:
1. A phone mockup assembles in 3D perspective with the KLLCTRS app inside.
2. Show four features in turn with a cursor doing real actions: event map, card collection, trading, profile.
3. Close on the logo + CTA.

MOTION: smooth, springy product-film motion; realistic cursor easing; soft parallax between screens.
${STAGES}`;
}

function marketDataViz(input: StudioInput, aspect: AspectRatio): string {
  return `Build a 15-25 second KLLCTRS trading-card market data visualization. Render with HTML5 Canvas + GSAP, then encode to MP4 with ffmpeg.

${ctx(input, aspect)}

SCENES:
1. A bar chart builds left to right: market growth / card categories / price trends from the stats above.
2. Counter tiles: total market value, active collectors, cards traded — tuscan tabular digits.
3. A short takeaway lands on the key insight.

MOTION: bars grow with spring easing and slight overshoot; chart colors: amethyst ${C.amethyst}, gold ${C.tuscan}, pink ${C.bloom}; subtle gridlines; labels in grey.
${STAGES}`;
}

function socialReel(input: StudioInput): string {
  return `Make a 10-15 second vertical KLLCTRS social reel (9:16) for Instagram Reels / TikTok / YouTube Shorts. Render with HTML5 Canvas + GSAP, then encode to MP4 with ffmpeg.

${ctx(input, "9:16")}

STRUCTURE:
- Hook: "The home for card collectors" → feature flash → one stat → "Download KLLCTRS".
- Fast-paced, ONE IDEA PER BEAT. Keep text in a 5% safe margin (middle 80% vertically). Max 8 words per screen, readable in ~1.5s. Hard cuts with a 2-frame scale pop.
${STAGES}`;
}

function collectorTestimonial(input: StudioInput, aspect: AspectRatio): string {
  const quote = input.keyPoints[0] || "KLLCTRS changed how I collect.";
  return `Create an 8-12 second KLLCTRS collector testimonial. Render with HTML5 Canvas + GSAP, then encode to MP4 with ffmpeg.

${ctx(input, aspect)}

QUOTE: "${quote}"

SEQUENCE:
1. The quote types on word by word with a blinking cursor (~80ms per character).
2. A large quotation mark sits at 20% opacity in the background; a simple avatar circle appears.
3. The collector's name + collection size slide up, with an amethyst underline on the key phrase.

MOTION: typewriter reveal; gentle settle on the author line.
${STAGES}`;
}

function cardShowcaseLoop(input: StudioInput): string {
  return `Create a seamless 10-second 3D trading-card showcase loop using Three.js + WebGL, then capture frames and encode to MP4 with ffmpeg.

${ctx(input, "1:1")}

SCENE:
- Several trading cards orbit and gently morph, referencing "${input.topic}".
- Glass-like card materials tinted amethyst; cards catch light with subtle refraction.
- A slow camera push-in that resets seamlessly at the loop point.

MOTION: continuous and hypnotic — no cuts, no holds. The first and last frame must match exactly for a perfect loop.
${STAGES}`;
}

function beforeAfter(input: StudioInput, aspect: AspectRatio): string {
  return `Build a 12-15 second "before / after KLLCTRS" reveal. Render with HTML5 Canvas + GSAP, then encode to MP4 with ffmpeg.

${ctx(input, aspect)}

SEQUENCE:
1. BEFORE: spreadsheets, lost cards, missed shows — grey, desaturated, static.
2. A diagonal wipe sweeps across with an amethyst edge line.
3. AFTER: the KLLCTRS app in amethyst + gold — organized collection, event map — full color with entrance animations and a soft glow.
4. End on a side-by-side comparison with a divider line.

MOTION: decisive diagonal wipe; after-state elements animate in with ease-out.
${STAGES}`;
}

export const VIDEO_STYLES: VideoStyle[] = [
  {
    id: "showreel", name: "Showreel / Launch Film", emoji: "🎬",
    description: "Fast-cut KLLCTRS brand showreel — kinetic type, card UI, logo reveal.",
    duration: "15-20s", bestFor: ["Brand", "Launch"], renderMethod: "Canvas + GSAP",
    aspects: ["16:9", "9:16", "1:1"], build: showreel,
  },
  {
    id: "event-explainer", name: "Event Promo Explainer", emoji: "📅",
    description: "Animated event promo: date, location, vendors, map, CTA.",
    duration: "20-30s", bestFor: ["Card shows", "Meetups"], renderMethod: "Python + Pillow",
    aspects: ["9:16", "16:9", "1:1"], build: eventExplainer,
  },
  {
    id: "card-drop", name: "Card Drop Kinetic Type", emoji: "🃏",
    description: "NEW / DROP / ALERT slams one word per beat, card reveal at end.",
    duration: "10-15s", bestFor: ["Drops", "Releases"], renderMethod: "Canvas + GSAP",
    aspects: ["9:16", "1:1", "16:9"], build: cardDropKinetic,
  },
  {
    id: "logo-reveal", name: "KLLCTRS Logo Reveal", emoji: "✨",
    description: "Amethyst particles form the KLLCTRS wordmark + tagline.",
    duration: "5-8s", bestFor: ["Intros", "Stingers"], renderMethod: "Canvas + GSAP",
    aspects: ["16:9", "1:1", "9:16"], build: logoReveal,
  },
  {
    id: "platform-demo", name: "Platform Feature Demo", emoji: "📱",
    description: "App screenshots animate in with cursor actions on a mockup.",
    duration: "15-20s", bestFor: ["Features", "Onboarding"], renderMethod: "Canvas + GSAP",
    aspects: ["16:9", "9:16", "1:1"], build: platformDemo,
  },
  {
    id: "market-data", name: "Market Data Visualization", emoji: "📈",
    description: "Trading-card market stats as animated charts + counters.",
    duration: "15-25s", bestFor: ["Market", "Reports"], renderMethod: "Canvas + GSAP",
    aspects: ["16:9", "9:16", "1:1"], build: marketDataViz,
  },
  {
    id: "social-reel", name: "Social Reel (9:16)", emoji: "📲",
    description: "Vertical, fast-paced KLLCTRS promo for Reels/TikTok/Shorts.",
    duration: "10-15s", bestFor: ["Reels", "TikTok", "Shorts"], renderMethod: "Canvas + GSAP",
    aspects: ["9:16"], build: (input) => socialReel(input),
  },
  {
    id: "testimonial", name: "Collector Testimonial", emoji: "💬",
    description: "A collector's quote types on with an avatar + underline.",
    duration: "8-12s", bestFor: ["Social proof"], renderMethod: "Canvas + GSAP",
    aspects: ["1:1", "9:16", "16:9"], build: collectorTestimonial,
  },
  {
    id: "card-loop-3d", name: "3D Card Showcase Loop", emoji: "🌀",
    description: "Glass trading cards orbit and morph — seamless hypnotic loop.",
    duration: "10s", bestFor: ["Backgrounds", "Ambience"], renderMethod: "Three.js",
    aspects: ["1:1", "16:9", "9:16"], build: (input) => cardShowcaseLoop(input),
  },
  {
    id: "before-after", name: "Before / After", emoji: "🔀",
    description: "Before KLLCTRS (grey chaos) vs after (amethyst, organized).",
    duration: "12-15s", bestFor: ["Transformation"], renderMethod: "Canvas + GSAP",
    aspects: ["16:9", "9:16", "1:1"], build: beforeAfter,
  },
];

export function getVideoStyle(id: string): VideoStyle | undefined {
  return VIDEO_STYLES.find((s) => s.id === id);
}
