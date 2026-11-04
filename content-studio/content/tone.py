"""Tone adapters.

Each tone profile carries CTAs, a comment-driving closer question, an emoji
palette, and an emoji density. `adapt_tone` applies the light touches that make a
line read native to the tone; platform modules pull CTAs/closers/emoji directly.
"""
from __future__ import annotations

TONE_PROFILES = {
    "educational": {
        "ctas": ["Save this for later 📌", "Follow for more breakdowns", "Share this with someone learning"],
        "closer": "What would you add to this?",
        "emoji": ["📚", "🧠", "💡", "🔍", "✅"],
        "density": 0.3,
        "voice": "clear, factual, how-it-works framing, stat-heavy",
    },
    "promotional": {
        "ctas": ["Try it today →", "Don't miss out", "Get started now"],
        "closer": "Ready to see it in action?",
        "emoji": ["🚀", "🔥", "✨", "⚡", "🎯"],
        "density": 0.6,
        "voice": "benefit-focused, urgency, social proof, CTA-heavy",
    },
    "trending": {
        "ctas": ["Agree or disagree?", "Bookmark before this blows up", "Follow so you don't miss the next one"],
        "closer": "Where do you stand on this?",
        "emoji": ["🔥", "👀", "🤯", "💯", "🚨"],
        "density": 0.6,
        "voice": "opinion-driven, controversial hooks, meme-aware",
    },
    "storytelling": {
        "ctas": ["Follow for the rest of the story", "Save this if it resonates", "Tag someone who needs this"],
        "closer": "Has this ever happened to you?",
        "emoji": ["✨", "🙌", "💭", "🌱", "❤️"],
        "density": 0.3,
        "voice": "first-person, narrative arc, emotional beats",
    },
    "tutorial": {
        "ctas": ["Save this as a reference 🔖", "Follow for more how-tos", "Share with your team"],
        "closer": "Which step trips you up most?",
        "emoji": ["🛠️", "✅", "📝", "⚙️", "👇"],
        "density": 0.4,
        "voice": "step-by-step, imperative, practical",
    },
    "engagement": {
        "ctas": ["Drop your take below 👇", "Vote in the comments", "Follow for more"],
        "closer": "What's your pick?",
        "emoji": ["👇", "🔥", "💬", "🤔", "👀"],
        "density": 0.5,
        "voice": "question-led, playful, reply-baiting",
    },
}

_DEFAULT = "educational"


def get_profile(tone: str) -> dict:
    return TONE_PROFILES.get(tone, TONE_PROFILES[_DEFAULT])


def get_cta(tone: str, i: int = 0) -> str:
    ctas = get_profile(tone)["ctas"]
    return ctas[i % len(ctas)]


def get_closer(tone: str) -> str:
    return get_profile(tone)["closer"]


def get_emoji(tone: str, n: int = 1) -> str:
    emoji = get_profile(tone)["emoji"]
    return "".join(emoji[i % len(emoji)] for i in range(max(0, n)))


def adapt_tone(text: str, target_tone: str) -> str:
    """Normalize whitespace and, for high-energy tones, lead with an emoji."""
    profile = get_profile(target_tone)
    text = " ".join((text or "").split())
    if text and profile["density"] >= 0.5 and text[0] not in profile["emoji"]:
        text = f"{profile['emoji'][0]} {text}"
    return text
