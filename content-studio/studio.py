#!/usr/bin/env python3
"""Content Studio — generate platform-native social posts + a self-contained
Claude web video prompt from a single topic.

Examples
--------
    python3 -I studio.py --topic "LiDAR Drones" --tone educational \
        --points "Fires laser pulses" "Millions of 3D points per second"

    python3 -I studio.py --interactive
"""
from __future__ import annotations

import argparse
import datetime as _dt
import json
import os
import sys
from pathlib import Path

# Ensure this project's root is importable even under `python -I` (isolated
# mode), where the script directory is not always added to sys.path.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# The console output uses box-drawing characters and emoji; force UTF-8 so it
# prints on terminals whose default encoding can't (e.g. Windows cp1252).
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except Exception:  # pragma: no cover - older/odd stream objects
        pass

from platforms import instagram, x_twitter, linkedin, youtube, threads, tiktok  # noqa: E402
from content import autogen  # noqa: E402
from video.script_builder import build_script  # noqa: E402
from video.prompt_builder import build_video_prompt, DEFAULT_STYLE  # noqa: E402
from util import slugify  # noqa: E402

# Canonical platform order and their generator modules.
PLATFORMS = {
    "instagram": instagram,
    "x_twitter": x_twitter,
    "linkedin": linkedin,
    "youtube": youtube,
    "threads": threads,
    "tiktok": tiktok,
}
ALIASES = {"x": "x_twitter", "twitter": "x_twitter", "yt": "youtube", "ig": "instagram"}

LABELS = {
    "instagram": "Instagram",
    "x_twitter": "X (Twitter)",
    "linkedin": "LinkedIn",
    "youtube": "YouTube",
    "threads": "Threads",
    "tiktok": "TikTok",
}

VALID_TONES = ["educational", "promotional", "trending", "storytelling", "tutorial"]


# --------------------------------------------------------------------------- #
# Argument parsing
# --------------------------------------------------------------------------- #
def parse_args(argv):
    p = argparse.ArgumentParser(
        prog="studio.py",
        description="Generate social posts + a Claude web video prompt from a topic.",
    )
    p.add_argument("--topic", help="Content topic (required unless --interactive).")
    p.add_argument("--audience", default="general",
                   help="tech / founders / general / creators (default: general).")
    p.add_argument("--tone", default="educational", choices=VALID_TONES,
                   help="Content tone (default: educational).")
    p.add_argument("--points", nargs="+", default=None,
                   help="Key points as quoted strings.")
    p.add_argument("--stats", default=None,
                   help='JSON array of {"label","value","unit"} objects.')
    p.add_argument("--items", default=None,
                   help='JSON array of {"icon","name","desc"} for the cheatsheet.')
    p.add_argument("--platforms", default="all",
                   help='Comma-separated platforms or "all" (default: all).')
    p.add_argument("--video-only", action="store_true", help="Only build the video prompt.")
    p.add_argument("--posts-only", action="store_true", help="Only build social posts.")
    p.add_argument("--output", default="output", help="Output directory (default: output).")
    p.add_argument("--json", action="store_true", help="Emit a single JSON bundle to stdout.")
    p.add_argument("--interactive", action="store_true", help="Interactive input mode.")
    return p.parse_args(argv)


# --------------------------------------------------------------------------- #
# Input helpers
# --------------------------------------------------------------------------- #
def _parse_json_arg(raw, what):
    if not raw:
        return None
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise SystemExit(f"Invalid JSON for --{what}: {e}")
    if not isinstance(data, list):
        raise SystemExit(f"--{what} must be a JSON array.")
    return data


def _prompt(label):
    try:
        return input(label).strip()
    except EOFError:
        return ""


