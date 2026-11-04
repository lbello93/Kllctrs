"""Builds the `script.json` scene definition from content."""
from __future__ import annotations

from util import slugify, chunk
from video.templates import (
    get_scene_plan,
    split_hook,
    stats_to_counters,
    items_to_cheatsheet,
)


def build_script(topic, key_points, stats, items, content_type="educational") -> dict:
    """Assemble the scene list for a content type into script.json form."""
    plan = get_scene_plan(content_type)
    key_points = key_points or []
    scenes = []

    # Key points after the first (used by the hook) are spread across explainers.
    bullet_pool = key_points[1:] if len(key_points) > 1 else key_points
    n_explainers = sum(1 for t, _ in plan if t == "explainer")
    bullet_chunks = chunk(bullet_pool, n_explainers) if n_explainers else []

    explainer_i = 0
    for stype, dur in plan:
        if stype == "hook":
            line1, line2, subtitle = split_hook(key_points, topic)
            scenes.append({
                "type": "hook", "duration": dur,
                "line1": line1, "line2": line2, "subtitle": subtitle,
            })
        elif stype == "explainer":
            these = bullet_chunks[explainer_i] if explainer_i < len(bullet_chunks) else bullet_pool[:3]
            explainer_i += 1
            badge = "HOW IT WORKS" if explainer_i == 1 else "GOING DEEPER"
            headline = topic if explainer_i == 1 else f"{topic}, in practice"
            lines = (these[:4] or [f"The fundamentals of {topic}"])
            scenes.append({
                "type": "explainer", "duration": dur,
                "badge": badge, "headline": headline, "lines": lines,
            })
        elif stype == "stats":
            scenes.append({
                "type": "stats", "duration": dur,
                "title": "BY THE NUMBERS",
                "stats": stats_to_counters(stats),
            })
        elif stype == "cheatsheet":
            scenes.append({
                "type": "cheatsheet", "duration": dur,
                "title": f"{str(topic).upper()} CHEAT SHEET",
                "items": items_to_cheatsheet(items),
                "footer": f"Save • Follow for more on {topic}",
            })
        elif stype == "diagram":
            scenes.append({
                "type": "diagram", "duration": dur,
                "title": f"{str(topic).upper()} — HOW IT CONNECTS",
                "caption": key_points[0] if key_points else str(topic),
            })

    return {"name": slugify(topic), "scenes": scenes}
