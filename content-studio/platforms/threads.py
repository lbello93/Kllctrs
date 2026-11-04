"""Threads post generator — conversational, no hashtags, under 500 chars."""
from __future__ import annotations

from content.hooks import generate_hooks
from util import truncate

MAX_CHARS = 500


def _assemble(hook, points, question):
    body = "\n".join(f"– {p}" for p in points)
    return "\n\n".join(x for x in [hook, body, question] if x)


def generate(topic, audience, tone, key_points, stats, config):
    config = config or {}
    hook = generate_hooks(topic, tone, 1)[0]
    question = f"Curious how you'd use {topic}?"
    points = list((key_points or [])[:3])

    post = _assemble(hook, points, question)
    # Drop points until it fits, then hard-trim as a last resort.
    while len(post) > MAX_CHARS and points:
        points.pop()
        post = _assemble(hook, points, question)
    if len(post) > MAX_CHARS:
        post = truncate(post, MAX_CHARS)

    return {
        "platform": "threads",
        "post": post,
        "char_count": len(post),
    }
