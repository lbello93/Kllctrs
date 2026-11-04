/**
 * KLLCTRS-branded HTML/CSS image generators. Each returns a complete,
 * self-contained HTML document that renders at exact pixel dimensions on the
 * navy theme, captured to PNG by the preview component via html2canvas.
 */
import { KLLCTRS_BRAND } from "./kllctrs-context";
import type { ImageTemplate, StudioInput } from "./types";

const C = KLLCTRS_BRAND.colors;

function esc(s: string): string {
  return (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface ShellOpts {
  width: number;
  height: number;
  body: string;
  extraCss?: string;
}

/** Shared KLLCTRS shell: navy bg, amethyst glow, star field, brand fonts. */
function shell({ width, height, body, extraCss = "" }: ShellOpts): string {
  const stars = Array.from({ length: 56 })
    .map((_, i) => {
      const x = (i * 97) % 100;
      const y = (i * 61) % 100;
      const s = (i % 3) + 1;
      const o = 0.1 + (i % 5) * 0.05;
      return `<div class="star" style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;opacity:${o}"></div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=Unica+One&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:${width}px; height:${height}px; }
  body {
    position:relative; overflow:hidden;
    background:linear-gradient(160deg, ${C.navy} 0%, #0d1428 100%);
    color:${C.cream};
    font-family:'Inter', system-ui, sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .glow { position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(60% 50% at 50% 36%, ${C.amethyst}26 0%, ${C.amethyst}0f 42%, transparent 72%); }
  .stars { position:absolute; inset:0; pointer-events:none; }
  .star { position:absolute; background:${C.cream}; border-radius:50%; }
  .heading { font-family:'Space Grotesk', sans-serif; }
  .display { font-family:'Unica One', 'Space Grotesk', sans-serif; letter-spacing:.04em; }
  .brand-pill {
    display:inline-flex; align-items:center; gap:8px;
    background:${C.amethyst}; color:${C.cream};
    border-radius:999px; font-family:'Unica One', sans-serif;
    letter-spacing:.14em; text-transform:uppercase;
  }
  .pill {
    display:inline-flex; align-items:center; gap:8px;
    border:1px solid ${C.border}; color:${C.amethystLight};
    background:${C.amethyst}1f; border-radius:999px;
    font-weight:700; letter-spacing:.06em; text-transform:uppercase;
  }
  .cta {
    display:inline-flex; align-items:center; gap:10px;
    background:${C.amethyst}; color:${C.cream};
    border-radius:14px; font-weight:800;
  }
  .content { position:relative; z-index:2; width:100%; height:100%; display:flex; }
  ${extraCss}
</style>
</head><body>
<div class="glow"></div>
<div class="stars">${stars}</div>
<div class="content">${body}</div>
</body></html>`;
}

function brandBadge(size = 26): string {
  return `<span class="brand-pill" style="font-size:${size}px;padding:${size * 0.4}px ${size * 0.9}px">${KLLCTRS_BRAND.name}</span>`;
}

// --------------------------------------------------------------------------- //
// Templates
// --------------------------------------------------------------------------- //
function eventCard(input: StudioInput): string {
  const name = input.eventName || input.topic;
  const body = `<div style="flex-direction:column;justify-content:space-between;padding:90px;display:flex;width:100%">
    ${brandBadge(26)}
    <div>
      <div class="pill" style="font-size:24px;padding:12px 24px;margin-bottom:28px">Card Show</div>
      <h1 class="heading" style="font-size:88px;font-weight:700;line-height:1.0;text-transform:uppercase">${esc(name)}</h1>
      <div style="margin-top:34px;font-size:46px;color:${C.tuscan};font-weight:800">${esc(input.date || "Date TBA")}</div>
      <div style="margin-top:10px;font-size:40px;color:${C.cream}">${esc(input.location || "Location TBA")}</div>
      ${input.vendorCount ? `<div style="margin-top:20px;font-size:34px;color:${C.bloom};font-weight:700">${esc(input.vendorCount)}+ vendors</div>` : ""}
    </div>
    <div class="cta" style="font-size:36px;padding:20px 40px;align-self:flex-start">${esc(input.cta || "Find events on KLLCTRS")}</div>
  </div>`;
  return shell({ width: 1080, height: 1080, body });
}

function dropAlert(input: StudioInput): string {
  const set = input.cardSet || input.topic;
  const body = `<div style="flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:90px 70px;gap:40px;display:flex;width:100%">
    <div class="pill" style="font-size:30px;padding:16px 34px;border-color:${C.bloom}66;color:${C.bloomLight};background:${C.bloom}1f">🚨 New Drop</div>
    <h1 class="heading" style="font-size:118px;font-weight:700;line-height:.98;text-transform:uppercase">${esc(set)}</h1>
    ${input.tagline ? `<p style="font-size:44px;color:${C.gray};max-width:840px">${esc(input.tagline)}</p>` : ""}
    <div style="font-size:40px;color:${C.tuscan};font-weight:800">${esc(input.cta || "Live now on KLLCTRS")}</div>
    <div style="position:absolute;bottom:80px">${brandBadge(30)}</div>
  </div>`;
  return shell({ width: 1080, height: 1920, body });
}

function collectorCard(input: StudioInput): string {
  const quote = input.keyPoints[0] || `${input.topic} — one collector's journey.`;
  const body = `<div style="flex-direction:column;justify-content:center;padding:100px;gap:36px;display:flex;width:100%;position:relative">
    <div style="position:absolute;top:40px;left:70px;font-size:360px;line-height:1;color:${C.amethyst};opacity:.14;font-weight:900">&ldquo;</div>
    <div class="pill" style="font-size:24px;padding:12px 24px;align-self:flex-start">🌟 Collector Spotlight</div>
    <blockquote class="heading" style="position:relative;font-size:62px;font-weight:700;line-height:1.22">${esc(quote)}</blockquote>
    <div style="height:6px;width:160px;background:${C.tuscan};border-radius:3px"></div>
    <div style="font-size:38px;color:${C.cream};font-weight:700">${esc(input.eventName || "A KLLCTRS collector")}</div>
    <div style="position:absolute;bottom:60px;right:100px">${brandBadge(24)}</div>
  </div>`;
  return shell({ width: 1080, height: 1080, body });
}

function marketStats(input: StudioInput): string {
  const stats = (input.stats.length ? input.stats : [
    { label: "hobby market", value: "$30", unit: "B+" },
    { label: "collectors", value: "25", unit: "K+" },
    { label: "YoY growth", value: "40", unit: "%" },
  ]).slice(0, 4);
  const tiles = stats.map((s) => `<div style="border:1px solid ${C.border};background:${C.cardBg};border-radius:24px;padding:46px">
      <div class="heading" style="font-size:92px;font-weight:700;color:${C.tuscan};line-height:1;font-variant-numeric:tabular-nums">${esc(s.value)}<span style="font-size:46px;color:${C.cream};margin-left:8px">${esc(s.unit || "")}</span></div>
      <div style="font-size:32px;color:${C.gray};margin-top:14px">${esc(s.label)}</div>
    </div>`).join("");
  const body = `<div style="flex-direction:column;padding:90px;gap:44px;display:flex;width:100%">
    ${brandBadge(24)}
    <div class="pill" style="font-size:26px;padding:12px 26px;align-self:flex-start">Market Update</div>
    <h1 class="heading" style="font-size:72px;font-weight:700;line-height:1.05;text-transform:uppercase">${esc(input.topic)}</h1>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px">${tiles}</div>
  </div>`;
  return shell({ width: 1080, height: 1350, body });
}

function carouselSlide(input: StudioInput): string {
  const body = `<div style="flex-direction:column;justify-content:center;padding:110px;gap:48px;display:flex;width:100%">
    <div class="display" style="font-size:200px;color:${C.amethystLight};opacity:.3;line-height:.8">01</div>
    <h1 class="heading" style="font-size:88px;font-weight:700;line-height:1.05;margin-top:-50px">${esc(input.keyPoints[0] || input.topic)}</h1>
    <p style="font-size:40px;color:${C.gray};line-height:1.4;max-width:880px">${esc(input.keyPoints[1] || input.tagline || `Everything collectors should know about ${input.topic}.`)}</p>
    <div style="position:absolute;bottom:90px;right:110px;color:${C.tuscan};font-size:36px;font-weight:800">Swipe →</div>
    <div style="position:absolute;bottom:90px;left:110px">${brandBadge(24)}</div>
  </div>`;
  return shell({ width: 1080, height: 1080, body });
}

function youtubeThumb(input: StudioInput): string {
  const title = (input.topic || "").toUpperCase();
  const body = `<div style="flex-direction:column;justify-content:center;padding:80px;display:flex;width:100%">
    <div style="margin-bottom:26px">${brandBadge(22)}</div>
    <h1 class="heading" style="font-size:118px;font-weight:700;line-height:.98;max-width:1050px;text-shadow:0 6px 40px rgba(0,0,0,.55)">${esc(title)}</h1>
    ${input.tagline ? `<p style="font-size:40px;color:${C.tuscan};font-weight:800;margin-top:26px">${esc(input.tagline)}</p>` : ""}
  </div>`;
  return shell({ width: 1280, height: 720, body });
}

export const IMAGE_TEMPLATES: ImageTemplate[] = [
  { id: "event-card", name: "Event Announcement", aspect: "1:1", width: 1080, height: 1080, render: eventCard },
  { id: "drop-alert", name: "Drop Alert", aspect: "9:16", width: 1080, height: 1920, render: dropAlert },
  { id: "collector-card", name: "Collector Spotlight", aspect: "1:1", width: 1080, height: 1080, render: collectorCard },
  { id: "market-stats", name: "Market Stats", aspect: "4:5", width: 1080, height: 1350, render: marketStats },
  { id: "carousel-slide", name: "Carousel Slide", aspect: "1:1", width: 1080, height: 1080, render: carouselSlide },
  { id: "youtube-thumb", name: "YouTube Thumbnail", aspect: "16:9", width: 1280, height: 720, render: youtubeThumb },
];