def interactive_input():
    print("\n=== Content Studio — interactive mode ===\n")
    topic = ""
    while not topic:
        topic = _prompt("Topic (required): ")
        if not topic:
            print("  Topic cannot be empty.")

    audience = _prompt("Audience [general]: ") or "general"

    tone = ""
    while tone not in VALID_TONES:
        tone = _prompt(f"Tone {VALID_TONES} [educational]: ") or "educational"
        if tone not in VALID_TONES:
            print(f"  Pick one of: {', '.join(VALID_TONES)}")

    print("\nKey points — one per line, blank line to finish:")
    points = []
    while True:
        line = _prompt("  • ")
        if not line:
            break
        points.append(line)

    print("\nStats — 'label,value,unit' per line, blank to finish:")
    stats = []
    while True:
        line = _prompt("  stat> ")
        if not line:
            break
        bits = [b.strip() for b in line.split(",")]
        if len(bits) < 2 or not bits[0]:
            print("    Need at least label,value")
            continue
        try:
            value = float(bits[1])
            value = int(value) if value == int(value) else value
        except ValueError:
            print("    value must be numeric")
            continue
        stats.append({"label": bits[0], "value": value, "unit": bits[2] if len(bits) > 2 else ""})

    print("\nCheatsheet items — 'icon,name,desc' per line, blank to finish:")
    items = []
    while True:
        line = _prompt("  item> ")
        if not line:
            break
        bits = [b.strip() for b in line.split(",")]
        if len(bits) < 2 or not bits[0]:
            print("    Need at least icon,name")
            continue
        items.append({"icon": bits[0], "name": bits[1], "desc": bits[2] if len(bits) > 2 else ""})

    return {
        "topic": topic, "audience": audience, "tone": tone,
        "points": points or None, "stats": stats or None, "items": items or None,
    }


def resolve_platforms(spec):
    if not spec or spec.strip().lower() == "all":
        return list(PLATFORMS.keys())
    chosen = []
    for raw in spec.split(","):
        name = raw.strip().lower()
        name = ALIASES.get(name, name)
        if name in PLATFORMS and name not in chosen:
            chosen.append(name)
        elif name:
            print(f"  (skipping unknown platform: {raw.strip()})", file=sys.stderr)
    return chosen


# --------------------------------------------------------------------------- #
# Formatting for console + files
# --------------------------------------------------------------------------- #
def platform_to_text(r):
    p = r["platform"]
    if p == "instagram":
        return f"{r['post']}\n\n[chars: {r['char_count']} | hashtags: {len(r['hashtags'])}]"
    if p == "x_twitter":
        body = "\n\n── ── ──\n\n".join(r["tweets"])
        return f"{body}\n\n[tweets: {r['tweet_count']} | total chars: {r['total_chars']}]"
    if p == "linkedin":
        return f"{r['post']}\n\n[chars: {r['char_count']}]"
    if p == "youtube":
        return (f"TITLE ({r['title_chars']} chars):\n{r['title']}\n\n"
                f"DESCRIPTION:\n{r['description']}\n\n"
                f"TAGS:\n{', '.join(r['tags'])}")
    if p == "threads":
        return f"{r['post']}\n\n[chars: {r['char_count']}]"
    if p == "tiktok":
        overlays = "\n".join(f"  • {o}" for o in r["overlay_lines"])
        return (f"CAPTION ({r['caption_chars']} chars):\n{r['caption']}\n\n"
                f"ON-SCREEN OVERLAYS:\n{overlays}")
    return json.dumps(r, indent=2)


def _box(title, text, width=66):
    inner = width - 2
    top = f"┌─ {title} " + "─" * max(0, inner - len(title) - 2) + "┐"
    lines = [top]
    for raw in text.split("\n"):
        if raw == "":
            lines.append("│" + " " * inner + "│")
            continue
        while raw:
            seg, raw = raw[:inner], raw[inner:]
            lines.append("│" + seg.ljust(inner) + "│")
    lines.append("└" + "─" * inner + "┘")
    return "\n".join(lines)


