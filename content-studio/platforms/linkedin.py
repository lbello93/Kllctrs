"""LinkedIn post generator — professional tone, minimal emoji."""
from __future__ import annotations

from content.hashtags import generate_hashtags
from util import fmt_number, truncate

MAX_CHARS = 3000

_OPENINGS = {
    "educational": "I've been digging into {t} lately. Here's what actually matters:",
    "promotional": "We've been working on {t}, and the results are worth sharing:",
    "trending": "Everyone's discussing {t} right now. Here's my honest read:",
    "storytelling": "A few years ago, {t} completely changed how I work. Here's what I learned:",
    "tutorial": "If you're getting started with {t}, here's the short version:",
}


def generate(topic, audience, tone, key_points, stats, config):
    config = config or {}
    opening = _OPENINGS.get(tone, _OPENINGS["educational"]).format(t=topic)

    bullets = [f"• {p}" for p in (key_points or [])[:5]]

    stats_block = []
    if stats:
        stats_block = ["", "The numbers that stood out:"]
        for s in stats[:4]:
            unit = f" {s['unit']}" if s.get("unit") else ""
            stats_block.append(f"→ {s['label']}: {fmt_number(s['value'])}{unit}")

    closing = f"How are you thinking about {topic} in your own work?"
    hashtags = generate_hashtags(topic, "linkedin", 4)

    parts = [opening, ""] + bullets + stats_block + ["", closing, "", " ".join(hashtags)]
    post = "\n".join(parts)
    if len(post) > MAX_CHARS:
        post = truncate(post, MAX_CHARS)

    preview_lines = [ln for ln in post.split("\n") if ln.strip()][:2]
    return {
        "platform": "linkedin",
        "post": post,
        "char_count": len(post),
        "preview_lines": preview_lines,
    }
