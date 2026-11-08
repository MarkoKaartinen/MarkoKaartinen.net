#!/usr/bin/env python3
"""
Tarkistaa siirretyn sisällön: kuvat löytyvät, sisäiset linkit osoittavat olemassa oleviin sivuihin.
Käyttö: python3 scripts/migrate/validate.py <content-kansio>
"""
import os
import re
import sys
from collections import Counter

root = sys.argv[1]
articles = set()
for y in os.listdir(root):
    p = os.path.join(root, y)
    if os.path.isdir(p) and y.isdigit():
        for s in os.listdir(p):
            if os.path.isfile(os.path.join(p, s, 'index.md')):
                articles.add('/%s/%s' % (y, s))

known_pages = {'/', '/blogi', '/tietoa', '/nyt', '/linkit', '/haku', '/vieraskirja', '/reseptit', '/kategoriat',
               '/avainsanat', '/sarjat', '/ai', '/pelihaaste', '/kahvilaskuri'}
missing_images, bad_links, external_imgs = [], [], Counter()
terms = {'kategoria': set(), 'avainsana': set(), 'sarja': set()}
n = 0
for y in sorted(os.listdir(root)):
    yp = os.path.join(root, y)
    if not (os.path.isdir(yp) and y.isdigit()):
        continue
    for s in sorted(os.listdir(yp)):
        idx = os.path.join(yp, s, 'index.md')
        if not os.path.isfile(idx):
            continue
        n += 1
        text = open(idx, encoding='utf-8').read()
        body = text.split('\n---\n', 1)[1] if text.startswith('---') else text
        for m in re.finditer(r'!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)', body):
            url = m.group(1)
            if re.match(r'^(https?:)?//', url):
                external_imgs[re.match(r'^(?:https?:)?//([^/]+)', url).group(1)] += 1
            elif not os.path.isfile(os.path.join(yp, s, url)):
                missing_images.append('%s/%s: %s' % (y, s, url))
        for m in re.finditer(r'(?<!!)\[[^\]]*\]\((/[^)\s]*)(?:\s+"[^"]*")?\)', body):
            url = m.group(1).split('#')[0].split('?')[0].rstrip('/') or '/'
            if url in articles or url in known_pages:
                continue
            mm = re.match(r'^/(kategoria|avainsana|sarja)/(.+)$', url)
            if mm:
                terms[mm.group(1)].add(mm.group(2))
                continue
            bad_links.append('%s/%s: %s' % (y, s, m.group(1)))

print('artikkelit:', n)
print('puuttuvat kuvat:', len(missing_images))
for x in missing_images[:20]:
    print('  ', x)
print('ulkoiset kuvat (domain):', dict(external_imgs.most_common(8)), 'yht.', sum(external_imgs.values()))
print('rikkinäiset sisäiset linkit:', len(bad_links))
for x in bad_links[:25]:
    print('  ', x)
print('taksonomialinkkejä (tarkistetaan buildista):', {k: len(v) for k, v in terms.items()})
