#!/usr/bin/env python3
"""Kertoo ajastetulle ajolle, onko jotain julkaistavaa. Kevyt tarkistus, ei Hugo-koontia.

Tulostaa GitHub Actionsin outputteihin:
  julkaise=true   artikkeli on julkaistavissa (ei luonnos, `date` mennyt), mutta sen osoite puuttuu
                  livenä olevasta sivukartasta -> sivu pitää rakentaa ja viedä
  mastodon=true   artikkeli odottaa Mastodon-postausta (ks. scripts/mastodon-post.py)
  tarvitaan=true  jompikumpi yllä

Ympäristömuuttujat: SITE_URL, MASTODON_SINCE (kuten mastodon-post.py), SITEMAP (valinnainen:
tiedostopolku testausta varten, oletuksena $SITE_URL/sitemap.xml).
"""
import importlib.util
import os
import re
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("mastodon_post", HERE / "mastodon-post.py")
mp = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mp)


def read(location):
    """Lukee sivukartan: osoite verkosta tai (testaus) tiedosto, jonka alasivukartat ovat samassa kansiossa."""
    source = os.environ.get("SITEMAP")
    if source:
        base = Path(source).parent
        name = Path(location).name if location != source else Path(source).name
        return (base / name).read_text(encoding="utf-8")
    # Cloudflare estää Pythonin oletus-User-Agentin (403), joten käytetään omaa.
    req = urllib.request.Request(location, headers={"User-Agent": "markokaartinen-net-julkaisu"})
    with urllib.request.urlopen(req, timeout=30) as res:
        return res.read().decode("utf-8")


def live_urls():
    """Livenä olevien sivujen osoitteet. Sivukartta on indeksi, jonka alasivukartat luetaan myös.
    Palauttaa None, jos karttaa ei saada (silloin oletetaan, että julkaisu tarvitaan)."""
    root = os.environ.get("SITEMAP") or mp.SITE_URL + "/sitemap.xml"
    try:
        urls = set()
        for loc in re.findall(r"<loc>([^<]*)</loc>", read(root)):
            if loc.endswith(".xml"):
                urls |= set(re.findall(r"<loc>([^<]*)</loc>", read(loc)))
            else:
                urls.add(loc)
    except Exception as e:
        print(f"Sivukarttaa ei saatu ({e}).")
        return None
    return urls


def publishable():
    """Julkaisuvalmiit artikkelit ja reseptit: ei luonnos ja päivämäärä mennyt."""
    now = datetime.now(mp.TZ)
    paths = sorted((mp.ROOT / "content").glob("[0-9][0-9][0-9][0-9]/*/index.md"))
    paths += sorted((mp.ROOT / "content" / "resepti").glob("*/index.md"))
    for path in paths:
        parsed = mp.parse(path)
        if not parsed:
            continue
        _, front = parsed
        date = mp.field(front, "date")
        if mp.field(front, "draft") == "true" or not date or mp.parse_date(date) > now:
            continue
        section = path.parent.parent.name
        slug = mp.field(front, "slug") or path.parent.name
        yield f"{mp.SITE_URL}/{section}/{slug}"


def main():
    live = live_urls()
    if live is None:
        julkaise = True
    else:
        missing = [u for u in publishable() if u not in live]
        for u in missing:
            print(f"Ei vielä livenä: {u}")
        julkaise = bool(missing)

    pending = list(mp.candidates())
    for i in pending:
        print(f"Odottaa Mastodon-postausta: {i['url']}")
    mastodon = bool(pending)

    if not julkaise and not mastodon:
        print("Ei mitään julkaistavaa.")

    out = os.environ.get("GITHUB_OUTPUT")
    lines = {
        "julkaise": julkaise,
        "mastodon": mastodon,
        "tarvitaan": julkaise or mastodon,
    }
    text = "".join(f"{k}={'true' if v else 'false'}\n" for k, v in lines.items())
    if out:
        with open(out, "a") as f:
            f.write(text)
    else:
        print(text, end="")
    return 0


if __name__ == "__main__":
    sys.exit(main())
