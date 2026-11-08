#!/usr/bin/env python3
"""
Vanhan Laravel-blogin artikkelien numerotunnisteet vanhaa /feed-syötettä varten.

Vanhan syötteen merkinnän tunniste oli https://markokaartinen.net/{artikkelin id}. Syötelukijat tunnistavat kirjoitukset
tunnisteen perusteella, joten samat tunnisteet säilytetään (muuten kaikki kirjoitukset näkyisivät lukijoissa uusina).
Lukee tuotannon SQLite-dumpin vain luku -tilassa ja kirjoittaa tiedoston data/legacy_ids.json muodossa {"vuosi/slug": id}.

Käyttö: python3 -I scripts/migrate/export_feed_ids.py --db import/database.sqlite --out data/legacy_ids.json
"""
import argparse
import json
import sqlite3


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--db', required=True)
    ap.add_argument('--out', required=True)
    args = ap.parse_args()

    con = sqlite3.connect('file:%s?mode=ro' % args.db, uri=True)
    ids = {'%s/%s' % (year, slug): aid for aid, year, slug in con.execute('select id, year, slug from articles order by id')}
    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump(ids, f, ensure_ascii=False, indent=0, sort_keys=True)
        f.write('\n')
    print('artikkeleita: %d' % len(ids))


if __name__ == '__main__':
    main()
