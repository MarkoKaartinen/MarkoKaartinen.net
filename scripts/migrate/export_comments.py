#!/usr/bin/env python3
"""
Vanhojen kommenttien (WordPress ja Laravel) vienti staattiseksi dataksi.

Lukee tuotannon SQLite-dumpin vain luku -tilassa ja kirjoittaa jokaisen artikkelin kansioon tiedoston
kommentit.json (content/{vuosi}/{slug}/kommentit.json). Sähköpostiosoitteita, IP-osoitteita tai kommentoijien
kotisivuja ei viedä. Kommenttien tekstistä sähköpostiosoitteet poistetaan (paitsi blogin omat ja esimerkkiosoitteet).
Teksti puhdistetaan: sallitaan vain linkit (http/https), lihavointi, kursivointi, lainaus ja rivinvaihdot.

Käyttö: python3 -I scripts/migrate/export_comments.py --db import/database.sqlite --content content
"""
import argparse
import html
import json
import os
import re
import sqlite3
import sys
from html.parser import HTMLParser

# Blogin kirjoittajan sähköpostit (kommentin kirjoittaja-merkintä, osoitteita ei viedä)
AUTHOR_EMAILS = {'markokaartinen@gmail.com', 'marko@markokaartinen.net', 'markok@twitter.com'}
# Näitä osoitteita ei poisteta kommenttien teksteistä
KEEP_EMAILS = re.compile(r'^(markokaartinen@gmail\.com|mie@markokaartinen\.net|[^@]+@domain\.fi|admin@pleikka\.fi|info@groupon\.fi|kampanj@veddesta-distribution\.se)$', re.I)
# Katkenneita nimiä (tietokannassa merkki & katkaisi nimen)
NAME_FIXES = {'Jyri Väät&': 'Jyri V.'}

EMAIL_RE = re.compile(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}')
URL_RE = re.compile(r'https?://[^\s<>"\']+')


def redact_emails(text, stats):
    def repl(m):
        if KEEP_EMAILS.match(m.group(0)):
            return m.group(0)
        stats['emails'] += 1
        return '[sähköposti poistettu]'
    return EMAIL_RE.sub(repl, text)


def link_html(url, label=None):
    return '<a href="%s" rel="nofollow ugc noopener" target="_blank">%s</a>' % (
        html.escape(url, quote=True), label if label is not None else html.escape(url))


class Cleaner(HTMLParser):
    """Puhdistaa vanhan kommentin HTML:n: vain a, strong, em, blockquote ja br säilyvät."""

    def __init__(self, stats):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.stack = []
        self.stats = stats

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            href = dict(attrs).get('href') or ''
            if re.match(r'^https?://', href, re.I):
                self.out.append('<a href="%s" rel="nofollow ugc noopener" target="_blank">' % html.escape(href, quote=True))
                self.stack.append('a')
        elif tag in ('strong', 'b'):
            self.out.append('<strong>')
            self.stack.append('strong')
        elif tag in ('em', 'i'):
            self.out.append('<em>')
            self.stack.append('em')
        elif tag == 'blockquote':
            self.out.append('<blockquote>')
            self.stack.append('blockquote')
        elif tag == 'br':
            self.out.append('\n')

    def handle_endtag(self, tag):
        name = {'b': 'strong', 'i': 'em'}.get(tag, tag)
        if name in self.stack:
            while self.stack:
                top = self.stack.pop()
                self.out.append('</%s>' % top)
                if top == name:
                    break

    def handle_data(self, data):
        data = redact_emails(data, self.stats)
        in_link = 'a' in self.stack
        parts = []
        pos = 0
        if not in_link:
            for m in URL_RE.finditer(data):
                url = m.group(0)
                trail = ''
                while url and url[-1] in '.,;:!?)':
                    trail = url[-1] + trail
                    url = url[:-1]
                parts.append(html.escape(data[pos:m.start()]))
                parts.append(link_html(url))
                parts.append(html.escape(trail))
                pos = m.end()
        parts.append(html.escape(data[pos:]))
        self.out.append(''.join(parts))

    def result(self):
        while self.stack:
            self.out.append('</%s>' % self.stack.pop())
        return ''.join(self.out)


def to_html(text, stats):
    text = (text or '').replace('\r\n', '\n').replace('\r', '\n').strip()
    c = Cleaner(stats)
    c.feed(text)
    c.close()
    body = c.result()
    paragraphs = [p.strip() for p in re.split(r'\n{2,}', body) if p.strip()]
    return ''.join('<p>%s</p>' % p.replace('\n', '<br>') for p in paragraphs)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--db', required=True)
    ap.add_argument('--content', required=True)
    args = ap.parse_args()

    con = sqlite3.connect('file:%s?mode=ro' % args.db, uri=True)
    con.row_factory = sqlite3.Row
    articles = {r['id']: (r['year'], r['slug']) for r in con.execute('select id, year, slug from articles')}

    stats = {'emails': 0}
    per_article = {}
    skipped = 0

    for r in con.execute('select id, name, email, body, article_id, created_at from legacy_comments order by created_at, id'):
        art = articles.get(r['article_id'])
        if not art:
            skipped += 1
            continue
        name = NAME_FIXES.get(r['name'], r['name']).strip()
        per_article.setdefault(art, []).append({
            'id': 'w%d' % r['id'],
            'name': name,
            'date': (r['created_at'] or '')[:10],
            'html': to_html(r['body'], stats),
            'parent': None,
            'author': (r['email'] or '').lower() in AUTHOR_EMAILS,
            'source': 'wp',
        })

    for r in con.execute("select id, nickname, email, comment, parent_id, commentable_id, created_at from comments where commentable_type like '%Article' order by created_at, id"):
        art = articles.get(r['commentable_id'])
        if not art:
            skipped += 1
            continue
        per_article.setdefault(art, []).append({
            'id': 'l%d' % r['id'],
            'name': r['nickname'].strip(),
            'date': (r['created_at'] or '')[:10],
            'html': to_html(r['comment'], stats),
            'parent': ('l%d' % r['parent_id']) if r['parent_id'] else None,
            'author': (r['email'] or '').lower() in AUTHOR_EMAILS,
            'source': 'laravel',
        })

    written = total = missing = 0
    for (year, slug), items in per_article.items():
        folder = os.path.join(args.content, str(year), slug)
        if not os.path.isfile(os.path.join(folder, 'index.md')):
            missing += 1
            print('Artikkelia ei löydy:', year, slug, file=sys.stderr)
            continue
        with open(os.path.join(folder, 'kommentit.json'), 'w', encoding='utf-8') as f:
            json.dump(items, f, ensure_ascii=False, indent=1)
            f.write('\n')
        written += 1
        total += len(items)

    print('artikkeleita: %d, kommentteja: %d, ohitettu: %d, artikkeli puuttuu: %d, sähköposteja poistettu tekstistä: %d' % (
        written, total, skipped, missing, stats['emails']))


if __name__ == '__main__':
    main()
