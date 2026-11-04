"""YouTube title + description generator."""
from __future__ import annotations

from content.hashtags import generate_hashtags
from video.templates import get_scene_plan
from util import fmt_number, truncate

TITLE_LIMIT = 60

_TITLE_FORMS = {
    "educational": "{t}: What Nobody Tells You",
    "promotional": "{t} — The Upgrade You Didn't Expect",
    "trending": "Why Everyone's Talking About {t}",
    "storytelling": "How {t} Changed Everything for Me",
    "tutorial": "{t} Explained in 5 Simple Steps",
}

_SCENE_LABELS = {
    "hook": "Intro",
    "explainer": "How it works",
    "stats": "By the numbers",
    "cheatsheet": "Cheat sheet",
    "diagram": "How it connects",
}


def _timestamp(seconds: int) -> str:
    m, s = divmod(int(seconds), 60)
    return f"{m}:{s:02d}"


def _make_title(topic, tone):
    title = _TITLE_FORMS.get(tone, _TITLE_FORMS["educational"]).format(t=topic)
    if len(title) > TITLE_LIMIT:
        # Fall back to the barest keyword-rich form, then hard-trim.
        title = f"{topic}: Explained"
        if len(title) > TITLE_LIMIT:
            title = truncate(topic, TITLE_LIMIT)
    return title


def generate(topic, audience, tone, key_points, stats, config):
    config = config or {}
    title = _make_title(topic, tone)

    lines = [
        f"{topic} explained — a quick, visual breakdown of what it is, "
        f"how it works, and why it matters.",
        "",
        "🔑 KEY POINTS",
    ]
    for p in (key_points or [])[:6]:
        lines.append(f"• {p}")

    if stats:
        lines += ["", "📊 STATS"]
        for s in stats[:5]:
            unit = f" {s['unit']}" if s.get("unit") else ""
            lines.append(f"• {s['label']}: {fmt_number(s['value'])}{unit}")

    # Timestamps from the actual scene plan (or the content-type default).
    scenes = config.get("scenes")
    if scenes:
        plan = [(s.get("type"), s.get("duration", 0)) for s in scenes]
    else:
        plan = get_scene_plan(config.get("content_type", tone))
    lines += ["", "⏱️ TIMESTAMPS"]
    elapsed = 0
    for stype, dur in plan:
        lines.append(f"{_timestamp(elapsed)} {_SCENE_LABELS.get(stype, str(stype).title())}")
        elapsed += dur

    lines += ["", "🔔 Subscribe for more breakdowns like this.", ""]

    tags = generate_hashtags(topic, "youtube", 10)
    lines.append(" ".join(tags))

    description = "\n".join(lines)
    return {
        "platform": "youtube",
        "title": title,
        "description": description,
        "tags": [t.lstrip("#") for t in tags],
        "title_chars": len(title),
    }
