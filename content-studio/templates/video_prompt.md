# Motion Graphics Video — Build & Render Request

You are an autonomous build agent with a Python environment and `ffmpeg`
available. In this single session, generate a complete, self-contained
motion-graphics rendering pipeline **and run it** to produce a production MP4.
Everything you need is in this message — do not ask follow-up questions.

Write four files (`engine.py`, `scenes.py`, `render.py`, `script.json`), then
execute the render command at the end. Use **Pillow (PIL)** for drawing and
**ffmpeg** for encoding.

---

## 1. `engine.py` — core primitives

Define the shared constants and drawing helpers:

- Canvas: `W = {{WIDTH}}`, `H = {{HEIGHT}}`, `FPS = {{FPS}}` (vertical, 9:16).
- Colors: `BG = "{{BG}}"` (dark background), `ACCENT = "{{ACCENT}}"` (neon accent),
  plus white `#ffffff` and muted grey `#8b93a7` for secondary text.
- Fonts: **{{FONT}}** family — load weights Black, ExtraBold, Bold, SemiBold,
  Medium, Regular (fall back to the default PIL font if the TTFs are not
  installed, but prefer Inter). Provide a `font(weight, size)` helper.
- Easing: `ease_out(t)` using cubic ease-out `1 - (1 - t) ** 3`.
- `lerp(a, b, t)` linear interpolation; `clamp(x, lo, hi)`.
- Alpha compositing: draw onto an RGBA layer and `Image.alpha_composite` over the
  background so fades and glows blend correctly.
- Drawing helpers:
  - `new_frame()` → fresh `BG`-filled RGBA image + `ImageDraw`.
  - `rounded_rect(draw, box, radius, fill, outline=None)`.
  - `text_centered(draw, cx, y, s, fnt, fill, alpha=255)`.
  - `glow_orb(img, cx, cy, radius, color, intensity)` — radial neon glow.
  - `wireframe_icon(draw, box, label)` — an accent-outlined rounded square with a
    short label, for cheatsheet icons.
  - `fmt_count(n)` — integer with thousands separators (`1200000` → `1,200,000`).

## 2. `scenes.py` — scene library

One function per scene type. Each takes the local frame index, the scene's total
frame count, and the scene's data dict, and returns a composited RGBA frame.
Animate with `ease_out` on normalized time `t = frame / total`.

- **hook** — `line1` / `line2` scale up from 0.8→1.0 with a center **glow orb**
  pulsing behind them; `subtitle` fades in underneath after ~40% of the scene.
- **explainer** — a small accent `badge` pill, a `headline` that slides in from
  the right, then the `lines` bullets stagger in from the left (each delayed by
  ~6 frames), accent dot before each line.
- **stats** — a `title`, then each stat's number **counts up** from 0 to `value`
  with comma formatting, `label` above and `unit` after the number; stats stagger
  in vertically.
- **cheatsheet** — a `title`, then a dark rounded **card** containing each item as
  a row: `wireframe_icon` (from `icon`) + bold `name` + muted `desc`, revealed
  staggered top-to-bottom; `footer` fades in at the bottom.
- **diagram** — a `title` and `caption`, plus a custom illustration drawn by a
  small callback `draw(img, draw_ctx, t)` (e.g. nodes + connecting lines that
  draw on progressively with `t`).
- **fade_black** — a short black fade used between scenes for clean cuts.

## 3. `render.py` — CLI renderer

- Read `script.json` from the working directory.
- For each scene, render `duration * FPS` frames by calling the matching function
  in `scenes.py`; save each as a sequential JPEG (quality 95) into a temp dir.
- Pipe the frames to **ffmpeg** with `libx264`, `-crf 18`, `-pix_fmt yuv420p`,
  `-r {{FPS}}`, producing `{{NAME}}.mp4`.
- Clean up the temp frames afterward. Print the output path and total duration.
- Runnable as `python3 -I render.py` (isolated mode — no external config).

## 4. `script.json`

```json
{{SCRIPT_JSON}}
```

---

## Visual spec

- **{{WIDTH}}×{{HEIGHT}}** vertical — built for Reels / Shorts / TikTok.
- Dark background **{{BG}}**, neon accent **{{ACCENT}}**.
- **{{FONT}}** font family (Black, ExtraBold, Bold, SemiBold, Medium, Regular).
- Generous margins; large, legible type that reads on a phone.

## Animation spec

- Eased motion using **cubic ease-out**; interpolate positions/opacities with
  **lerp**.
- **Alpha compositing** for all fades and glows.
- **{{FPS}} fps** throughout; keep motion smooth and snappy.

## Pipeline summary

- `engine.py` — primitives: `W={{WIDTH}}`, `H={{HEIGHT}}`, `FPS={{FPS}}`, colors,
  fonts, easing, drawing helpers, number formatting.
- `scenes.py` — scene library: `hook`, `explainer`, `stats`, `diagram`,
  `cheatsheet`, `fade_black`.
- `render.py` — reads `script.json` → JPEG frames → `ffmpeg libx264 CRF 18` → MP4.

## Render command

```bash
python3 -I render.py
```

## Final instruction

Generate the complete `engine.py`, `scenes.py`, `render.py` files and the
`script.json` above, then **execute the render** to produce `{{NAME}}.mp4`.
Report the final file path when done.
