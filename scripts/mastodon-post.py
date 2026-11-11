#!/usr/bin/env python3
"""Postaa julkaistut, vielä postaamattomat artikkelit Mastodoniin.

Artikkeli postataan, kun kaikki pätee:
  - `draft` ei ole true
  - `date` on mennyt (aikavyöhyke Europe/Helsinki, jos päivämäärässä ei ole omaa)
  - `date` on rajapäivän (MASTODON_SINCE) jälkeen, ettei vanhoja postata
  - front matterissa ei ole riviä `mastodon_post_id:` (arvo `false` ohittaa artikkelin)

Mukana ovat artikkelit (content/{vuosi}/{slug}/) ja reseptit (content/resepti/{slug}/).
Postaus on alkulause, otsikko, kuvaus, linkki ja avainsanat hashtageina. Tyhjät osat jätetään pois.

Postauksen tunnus kirjoitetaan artikkelin front matteriin. Muutoksen commitoi workflow.

Ympäristömuuttujat:
  MASTODON_INSTANCE   esim. https://kaartinen.social
  MASTODON_ACCOUNT    tilin tunnus ilman @-merkkiä, esim. marko
  MASTODON_TOKEN      pääsytunnus, jolla on write:statuses-oikeus
  MASTODON_SINCE      rajapäivä, esim. 2026-11-09
  SITE_URL            sivuston osoite, esim. https://markokaartinen.net
  DRY_RUN=1           ei verkkoyhteyksiä eikä tiedostomuutoksia, vain listaus
  GITHUB_OUTPUT       (GitHub Actions) tänne kirjoitetaan posted=true|false
"""
import hashlib
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
TZ = ZoneInfo("Europe/Helsinki")

INSTANCE = os.environ.get("MASTODON_INSTANCE", "https://kaartinen.social").rstrip("/")
ACCOUNT = os.environ.get("MASTODON_ACCOUNT", "marko")
TOKEN = os.environ.get("MASTODON_TOKEN", "")
SINCE = os.environ.get("MASTODON_SINCE", "2026-11-09")
SITE_URL = os.environ.get("SITE_URL", "https://markokaartinen.net").rstrip("/")
DRY_RUN = os.environ.get("DRY_RUN") == "1"

ID_LINE = re.compile(r"^mastodon_post_id:", re.M)
ID_COMMENTED = re.compile(r"^#\s*mastodon_post_id:.*$", re.M)


def field(front, name):
    m = re.search(rf"^{name}:\s*(.*?)\s*$", front, re.M)
    if not m:
        return None
    return m.group(1).strip().strip("\"'")


def parse(path):
    """Palauttaa (front matter, runko) tai None, jos tiedostossa ei ole --- -front matteria."""
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not m:
        return None
    return text, m.group(1)


def tag_list(front, name):
    """Lukee avainsanalistan, joka on joko `name: ["a", "b"]` tai rivi kerrallaan `- a`."""
    m = re.search(rf"^{name}:[ \t]*(.*)$", front, re.M)
    if not m:
        return []
    rest = m.group(1).strip()
    if rest.startswith("["):
        return [t.strip().strip("\"'") for t in rest.strip("[]").split(",") if t.strip()]
    tags = []
    for line in front[m.end():].lstrip("\n").splitlines():
        item = re.match(r"\s*-\s+(.*?)\s*$", line)
        if not item:
            break
        tags.append(item.group(1).strip("\"'"))
    return tags


def hashtag(tag):
    return "#" + re.sub(r"[^\wäöåÄÖÅ]", "", tag)


def message(kind, title, description, url, tags):
    intro = {
        "artikkeli": "Blogiini on ilmestynyt uusi juttu!",
        "resepti": "Blogiini on ilmestynyt uusi resepti!",
    }[kind]
    parts = [intro, title]
    if description:
        parts.append(description)
    parts.append(url)
    hashtags = [hashtag(t) for t in tags if hashtag(t) != "#"]
    if hashtags:
        parts.append(" ".join(hashtags))
    return "\n\n".join(parts)


def parse_date(value):
    d = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return d if d.tzinfo else d.replace(tzinfo=TZ)


def candidates():
    since = parse_date(SINCE)
    now = datetime.now(TZ)
    paths = sorted((ROOT / "content").glob("[0-9][0-9][0-9][0-9]/*/index.md"))
    paths += sorted((ROOT / "content" / "resepti").glob("*/index.md"))
    for path in paths:
        parsed = parse(path)
        if not parsed:
            continue
        _, front = parsed
        if field(front, "draft") == "true" or ID_LINE.search(front):
            continue
        date = field(front, "date")
        if not date:
            continue
        date = parse_date(date)
        if date > now or date < since:
            continue
        section = path.parent.parent.name
        slug = field(front, "slug") or path.parent.name
        recipe = section == "resepti"
        url = f"{SITE_URL}/{section}/{slug}"
        title = field(front, "title") or slug
        tags = tag_list(front, "recipe_tags" if recipe else "tags")
        yield {
            "path": path,
            "title": title,
            "url": url,
            "text": message("resepti" if recipe else "artikkeli", title, field(front, "description"), url, tags),
        }


def api(method, path, data=None, headers=None):
    req = urllib.request.Request(
        INSTANCE + path,
        data=urllib.parse.urlencode(data).encode() if data else None,
        method=method,
        headers={"Authorization": f"Bearer {TOKEN}", "User-Agent": "markokaartinen-net-julkaisu", **(headers or {})},
    )
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.load(res)


def existing_posts():
    """Tilin viimeisimmät postaukset, jotta jo postattua linkkiä ei postata uudelleen."""
    account = api("GET", "/api/v1/accounts/lookup?" + urllib.parse.urlencode({"acct": ACCOUNT}))
    statuses = api("GET", f"/api/v1/accounts/{account['id']}/statuses?exclude_replies=true&limit=40")
    return statuses


def find_existing(statuses, url):
    for s in statuses:
        card = s.get("card") or {}
        if card.get("url") == url or url in (s.get("content") or ""):
            return s["id"]
    return None


def write_id(path, status_id):
    text = path.read_text(encoding="utf-8")
    line = f'mastodon_post_id: "{status_id}"'
    if ID_COMMENTED.search(text):
        text = ID_COMMENTED.sub(line, text, count=1)
    else:
        text = re.sub(r"\n---\n", f"\n{line}\n---\n", text, count=1)
    path.write_text(text, encoding="utf-8")


def main():
    items = list(candidates())
    if not items:
        print("Ei postattavia artikkeleita.")
        return 0

    for i in items:
        print(f"Postattava: {i['url']} ({i['path'].relative_to(ROOT)})")
    if DRY_RUN:
        return 0
    if not TOKEN:
        print("MASTODON_TOKEN puuttuu.", file=sys.stderr)
        return 1

    statuses = existing_posts()
    posted = 0
    for i in items:
        status_id = find_existing(statuses, i["url"])
        if status_id:
            print(f"Löytyi jo tililtä: {i['url']} -> {status_id}")
        else:
            key = hashlib.sha256(i["url"].encode()).hexdigest()
            result = api(
                "POST",
                "/api/v1/statuses",
                {"status": i["text"], "visibility": "public", "language": "fi"},
                {"Idempotency-Key": key},
            )
            status_id = result["id"]
            print(f"Postattu: {i['url']} -> {status_id}")
        write_id(i["path"], status_id)
        posted += 1

    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a") as f:
            f.write(f"posted={'true' if posted else 'false'}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
