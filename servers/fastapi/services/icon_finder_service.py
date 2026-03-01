import asyncio
import json
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class _Icon:
    name: str
    text: str


class IconFinderService:
    """
    Lightweight icon search that avoids heavy vector DB dependencies.

    It searches through `assets/icons.json` and returns the best matching *bold* icons.
    """

    def __init__(self):
        icons_path = Path("assets/icons.json")
        with icons_path.open("r", encoding="utf-8") as f:
            payload = json.load(f)

        icons: list[_Icon] = []
        for each in payload.get("icons", []):
            name = str(each.get("name", "")).strip()
            if not name or not name.endswith("-bold"):
                continue
            tags = each.get("tags", "")
            text = f"{name} {tags}".lower()
            icons.append(_Icon(name=name, text=text))

        self._icons = icons

    @staticmethod
    def _tokenize(query: str) -> list[str]:
        q = (query or "").lower()
        # keep letters/numbers and split on the rest
        tokens = re.split(r"[^a-z0-9]+", q)
        return [t for t in tokens if t]

    def _search_sync(self, query: str, k: int) -> list[str]:
        tokens = self._tokenize(query)
        if not tokens:
            return [f"/static/icons/bold/{each.name}.svg" for each in self._icons[:k]]

        scored: list[tuple[int, str]] = []
        for icon in self._icons:
            score = 0
            for t in tokens:
                if t in icon.text:
                    score += 1
            if score > 0:
                scored.append((score, icon.name))

        scored.sort(key=lambda x: x[0], reverse=True)
        names = [name for _, name in scored[:k]]

        if not names:
            # fallback: deterministic default
            names = [each.name for each in self._icons[:k]]

        return [f"/static/icons/bold/{each}.svg" for each in names]

    async def search_icons(self, query: str, k: int = 1):
        k = max(1, int(k or 1))
        return await asyncio.to_thread(self._search_sync, query, k)


ICON_FINDER_SERVICE = IconFinderService()
