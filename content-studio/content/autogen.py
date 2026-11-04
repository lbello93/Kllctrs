"""Auto-generation of sensible defaults when the user supplies no content.

All output is real, topic-derived text (no lorem ipsum): six key points that
cover the standard explainer arc, three placeholder-but-realistic stats, and a
three-step beginner → intermediate → advanced cheatsheet.
"""
from __future__ import annotations


def auto_points(topic: str):
    t = (topic or "this topic").strip()
    return [
        f"What {t} really is — and what it isn't",
        f"How {t} actually works under the hood",
        f"The biggest real-world benefits of {t} right now",
        f"The most common misconceptions about {t}",
        f"How to get started with {t} today",
        f"Where {t} is heading over the next few years",
    ]


def auto_stats(topic: str):
    # Generic but plausible ranges; the user should replace with real figures.
    return [
        {"label": "Adoption", "value": 68, "unit": "%"},
        {"label": "Year-over-year growth", "value": 3, "unit": "x"},
        {"label": "Time saved", "value": 40, "unit": "%"},
    ]


def auto_items(topic: str):
    t = (topic or "the basics").strip()
    return [
        {"icon": "01", "name": "Start", "desc": f"the beginner basics of {t}"},
        {"icon": "02", "name": "Build", "desc": "the core intermediate workflow"},
        {"icon": "03", "name": "Scale", "desc": "advanced techniques that compound"},
    ]
