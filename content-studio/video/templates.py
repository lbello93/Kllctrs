"""Scene plans per content type, plus the mappers that turn raw content
(key points, stats, items) into the per-scene fields of script.json.
"""
from __future__ import annotations

from util import fmt_number

# (scene type, duration seconds) — totals match the spec (19s / 14s).
SCENE_PLANS = {
    "educational": [("hook", 4), ("explainer", 5), ("stats", 5), ("cheatsheet", 5)],
    "promotional": [("hook", 4), ("explainer", 5), ("stats", 5), ("cheatsheet", 5)],
    "trending": [("hook", 4), ("explainer", 5), ("cheatsheet", 5)],
    "storytelling": [("hook", 4), ("explainer", 5), ("diagram", 5), ("cheatsheet", 5)],
    "tutorial": [("hook", 4), ("explainer", 5), ("explainer", 5), ("cheatsheet", 5)],
}


def get_scene_plan(content_type: str):
    return SCENE_PLANS.get(content_type, SCENE_PLANS["educational"])


def total_duration(content_type: str) -> int:
    return sum(d for _, d in get_scene_plan(content_type))


def split_hook(key_points, topic: str):
    """First key point becomes the two-line hook, split near the midpoint."""
    first = (key_points[0] if key_points else topic) or topic
    words = first.split()
    if len(words) >= 2:
        mid = len(words) // 2
        line1 = " ".join(words[:mid]).upper()
        line2 = " ".join(words[mid:]).upper()
    else:
        line1 = (topic or "").upper()
        line2 = first.upper()
    subtitle = key_points[1] if len(key_points) > 1 else f"Everything you need to know about {topic}"
    return line1, line2, subtitle


def stats_to_counters(stats):
    """Normalize stats to {label, value (numeric), unit, display}."""
    out = []
    for s in stats or []:
        value = s.get("value", 0)
        try:
            num = float(value)
            num = int(num) if num == int(num) else num
        except (TypeError, ValueError):
            num = value
        out.append({
            "label": str(s.get("label", "")).strip(),
            "value": num,
            "unit": str(s.get("unit", "")).strip(),
            "display": fmt_number(value),
        })
    return out


def items_to_cheatsheet(items):
    """Normalize cheatsheet items to {icon, name, desc}."""
    out = []
    for it in items or []:
        out.append({
            "icon": str(it.get("icon", "•")).strip() or "•",
            "name": str(it.get("name", "")).strip(),
            "desc": str(it.get("desc", "")).strip(),
        })
    return out
