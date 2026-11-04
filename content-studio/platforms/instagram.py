"""Instagram caption + hashtag generator."""
from __future__ import annotations

from content.hooks import generate_hooks
from content.hashtags import generate_hashtags
from content.tone import get_cta, get_emoji
from util import fmt_number, truncate

MAX_CHARS = 2200
PREVIEW_CUTOFF = 125


def _stat_phrase(stats):
    bits = []
    for s in stats[:3]:
        unit = f" {s['unit']}" if s.get("unit") else ""
        bits.append(f"{fmt_number(s['value'])}{unit} {str(s['label']).lower()}")
    return "📊 " + "  ·  ".join(bits)


def generate(topic, audience, tone, key_points, stats, config):
    config = config or {}
    hook = f"{generate_hooks(topic, tone, 1)[0]} {get_emoji(tone, 1)}".strip()

    body_lines = [f"→ {p}" for p in (key_points or [])[:5]]
    cta = get_cta(tone)
    hashtags = generate_hashtags(topic, "instagram", 25)

    parts = [hook, ""]
    parts += body_lines
    if stats:
        parts += ["", _stat_phrase(stats)]
    parts += ["", cta, "", " ".join(hashtags)]

    post = "\n".join(parts)
    if len(post) > MAX_CHARS:
        post = truncate(post, MAX_CHARS)

    return {
        "platform": "instagram",
        "post": post,
        "hashtags": hashtags,
        "char_count": len(post),
        "hook_preview": post[:PREVIEW_CUTOFF],
    }
