"""Smart, platform-aware hashtag engine.

Strategy per the spec: ~30% broad / 40% mid / 30% niche. Multi-word niche tags
use camelCase for readability; everything is stripped to alphanumerics (no
spaces, no special characters) and de-duplicated case-insensitively.
"""
from __future__ import annotations

import re

from util import camel

# Broad, high-volume tags that work for almost any topic.
_GENERIC_BROAD = [
    "technology", "innovation", "trending", "future",
    "tips", "learn", "education", "explained",
]
# Suffixes that turn a topic into a mid-volume tag.
_MID_SUFFIX = [
    "technology", "explained", "tips", "guide",
    "basics", "trends", "insights", "101",
]
# Suffixes for long-tail / niche tags.
_NICHE_SUFFIX = [
    "mapping", "hacks", "deepdive", "breakdown",
    "forbeginners", "community", "enthusiast", "madeeasy",
]

# Default per-platform counts.
_COUNTS = {
    "instagram": 25,
    "linkedin": 4,
    "youtube": 10,
    "threads": 0,
    "tiktok": 5,
    "x": 0,
    "x_twitter": 0,
    "twitter": 0,
}


def _tokens(topic: str):
    return [w for w in re.split(r"[^A-Za-z0-9]+", (topic or "").lower()) if len(w) > 1]


def _clean(tag: str) -> str:
    return re.sub(r"[^A-Za-z0-9]", "", tag)


def generate_hashtags(topic: str, platform: str = "instagram", count=None):
    """Return a list of `#hashtags` tuned for `platform`."""
    platform = (platform or "instagram").lower()
    if count is None:
        count = _COUNTS.get(platform, 15)
    if count <= 0:
        return []

    tokens = _tokens(topic) or ["topic"]
    base = "".join(tokens)
    first = tokens[0]
    camel_base = camel(tokens)

    n_broad = max(1, round(count * 0.3))
    n_mid = max(1, round(count * 0.4))

    broad = [first] + _GENERIC_BROAD
    mid = []
    for s in _MID_SUFFIX:
        mid.append(base + s)
        if first != base:
            mid.append(first + s)
    niche = []
    for s in _NICHE_SUFFIX:
        niche.append(camel_base + s[:1].upper() + s[1:])
        niche.append(base + s)

    # Priority order: the broad/mid/niche quotas first, then fill from leftovers.
    ordered = (
        broad[:n_broad]
        + mid[:n_mid]
        + niche
        + mid[n_mid:]
        + broad[n_broad:]
    )

    seen = set()
    out = []
    for t in ordered:
        c = _clean(t)
        if not c:
            continue
        key = c.lower()
        if key in seen:
            continue
        seen.add(key)
        out.append("#" + c)
        if len(out) >= count:
            break
    return out
