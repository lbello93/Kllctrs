"""X / Twitter thread (or single-tweet) generator."""
from __future__ import annotations

from content.hooks import generate_hooks
from util import fmt_number, truncate

TWEET_LIMIT = 280
MAX_TWEETS = 10
MIN_TWEETS = 5


def _single(topic, tone, key_points):
    hook = generate_hooks(topic, tone, 1)[0]
    point = (key_points or [""])[0]
    tweet = truncate(f"{hook} {point}".strip(), TWEET_LIMIT)
    return {
        "platform": "x_twitter",
        "tweets": [tweet],
        "tweet_count": 1,
        "total_chars": len(tweet),
    }


def generate(topic, audience, tone, key_points, stats, config):
    config = config or {}
    if config.get("twitter_mode") == "single":
        return _single(topic, tone, key_points)

    key_points = key_points or []
    tweets = []

    # Tweet 1 — hook.
    hook = generate_hooks(topic, tone, 1)[0]
    tweets.append(truncate(f"{hook} A thread 🧵👇", TWEET_LIMIT))

    # Numbered point tweets (leave room for a stats tweet + final CTA).
    room_for_points = MAX_TWEETS - 1 - (1 if stats else 0) - 1
    points = key_points[: max(0, min(7, room_for_points))]
    for i, p in enumerate(points, start=1):
        tweets.append(truncate(f"{i}/ {p}", TWEET_LIMIT))

    # Stats tweet.
    if stats:
        lines = ["📊 By the numbers:"]
        for s in stats[:4]:
            unit = f" {s['unit']}" if s.get("unit") else ""
            lines.append(f"• {s['label']}: {fmt_number(s['value'])}{unit}")
        tweets.append(truncate("\n".join(lines), TWEET_LIMIT))

    # Pad to the minimum with a "why it matters" tweet if the thread is thin.
    if len(tweets) < MIN_TWEETS - 1:
        tweets.append(truncate(
            f"Why it matters: {topic} is moving fast, and understanding it early pays off.",
            TWEET_LIMIT,
        ))

    # Final engagement CTA.
    tweets.append(truncate(
        f"Found this useful? ♻️ Repost the first tweet to share it, and follow for more on {topic}.",
        TWEET_LIMIT,
    ))

    tweets = tweets[:MAX_TWEETS]
    return {
        "platform": "x_twitter",
        "tweets": tweets,
        "tweet_count": len(tweets),
        "total_chars": sum(len(t) for t in tweets),
    }
