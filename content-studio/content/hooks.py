"""Hook / opener generators, keyed by content tone.

A "hook" is the first line that has to stop the scroll. Each tone has a bank of
templates with a single `{t}` slot for the topic.
"""
from __future__ import annotations

_HOOKS = {
    "educational": [
        "Did you know? {t} isn't what most people think.",
        "Most people don't realize how {t} actually works.",
        "Here's what {t} actually means — in plain English.",
        "{t}, explained like you're five.",
        "The truth about {t} nobody tells you.",
        "Everything you got wrong about {t}.",
    ],
    "promotional": [
        "Introducing a smarter way to think about {t}.",
        "We just changed the game for {t}.",
        "This changes everything about {t}.",
        "{t} just got a serious upgrade.",
        "Stop settling — {t} can do so much more.",
        "The {t} breakthrough you've been waiting for.",
    ],
    "trending": [
        "Everyone's talking about {t}. Here's why.",
        "Hot take: {t} matters more than you think.",
        "Unpopular opinion: {t} is mostly misunderstood.",
        "{t} is blowing up right now — don't get left behind.",
        "Why is nobody talking about THIS side of {t}?",
        "{t} broke my brain this week.",
    ],
    "storytelling": [
        "3 years ago I knew nothing about {t}.",
        "The moment I finally understood {t}.",
        "Nobody told me the truth about {t}.",
        "I spent months learning {t} so you don't have to.",
        "Here's the {t} lesson I learned the hard way.",
        "This is the {t} story I wish I'd heard sooner.",
    ],
    "tutorial": [
        "How to understand {t} in 5 simple steps.",
        "Stop overcomplicating {t} — do this instead.",
        "The {t} trick nobody teaches you.",
        "Master {t} faster with this one framework.",
        "{t} in 60 seconds — the no-fluff guide.",
        "Everything you need to start with {t} today.",
    ],
    "engagement": [
        "Which {t} take do you agree with?",
        "Rate your {t} knowledge 1-10.",
        "{t}: genius or overrated? Wrong answers only.",
        "Be honest — how well do you really know {t}?",
        "Drop a 🔥 if {t} changed how you work.",
        "What's your hottest {t} opinion?",
    ],
}


def generate_hooks(topic: str, tone: str = "educational", count: int = 5):
    """Return `count` hook lines for the topic in the given tone."""
    topic = (topic or "this").strip()
    templates = _HOOKS.get(tone, _HOOKS["educational"])
    hooks = [t.format(t=topic) for t in templates]
    if count <= len(hooks):
        return hooks[:count]
    out = list(hooks)
    i = 0
    while len(out) < count:
        out.append(hooks[i % len(hooks)])
        i += 1
    return out
