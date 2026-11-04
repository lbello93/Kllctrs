"""TikTok caption + on-screen overlay generator."""
from __future__ import annotations

from content.hooks import generate_hooks
from content.hashtags import generate_hashtags
from video.templates import split_hook
from util import truncate

CAPTION_LIMIT = 150
OVERLAY_LIMIT = 40
MAX_OVERLAYS = 5
MIN_OVERLAYS = 3


def generate(topic, audience, tone, key_points, stats, config):
    config = config or {}
    key_points = key_points or []

    # Trending-first hashtags, capped at 5.
    topic_tags = generate_hashtags(topic, "tiktok", 3)
    tags = (["#fyp", "#foryou"] + topic_tags)[:5]
    tag_str = " ".join(tags)

    hook = generate_hooks(topic, tone, 1)[0]
    room = CAPTION_LIMIT - len(tag_str) - 1
    caption_core = truncate(hook, max(1, room))
    caption = f"{caption_core} {tag_str}".strip()
    if len(caption) > CAPTION_LIMIT:
        caption = truncate(caption, CAPTION_LIMIT)

    # On-screen overlays: topic title + first few key points, each phone-readable.
    line1, line2, _ = split_hook(key_points, topic)
    overlays = [truncate(line1, OVERLAY_LIMIT)]
    if line2 and line2 != line1:
        overlays.append(truncate(line2, OVERLAY_LIMIT))
    for p in key_points[:MAX_OVERLAYS]:
        overlays.append(truncate(p, OVERLAY_LIMIT))

    # De-dupe, drop empties, clamp to 3-5 lines.
    seen, clean = set(), []
    for o in overlays:
        if o and o not in seen:
            seen.add(o)
            clean.append(o)
    while len(clean) < MIN_OVERLAYS:
        clean.append(truncate(f"{topic} explained", OVERLAY_LIMIT))
    overlays = clean[:MAX_OVERLAYS]

    return {
        "platform": "tiktok",
        "caption": caption,
        "overlay_lines": overlays,
        "caption_chars": len(caption),
    }
