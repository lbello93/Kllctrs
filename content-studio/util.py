"""Small shared helpers (stdlib only)."""
from __future__ import annotations

import re


def slugify(text: str) -> str:
    """Lowercase, underscore-separated slug safe for filenames."""
    text = (text or "video").lower()
    text = re.sub(r"[^a-z0-9]+", "_", text).strip("_")
    return text or "video"


def fmt_number(value) -> str:
    """Human-format a number: commas for thousands, trimmed decimals.

    1200000 -> "1,200,000"   2.0 -> "2"   2.5 -> "2.5"   300 -> "300"
    Non-numeric values are returned as-is (stringified).
    """
    try:
        f = float(value)
    except (TypeError, ValueError):
        return str(value)
    if f == int(f):
        return f"{int(f):,}"
    s = f"{f:,.2f}".rstrip("0").rstrip(".")
    return s


def camel(words) -> str:
    """["lidar","mapping"] -> "lidarMapping" (camelCase, no spaces)."""
    words = [w for w in words if w]
    if not words:
        return ""
    return words[0].lower() + "".join(w.capitalize() for w in words[1:])


def truncate(text: str, limit: int, ellipsis: str = "…") -> str:
    """Hard-trim `text` to `limit` chars, adding an ellipsis when cut."""
    text = text or ""
    if len(text) <= limit:
        return text
    if limit <= len(ellipsis):
        return text[:limit]
    return text[: limit - len(ellipsis)].rstrip() + ellipsis


def chunk(seq, n):
    """Split a list into `n` roughly-equal, order-preserving chunks."""
    seq = list(seq)
    if n <= 0:
        return []
    k, m = divmod(len(seq), n)
    out = []
    i = 0
    for j in range(n):
        size = k + (1 if j < m else 0)
        out.append(seq[i : i + size])
        i += size
    return out