def print_console(topic, posts, prompt, do_posts, do_video):
    now = _dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    bar = "═" * 66
    print(f"\n{bar}")
    print(f"  CONTENT STUDIO — {topic.upper()}")
    print(f"  Generated: {now}")
    print(bar)

    if do_posts and posts:
        print("\n━━━ 📱 SOCIAL MEDIA POSTS ━━━\n")
        for name, r in posts.items():
            print(_box(LABELS[name], platform_to_text(r)))
            print()

    if do_video and prompt:
        print("━━━ 🎬 VIDEO PROMPT ━━━\n")
        print(_box("Paste into claude.ai", prompt))
        print()


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def run(args):
    if args.interactive:
        data = interactive_input()
        topic, audience, tone = data["topic"], data["audience"], data["tone"]
        points, stats, items = data["points"], data["stats"], data["items"]
    else:
        if not args.topic:
            raise SystemExit("--topic is required (or use --interactive).")
        topic, audience, tone = args.topic, args.audience, args.tone
        points = args.points
        stats = _parse_json_arg(args.stats, "stats")
        items = _parse_json_arg(args.items, "items")

    # Auto-generation: fill anything missing with intelligent defaults.
    if not points:
        points = autogen.auto_points(topic)
    if not stats:
        stats = autogen.auto_stats(topic)
    if not items:
        items = autogen.auto_items(topic)

    do_posts = not args.video_only
    do_video = not args.posts_only
    if args.video_only and args.posts_only:
        raise SystemExit("--video-only and --posts-only are mutually exclusive.")

    content_type = tone  # tone names map 1:1 to video content types.
    slug = slugify(topic)

    # Always build the script (it's cheap and feeds YouTube timestamps);
    # only expose the prompt when video output is wanted.
    script = build_script(topic, points, stats, items, content_type)
    prompt = build_video_prompt(script, DEFAULT_STYLE) if do_video else None

    posts = {}
    if do_posts:
        config = {
            "audience": audience,
            "content_type": content_type,
            "items": items,
            "scenes": script["scenes"],
            "twitter_mode": "thread",
        }
        for name in resolve_platforms(args.platforms):
            posts[name] = PLATFORMS[name].generate(topic, audience, tone, points, stats, config)

    # Assemble the bundle.
    bundle = {
        "meta": {
            "topic": topic,
            "slug": slug,
            "audience": audience,
            "tone": tone,
            "generated_at": _dt.datetime.now().isoformat(timespec="seconds"),
        },
        "posts": posts,
        "video": {"script": script, "prompt": prompt} if do_video else None,
    }

    if args.json:
        print(json.dumps(bundle, indent=2, ensure_ascii=False))
    else:
        print_console(topic, posts, prompt, do_posts, do_video)
        write_files(args.output, slug, posts, script, prompt, bundle, do_posts, do_video)

    return bundle


def write_files(out_dir, slug, posts, script, prompt, bundle, do_posts, do_video):
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    written = []

    if do_posts:
        for name, r in posts.items():
            path = out / f"{slug}_{name}.txt"
            path.write_text(platform_to_text(r), encoding="utf-8")
            written.append(path)

    if do_video:
        sp = out / f"{slug}_script.json"
        sp.write_text(json.dumps(script, indent=2, ensure_ascii=False), encoding="utf-8")
        written.append(sp)
        vp = out / f"{slug}_video_prompt.txt"
        vp.write_text(prompt, encoding="utf-8")
        written.append(vp)

    bp = out / f"{slug}_content_bundle.json"
    bp.write_text(json.dumps(bundle, indent=2, ensure_ascii=False), encoding="utf-8")
    written.append(bp)

    print(f"✓ Wrote {len(written)} file(s) to {out}/")
    for pth in written:
        print(f"    {pth.name}")


def main(argv=None):
    args = parse_args(argv if argv is not None else sys.argv[1:])
    run(args)


if __name__ == "__main__":
    main()
