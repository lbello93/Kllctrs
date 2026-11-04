# Content Studio

A pure-Python CLI that turns **one topic** into:

1. **Platform-native social posts** for Instagram, X/Twitter, LinkedIn, YouTube,
   Threads, and TikTok, and
2. A **self-contained Claude web video prompt** — paste it into a fresh
   [claude.ai](https://claude.ai) chat and Claude builds a motion-graphics
   rendering pipeline and renders a vertical (1080×1920) MP4.

No external dependencies (standard library only). No API keys. Everything runs
locally; the video prompt is the product.

## Quick start

```bash
cd content-studio

# Interactive
python3 -I studio.py --interactive

# One-liner
python3 -I studio.py \
  --topic "LiDAR Drones" \
  --audience tech \
  --tone educational \
  --points "No camera needed — LiDAR sees differently" \
           "Fires laser pulses" \
           "Millions of 3D points per second" \
  --stats '[{"label":"Range","value":300,"unit":"meters"},{"label":"Accuracy","value":2.0,"unit":"cm"}]' \
  --items '[{"icon":"1D","name":"distance","desc":"altitude hold"},{"icon":"2D","name":"slice","desc":"walls, position"}]' \
  --platforms all
```

If you omit `--points`, `--stats`, or `--items`, Content Studio auto-generates
sensible, topic-derived defaults.

## Flags

| Flag | Description | Default |
| ---- | ----------- | ------- |
| `--topic` | Content topic (required unless `--interactive`) | — |
| `--audience` | `tech` / `founders` / `general` / `creators` | `general` |
| `--tone` | `educational` / `promotional` / `trending` / `storytelling` / `tutorial` | `educational` |
| `--points` | Key points as quoted strings | auto |
| `--stats` | JSON array of `{label, value, unit}` | auto |
| `--items` | JSON array of `{icon, name, desc}` (cheatsheet) | auto |
| `--platforms` | Comma-separated list or `all` | `all` |
| `--video-only` | Only build the video prompt | — |
| `--posts-only` | Only build social posts | — |
| `--output` | Output directory | `output` |
| `--json` | Emit one JSON bundle to stdout | — |
| `--interactive` | Interactive input mode | — |

## Output

Files land in the `--output` directory:

- `{slug}_{platform}.txt` — one file per platform
- `{slug}_video_prompt.txt` — the Claude web prompt (paste this)
- `{slug}_script.json` — the video scene definition
- `{slug}_content_bundle.json` — everything in one JSON file

## How the video prompt works

1. Run Content Studio to produce `{slug}_video_prompt.txt`.
2. Open a **new** chat at claude.ai and paste the file's full contents.
3. Claude generates `engine.py`, `scenes.py`, `render.py`, and `script.json`,
   then runs `python3 -I render.py` to encode the MP4 with ffmpeg (libx264,
   CRF 18).

The prompt is fully self-contained — it carries the script, the visual spec
(dark `#080a0f` background, neon `#b4ff00` accent, Inter font), the animation
spec (cubic ease-out, lerp, alpha compositing, 30 fps), and the pipeline
description, so a fresh chat needs nothing else.

## Layout

```
content-studio/
├── studio.py              # CLI entry point
├── util.py                # shared helpers (slug, number/format, chunk)
├── platforms/             # one generator per platform
├── content/               # hooks, hashtags, tone, auto-generation
├── video/                 # script + prompt builders, scene templates
├── templates/
│   └── video_prompt.md    # master Claude web prompt template
└── output/                # generated content lands here
```
