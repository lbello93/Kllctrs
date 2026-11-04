"""Builds the self-contained Claude web video prompt.

Reads `templates/video_prompt.md`, injects the script.json and style tokens, and
returns a single string that can be pasted into a fresh claude.ai chat to make
Claude generate the rendering pipeline and produce the MP4.
"""
from __future__ import annotations

import json
from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent
_TEMPLATE = _ROOT / "templates" / "video_prompt.md"

DEFAULT_STYLE = {
    "width": 1080,
    "height": 1920,
    "fps": 30,
    "bg": "#080a0f",
    "accent": "#b4ff00",
    "font": "Inter",
}


def build_video_prompt(script_json: dict, style_config=None) -> str:
    style = {**DEFAULT_STYLE, **(style_config or {})}
    template = _TEMPLATE.read_text(encoding="utf-8")

    script_block = json.dumps(script_json, indent=2, ensure_ascii=False)
    replacements = {
        "{{SCRIPT_JSON}}": script_block,
        "{{WIDTH}}": str(style["width"]),
        "{{HEIGHT}}": str(style["height"]),
        "{{FPS}}": str(style["fps"]),
        "{{BG}}": str(style["bg"]),
        "{{ACCENT}}": str(style["accent"]),
        "{{FONT}}": str(style["font"]),
        "{{NAME}}": str(script_json.get("name", "video")),
    }
    out = template
    for token, value in replacements.items():
        out = out.replace(token, value)
    return out
